<?php
/**
 * Proxy formulaire → Zapier Catch Hook (évite le blocage CORS du navigateur).
 * Requis : hébergement PHP (ex. WAMP). Ne pas exposer ce fichier sans HTTPS en production.
 */
declare(strict_types=1);

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
curl_close($ch);

if ($errno !== 0 || $response === false) {
	http_response_code(502);
	echo json_encode(['ok' => false, 'error' => 'Upstream request failed']);
	exit;
}

if ($httpCode < 200 || $httpCode >= 300) {
	http_response_code(502);
	echo json_encode(['ok' => false, 'error' => 'Zapier returned an error', 'status' => $httpCode]);
	exit;
}

// Renvoyer la réponse Zapier telle quelle (souvent {"status":"success",...})
header('Content-Type: application/json; charset=utf-8');
http_response_code(200);
echo $response;
