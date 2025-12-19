<?php
declare(strict_types=1);

// Shared bootstrap for front controllers.
if (!defined('PROJECT_ROOT')) {
    define('PROJECT_ROOT', dirname(__DIR__));
}

if (!defined('APP_PATH')) {
    define('APP_PATH', PROJECT_ROOT . DIRECTORY_SEPARATOR . 'app');
}

if (!defined('TEMPLATE_PATH')) {
    define('TEMPLATE_PATH', APP_PATH . DIRECTORY_SEPARATOR . 'templates');
}

$scriptName = $_SERVER['SCRIPT_NAME'] ?? '';
$scriptDir = dirname($scriptName);
$basePath = rtrim(str_replace('\\', '/', $scriptDir), '/');

if ($basePath === '' || $basePath === '.') {
    $basePath = '/';
} else {
    $basePath .= '/';
}

if (!defined('BASE_PATH')) {
    define('BASE_PATH', $basePath);
}

require APP_PATH . DIRECTORY_SEPARATOR . 'includes' . DIRECTORY_SEPARATOR . 'db.php';
