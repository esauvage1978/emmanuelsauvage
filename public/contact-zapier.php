<?php
/**
 * Proxy formulaire → Zapier Catch Hook (évite le blocage CORS du navigateur).
 * Requis : hébergement PHP (ex. WAMP). Ne pas exposer ce fichier sans HTTPS en production.
 */
declare(strict_types=1);

function contact_journal_dir(): ?string
{
	$candidates = [dirname(__DIR__) . '/contact-journal', __DIR__ . '/_contact-journal'];
	foreach ($candidates as $dir) {
		if (!is_dir($dir)) {
			@mkdir($dir, 0700, true);
		}
		if (is_dir($dir) && is_writable($dir)) {
			if (str_starts_with($dir, __DIR__)) {
				if (!is_file($dir . '/.htaccess')) {
					@file_put_contents($dir . '/.htaccess', "Require all denied\nDeny from all\n");
				}
				if (!is_file($dir . '/index.html')) {
					@file_put_contents($dir . '/index.html', '');
				}
			}
			return $dir;
		}
	}

	return null;
}

function contact_journal_write(array $entry): void
{
	try {
		$dir = contact_journal_dir();
		if ($dir === null) {
			error_log('[contact-journal] dossier non inscriptible');

			return;
		}
		$file = $dir . '/demandes-' . gmdate('Y-m') . '.jsonl';
		$ok = @file_put_contents(
			$file,
			json_encode($entry, JSON_UNESCAPED_UNICODE) . "\n",
			FILE_APPEND | LOCK_EX
		);
		if ($ok === false) {
			error_log('[contact-journal] écriture impossible: ' . $file);
		}
		$limit = gmdate('Y-m', strtotime('first day of -2 months'));
		foreach ((array) glob($dir . '/demandes-*.jsonl') as $old) {
			if (preg_match('/demandes-(\d{4}-\d{2})\.jsonl$/', (string) $old, $m) && $m[1] < $limit) {
				@unlink((string) $old);
			}
		}
	} catch (Throwable $e) {
		error_log('[contact-journal] ' . $e->getMessage());
	}
}

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	http_response_code(405);
	echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
	exit;
}

$raw = file_get_contents('php://input');
if ($raw === false || $raw === '') {
	http_response_code(400);
	echo json_encode(['ok' => false, 'error' => 'Empty body']);
	exit;
}

$data = json_decode($raw, true);
if (!is_array($data)) {
	http_response_code(400);
	echo json_encode(['ok' => false, 'error' => 'Invalid JSON']);
	exit;
}

$name = isset($data['name']) ? trim((string) $data['name']) : '';
$email = isset($data['email']) ? trim((string) $data['email']) : '';
$message = isset($data['message']) ? trim((string) $data['message']) : '';
$company = isset($data['company']) ? trim((string) $data['company']) : '—';
$submittedAt = isset($data['submitted_at']) ? trim((string) $data['submitted_at']) : gmdate('c');

if ($name === '' || $email === '' || $message === '') {
	http_response_code(400);
	echo json_encode(['ok' => false, 'error' => 'Missing required fields']);
	exit;
}

$payload = json_encode(
	[
		'name' => $name,
		'company' => $company !== '' ? $company : '—',
		'email' => $email,
		'message' => $message,
		'submitted_at' => $submittedAt,
	],
	JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR
);

$journalId = bin2hex(random_bytes(6));
$ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '?');
$host = (string) ($_SERVER['HTTP_HOST'] ?? '');
contact_journal_write([
	'id' => $journalId,
	'etape' => 'recue',
	'ip' => $ip,
	'host' => $host,
	'name' => $name,
	'company' => $company !== '' ? $company : '—',
	'email' => $email,
	'message' => $message,
	'submitted_at' => $submittedAt,
]);

$hook = 'https://hooks.zapier.com/hooks/catch/26903545/upkex8r/';

$ch = curl_init($hook);
curl_setopt_array($ch, [
	CURLOPT_POST => true,
	CURLOPT_POSTFIELDS => $payload,
	CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_TIMEOUT => 20,
]);

$response = curl_exec($ch);
$errno = curl_errno($ch);
$httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($errno !== 0 || $response === false) {
	contact_journal_write([
		'id' => $journalId,
		'etape' => 'echec',
		'at' => gmdate('c'),
		'http' => $httpCode,
		'curl' => $curlError !== '' ? $curlError : 'curl errno ' . $errno,
		'reponse' => substr((string) $response, 0, 300),
	]);
	http_response_code(502);
	echo json_encode(['ok' => false, 'error' => 'Upstream request failed']);
	exit;
}

if ($httpCode < 200 || $httpCode >= 300) {
	contact_journal_write([
		'id' => $journalId,
		'etape' => 'echec',
		'at' => gmdate('c'),
		'http' => $httpCode,
		'curl' => $curlError,
		'reponse' => substr((string) $response, 0, 300),
	]);
	http_response_code(502);
	echo json_encode(['ok' => false, 'error' => 'Zapier returned an error', 'status' => $httpCode]);
	exit;
}

contact_journal_write([
	'id' => $journalId,
	'etape' => 'envoyee',
	'at' => gmdate('c'),
	'http' => $httpCode,
]);

header('Content-Type: application/json; charset=utf-8');
http_response_code(200);
echo $response;