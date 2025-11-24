<?php
require __DIR__ . '/includes/db.php';

function renderNewsSection(mysqli $mysqli): string
{
    $sql = 'SELECT category_key, category_label, title, excerpt, image_main, image_thumb, author_name, posted_on
            FROM news_posts
            ORDER BY id DESC
            LIMIT 3';

    $articlesHtml = '';

    try {
        $result = $mysqli->query($sql);
    } catch (Throwable $exception) {
        $result = false;
    }

    if ($result instanceof mysqli_result) {
        while ($row = $result->fetch_assoc()) {
            $categoryKey = htmlspecialchars((string) ($row['category_key'] ?? ''), ENT_QUOTES);
            $categoryLabel = htmlspecialchars((string) ($row['category_label'] ?? ''), ENT_QUOTES);
            $title = htmlspecialchars((string) ($row['title'] ?? ''), ENT_QUOTES);
            $excerpt = htmlspecialchars((string) ($row['excerpt'] ?? ''), ENT_QUOTES);
            $imageMain = htmlspecialchars((string) ($row['image_main'] ?? ''), ENT_QUOTES);
            $imageThumb = htmlspecialchars((string) ($row['image_thumb'] ?? ''), ENT_QUOTES);
            $authorName = htmlspecialchars((string) ($row['author_name'] ?? ''), ENT_QUOTES);
            $postedOn = htmlspecialchars((string) ($row['posted_on'] ?? ''), ENT_QUOTES);

            $articlesHtml .= '
                            <article class="news-item" data-news-type="' . $categoryKey . '">
                                <a href="#" class="news-link"></a>
                                <header class="news-header">
                                    <a href="#" class="news-type">' . $categoryLabel . '</a>
                                    <img src="' . $imageMain . '" alt="">
                                </header>
                                <h3><a href="#">' . $title . '</a></h3>
                                <p>' . $excerpt . '</p>
                                <a class="news-readmore">Read More</a>
                                <footer class="news-footer">
                                    <img src="' . $imageThumb . '" alt="">
                                    <p>Posted by ' . $authorName . '</p>
                                    <p>' . $postedOn . '</p>
                                </footer>
                            </article>';
        }

        $result->free();
    }

    if ($articlesHtml === '') {
        $articlesHtml = '
                            <p>No news posts are available.</p>';
    }

    return '
                <section id="section-news">
                    <div id="news-container" class="container">
                        <header><h2>Latest News</h2></header>
                        <div class="news-list">' . $articlesHtml . '
                        </div>
                        <a href="#">View All <i class="fa-solid fa-arrow-right"></i></a>
                    </div>
                </section>';
}

$indexFile = __DIR__ . '/index.php.html';
$mainHtml = '';

if (is_readable($indexFile)) {
    $html = file_get_contents($indexFile);

    if ($html !== false) {
        $sectionStart = strpos($html, '<section id="section-news"');

        if ($sectionStart !== false) {
            $sectionEnd = strpos($html, '</section>', $sectionStart);

            if ($sectionEnd !== false) {
                $sectionEnd += strlen('</section>');

                $before = substr($html, 0, $sectionStart);
                $after = substr($html, $sectionEnd);

                $html = $before . renderNewsSection($mysqli) . $after;
            }
        }

        $mainStart = strpos($html, '<main');
        $mainEnd = strrpos($html, '</main>');

        if ($mainStart !== false && $mainEnd !== false) {
            $mainEnd += strlen('</main>');
            $mainHtml = substr($html, $mainStart, $mainEnd - $mainStart);
        }
    }
}

include __DIR__ . '/includes/header.php';
echo $mainHtml;
include __DIR__ . '/includes/footer.php';

