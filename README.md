# Netmatters Rebuild (PHP)

Rebuilt Netmatters page with a simple PHP front end, MySQL-backed news, and SCSS/CSS/JS assets.

## Project Structure
- `public/` — web root (front controllers `index.php`, `contact-us.php`, and all assets).
- `app/` — PHP includes (`app/includes`) and templates (`app/templates`).
- `scss/` — source styles if you need to recompile.
- `.env` — local environment variables (not committed).

## Requirements
- PHP 8.1+ with mysqli extension
- MySQL (or MariaDB)

## Setup
1) Copy `.env` and set your DB credentials:
```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=netmatters
DB_USER=root
DB_PASSWORD=secret
```
2) Create tables and optional seed data by importing the SQL dump:
```
mysql -u your_user -p netmatters < db/schema.sql
```
3) From the project root, run the PHP dev server pointed at `public/`:
```
php -S localhost:8000 -t public
```
4) Visit `http://localhost:8000/` (contact form at `/contact-us.php`).

## Notes
- Keep `.env` out of version control (covered by `.gitignore`).
- If using Apache and cannot set the docroot to `public/`, add a root `.htaccess` to rewrite into `public/` and block `.env`.
