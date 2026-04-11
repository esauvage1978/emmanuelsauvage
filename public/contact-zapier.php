<?php
/**
 * Proxy formulaire → webhook (webhooky.builders — évite le blocage CORS du navigateur).
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
$objet = isset($data['objet']) ? trim((string) $data['objet']) : '';
$objetLabel = isset($data['objet_label']) ? trim((string) $data['objet_label']) : '';
if ($objetLabel === '') {
	$objetLabel = $objet;
}
$company = isset($data['company']) ? trim((string) $data['company']) : '—';
$source = isset($data['source']) ? trim((string) $data['source']) : '';
if ($source === '') {
	$source = 'emmanuelsauvage';
}
$page = isset($data['page']) ? trim((string) $data['page']) : '';
$submittedAt = isset($data['submitted_at']) ? trim((string) $data['submitted_at']) : gmdate('c');
$privacyAt = isset($data['privacy_policy_accepted_at']) ? trim((string) $data['privacy_policy_accepted_at']) : '';
$privacyRaw = $data['privacy_policy_accepted'] ?? false;
$privacyAccepted = $privacyRaw === true || $privacyRaw === 1 || $privacyRaw === '1' || $privacyRaw === 'true';

$budgetRange = isset($data['budget_range']) ? trim((string) $data['budget_range']) : '';
$budgetRangeLabel = isset($data['budget_range_label']) ? trim((string) $data['budget_range_label']) : '';
if ($budgetRangeLabel === '') {
	$budgetRangeLabel = $budgetRange;
}
$urgency = isset($data['urgency']) ? trim((string) $data['urgency']) : '';
$urgencyLabel = isset($data['urgency_label']) ? trim((string) $data['urgency_label']) : '';
if ($urgencyLabel === '') {
	$urgencyLabel = $urgency;
}
$projectType = isset($data['project_type']) ? trim((string) $data['project_type']) : '';
$projectTypeLabel = isset($data['project_type_label']) ? trim((string) $data['project_type_label']) : '';
if ($projectTypeLabel === '') {
	$projectTypeLabel = $projectType;
}

if ($name === '' || $email === '' || $objet === '' || $message === '') {
	http_response_code(400);
	echo json_encode(['ok' => false, 'error' => 'Missing required fields']);
	exit;
}

if (!$privacyAccepted) {
	http_response_code(400);
	echo json_encode(['ok' => false, 'error' => 'Privacy policy must be accepted']);
	exit;
}

if ($privacyAt === '') {
	$privacyAt = $submittedAt;
}

$payload = json_encode(
	[
		'name' => $name,
		'company' => $company !== '' ? $company : '—',
		'email' => $email,
		'objet' => $objet,
		'objet_label' => $objetLabel,
		'message' => $message,
		'budget_range' => $budgetRange,
		'budget_range_label' => $budgetRangeLabel !== '' ? $budgetRangeLabel : '—',
		'urgency' => $urgency,
		'urgency_label' => $urgencyLabel !== '' ? $urgencyLabel : '—',
		'project_type' => $projectType,
		'project_type_label' => $projectTypeLabel !== '' ? $projectTypeLabel : '—',
		'source' => $source,
		'page' => $page,
		'privacy_policy_accepted' => true,
		'privacy_policy_accepted_at' => $privacyAt,
		'submitted_at' => $submittedAt,
	],
	JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR
);

/*
 * URL du formulaire Webhooky : à copier depuis le tableau de bord (Formulaire → URL d’ingestion).
 * Si vous voyez « Webhook inconnu » côté site : le jeton dans l’URL est invalide ou le workflow est désactivé.
 */
$hook = getenv('CONTACT_WEBHOOK_URL') ?: 'https://webhooky.builders/webhook/form/0b40160efaa3f78eab00-cd38-4cbb-9e57-46796830e108';

$ch = curl_init($hook);
curl_setopt_array($ch, [
	CURLOPT_POST => true,
	CURLOPT_POSTFIELDS => $payload,
	CURLOPT_HTTPHEADER => ['Content-Type: application/json; charset=utf-8'],
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_TIMEOUT => 25,
	CURLOPT_CONNECTTIMEOUT => 12,
	CURLOPT_SSL_VERIFYPEER => true,
	/* Évite des blocages longs si la résolution IPv6 / la connexion sortante échoue lentement (souvent sous Windows / WAMP). */
	CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4,
]);

$response = curl_exec($ch);
$errno = curl_errno($ch);
$httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($errno !== 0 || $response === false) {
	http_response_code(502);
	echo json_encode([
		'ok' => false,
		'error' => 'Webhook injoignable (réseau ou TLS)',
		'detail' => $errno !== 0 ? 'curl: ' . curl_strerror($errno) : 'empty response',
	], JSON_UNESCAPED_UNICODE);
	exit;
}

if ($httpCode < 200 || $httpCode >= 300) {
	$decoded = json_decode((string) $response, true);
	$upstreamMessage = '';
	if (is_array($decoded)) {
		if (isset($decoded['error']) && is_string($decoded['error'])) {
			$upstreamMessage = $decoded['error'];
		} elseif (isset($decoded['message']) && is_string($decoded['message'])) {
			$upstreamMessage = $decoded['message'];
		}
	}
	http_response_code(502);
	echo json_encode([
		'ok' => false,
		'error' => 'Le service webhook a refusé ou ignoré la requête',
		'status' => $httpCode,
		'detail' => $upstreamMessage !== '' ? $upstreamMessage : 'HTTP ' . $httpCode,
	], JSON_UNESCAPED_UNICODE);
	exit;
}

// Renvoyer la réponse du webhook telle quelle (souvent {"status":"success",...})
header('Content-Type: application/json; charset=utf-8');
http_response_code(200);
echo $response;
