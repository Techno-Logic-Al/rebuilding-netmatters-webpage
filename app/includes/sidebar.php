<?php
declare(strict_types=1);

$templateRoot = defined('TEMPLATE_PATH')
    ? TEMPLATE_PATH
    : dirname(__DIR__) . DIRECTORY_SEPARATOR . 'templates';
$indexFile = $templateRoot . DIRECTORY_SEPARATOR . 'index.html';

if (!is_readable($indexFile)) {
    return;
}

$html = file_get_contents($indexFile);

if ($html === false) {
    return;
}

$start = strpos($html, '<aside id="site-sidebar"');

if ($start === false) {
    return;
}

$end = strpos($html, '</aside>', $start);

if ($end === false) {
    return;
}

$end += strlen('</aside>');

echo substr($html, $start, $end - $start);

