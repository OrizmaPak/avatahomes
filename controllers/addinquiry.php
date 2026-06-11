<?php

declare(strict_types=1);

header('Content-Type: application/json');

require_once __DIR__ . DIRECTORY_SEPARATOR . 'inquiry_store.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => false,
        'code' => 405,
        'message' => 'Method not allowed',
    ]);
    exit;
}

$requiredFields = [
    'firstname',
    'lastname',
    'othernames',
    'email',
    'phone',
    'address',
    'inquirytype',
    'moredetails',
];

$payload = [];
foreach ($requiredFields as $field) {
    $payload[$field] = trim((string)($_POST[$field] ?? ''));
    if ($payload[$field] === '') {
        echo json_encode([
            'status' => false,
            'code' => 422,
            'message' => ucfirst($field) . ' is required',
        ]);
        exit;
    }
}

if (!filter_var($payload['email'], FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'status' => false,
        'code' => 422,
        'message' => 'Email is not valid',
    ]);
    exit;
}

$rows = load_inquiries();
$row = [
    'id' => (string)round(microtime(true) * 1000),
    'firstname' => $payload['firstname'],
    'lastname' => $payload['lastname'],
    'othernames' => $payload['othernames'],
    'email' => $payload['email'],
    'phone' => $payload['phone'],
    'address' => $payload['address'],
    'inquirytype' => $payload['inquirytype'],
    'inquirytype_label' => normalize_inquiry_type($payload['inquirytype']),
    'moredetails' => $payload['moredetails'],
    'role' => trim((string)($_POST['role'] ?? 'STAFF')) ?: 'STAFF',
    'created_at' => date('Y-m-d H:i:s'),
];

$rows[] = $row;

if (!save_inquiries($rows)) {
    echo json_encode([
        'status' => false,
        'code' => 500,
        'message' => 'Unable to save inquiry',
    ]);
    exit;
}

echo json_encode([
    'status' => true,
    'code' => 200,
    'message' => 'Inquiry saved successfully',
    'data' => $row,
]);
