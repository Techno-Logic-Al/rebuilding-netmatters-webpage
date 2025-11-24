<?php
declare(strict_types=1);

$root = dirname(__DIR__);
$indexFile = $root . DIRECTORY_SEPARATOR . 'index.php.html';

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

