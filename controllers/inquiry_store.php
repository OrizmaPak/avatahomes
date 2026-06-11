<?php

declare(strict_types=1);

function inquiry_storage_dir(): string
{
    return __DIR__ . DIRECTORY_SEPARATOR . 'storage';
}

function inquiry_storage_file(): string
{
    return inquiry_storage_dir() . DIRECTORY_SEPARATOR . 'inquiries.json';
}

function ensure_inquiry_storage(): void
{
    $dir = inquiry_storage_dir();
    if (!is_dir($dir)) {
        mkdir($dir, 0777, true);
    }

    $file = inquiry_storage_file();
    if (!file_exists($file)) {
        file_put_contents($file, json_encode([], JSON_PRETTY_PRINT));
    }
}

function load_inquiries(): array
{
    ensure_inquiry_storage();

    $file = inquiry_storage_file();
    $content = file_get_contents($file);
    if ($content === false || trim($content) === '') {
        return [];
    }

    $data = json_decode($content, true);
    return is_array($data) ? $data : [];
}

function save_inquiries(array $rows): bool
{
    ensure_inquiry_storage();
    return file_put_contents(
        inquiry_storage_file(),
        json_encode(array_values($rows), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES),
        LOCK_EX
    ) !== false;
}

function normalize_inquiry_type(string $value): string
{
    return match ($value) {
        'BUY_PROPERTY' => 'Buy Property',
        'GENERAL_INQUIRY' => 'General Inquiry',
        default => $value,
    };
}

function filter_inquiries(array $rows, ?string $id = null, ?string $startDate = null, ?string $endDate = null): array
{
    $filtered = array_filter($rows, static function (array $row) use ($id, $startDate, $endDate): bool {
        if ($id !== null && $id !== '' && (string)($row['id'] ?? '') !== (string)$id) {
            return false;
        }

        $createdDate = substr((string)($row['created_at'] ?? ''), 0, 10);
        if ($startDate !== null && $startDate !== '' && $createdDate < $startDate) {
            return false;
        }
        if ($endDate !== null && $endDate !== '' && $createdDate > $endDate) {
            return false;
        }

        return true;
    });

    usort($filtered, static function (array $left, array $right): int {
        return strcmp((string)($right['created_at'] ?? ''), (string)($left['created_at'] ?? ''));
    });

    return array_values($filtered);
}
