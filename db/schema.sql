-- SQL dump to provision local database schema and seed example data.
-- Import with: mysql -u your_user -p netmatters < db/schema.sql

CREATE TABLE IF NOT EXISTS news_posts (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_key VARCHAR(50) NOT NULL,
    category_label VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT NOT NULL,
    image_main VARCHAR(255) NOT NULL,
    image_thumb VARCHAR(255) NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    posted_on VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS enquiries (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    company VARCHAR(150) DEFAULT NULL,
    email VARCHAR(190) NOT NULL,
    telephone VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    marketing_consent TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Optional example news rows (remove if you prefer an empty table)
INSERT INTO news_posts (category_key, category_label, title, excerpt, image_main, image_thumb, author_name, posted_on)
VALUES
    ('news', 'News', 'How can AI help your business?', 'Quick ways AI tooling can improve everyday workflows.', 'assets/images/news/how-can-ai-L9M0.png', 'assets/images/news/thumbnails/bethany-shakespeare-F6Iu.webp', 'Netmatters Team', '12th Dec 2025'),
    ('news', 'News', 'How much could downtime cost?', 'Understanding the risk and cost of unplanned outages.', 'assets/images/news/how-much-could-vKZG.png', 'assets/images/news/thumbnails/netmatters-ltd-VXAv.webp', 'Netmatters Team', '5th Dec 2025'),
    ('news', 'Insights', 'Hiring a 1st line technician', 'What we look for when adding support technicians.', 'assets/images/news/1st-line-technician-1QNr.png', 'assets/images/news/thumbnails/netmatters-ltd-VXAv.webp', 'Netmatters Team', '28th Nov 2025');
