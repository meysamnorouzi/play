# Deployment Guide

## Server Configuration

This Vite React app requires proper server configuration to work correctly. The main issue is ensuring JavaScript modules are served with the correct MIME type and that the server handles client-side routing.

### Apache Server (.htaccess)

The `.htaccess` file is automatically copied from `public/.htaccess` to `dist/.htaccess` during build.

**Requirements:**
- `mod_rewrite` must be enabled
- `mod_mime` must be enabled
- `mod_headers` must be enabled (optional, for CORS)

**Enable modules:**
```bash
sudo a2enmod rewrite
sudo a2enmod mime
sudo a2enmod headers
sudo systemctl restart apache2
```

### Nginx (Engine X) – required for this app

The app is at **https://typeagain.ir/parent-app/** and needs Nginx to serve `.js`/`.css` with the right MIME type. Without this, you get: *"Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of text/html"*.

**Step 1 – Deploy files**

- Build: `npm run build`
- On the server, put the **contents** of `dist/` inside a folder that will be the “parent-app” path, e.g.:
  - `/var/www/typeagain.ir/parent-app/` (or your real web root)
- So you must have:
  - `…/parent-app/index.html`
  - `…/parent-app/assets/index.XXXXX.js`
  - `…/parent-app/assets/index.XXXXX.css`

**Step 2 – Add Nginx config**

On the server, edit the Nginx config for `typeagain.ir` (e.g. `/etc/nginx/sites-available/typeagain.ir` or inside `http { }` in `nginx.conf`).

Set `root` to the directory that **contains** the `parent-app` folder (e.g. `/var/www/typeagain.ir`). Then add these blocks **inside** the `server { }` for `typeagain.ir`:

```nginx
# 1) Serve JS under /parent-app/assets/ with correct MIME type (fixes the error)
location ~ ^/parent-app/assets/.*\.(js|mjs)$ {
    add_header Content-Type application/javascript;
    add_header Cache-Control "public, max-age=31536000, immutable";
    try_files $uri =404;
}

# 2) Serve CSS under /parent-app/assets/
location ~ ^/parent-app/assets/.*\.css$ {
    add_header Content-Type text/css;
    add_header Cache-Control "public, max-age=31536000, immutable";
    try_files $uri =404;
}

# 3) SPA: all other /parent-app/ requests → index.html
location /parent-app/ {
    try_files $uri $uri/ /parent-app/index.html;
}
```

**Step 3 – Reload Nginx**

```bash
sudo nginx -t
sudo systemctl reload nginx
```

**Step 4 – Check**

- Open https://typeagain.ir/parent-app/
- In DevTools → Network, the request to `parent-app/assets/index.….js` should have status 200 and type `application/javascript`, not HTML.

A full example is in **`nginx.conf.example`** (for app at subpath).

### Common Issues

#### Issue: "Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html""

This means the server is returning `index.html` when the browser requests a `.js` file (e.g. `/parent-app/assets/index.xxx.js`). The server must serve the real file with `Content-Type: application/javascript`.

**Solution:**
1. **Nginx:** Use the `/parent-app/` block in `nginx.conf.example`. The important part is a `location` that matches `/parent-app/assets/*.js` and serves the file with `add_header Content-Type application/javascript` and `try_files $uri =404` (so it never falls back to index.html for JS).
2. **Apache:** The `.htaccess` uses `RewriteBase /parent-app/` and only rewrites when `!-f` (file does not exist). Ensure the `dist/` contents are deployed so that `https://yoursite.com/parent-app/assets/` maps to the real `assets` folder.
3. Verify that `dist/assets/` contains the built `.js` and `.css` files and that the server document root (or alias for `/parent-app`) points at the folder that contains `index.html` and `assets/`.

#### Issue: White page / 404 errors on routes

**Solution:**
- Ensure the server is configured to fallback to `index.html` for all routes (SPA routing)
- Check `.htaccess` rewrite rules or nginx `try_files` directive

### Build and Deploy

1. Build the app:
```bash
npm run build
```

2. Deploy the `dist/` folder contents to your server

3. Ensure server configuration files (`.htaccess` or nginx config) are in place

4. Verify file permissions:
```bash
chmod 644 dist/.htaccess
chmod 644 dist/index.html
chmod 644 dist/assets/*
```

### Testing

After deployment, test:
1. Main page loads correctly
2. JavaScript files load (check Network tab in browser DevTools)
3. Client-side routing works (navigate to different routes)
4. No console errors about MIME types
