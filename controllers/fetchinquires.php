<?php

declare(strict_types=1);

header('Content-Type: application/json');

require_once __DIR__ . DIRECTORY_SEPARATOR . 'inquiry_store.php';

$id = trim((string)($_REQUEST['id'] ?? ''));
$startDate = trim((string)($_REQUEST['startdate'] ?? ''));
$endDate = trim((string)($_REQUEST['enddate'] ?? ''));

$rows = load_inquiries();
$filtered = filter_inquiries(
    $rows,
    $id !== '' ? $id : null,
    $startDate !== '' ? $startDate : null,
    $endDate !== '' ? $endDate : null
);

echo json_encode([
    'status' => true,
    'code' => 200,
    'message' => count($filtered) ? 'Inquiries retrieved successfully' : 'No inquiries found',
    'data' => $filtered,
]);
