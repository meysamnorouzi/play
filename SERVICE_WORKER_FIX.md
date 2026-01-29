# Service Worker MIME Type Issue - Fix Guide

## The Problem

The error `Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html"` for `registerSW.js` occurs because:

1. **The server is returning HTML instead of JavaScript** - This means the rewrite rules in `.htaccess` are catching `registerSW.js` and redirecting it to `index.html`
2. **The `.htaccess` file might not be processed** - Apache might not be configured to allow `.htaccess` overrides
3. **The file check happens after the rewrite** - The order of rules matters in Apache

## Root Cause

Yes, this is related to the service worker! The `vite-plugin-pwa` plugin automatically injects a `<script>` tag that loads `/registerSW.js`. When the server tries to serve this file, the rewrite rules catch it and return `index.html` instead, causing the MIME type error.

## Solutions (Try in Order)

### Solution 1: Verify .htaccess is Working

**Check if `.htaccess` is being processed:**

1. **Verify file exists:**
   ```bash
   ls -la /path/to/dist/.htaccess
   ```

2. **Check Apache configuration:**
   ```bash
   # Check if AllowOverride is set
   grep -r "AllowOverride" /etc/apache2/sites-available/
   # Should show: AllowOverride All
   ```

3. **Test .htaccess syntax:**
   ```bash
   apache2ctl configtest
   ```

4. **Check Apache error logs:**
   ```bash
   tail -f /var/log/apache2/error.log
   # Look for .htaccess related errors
   ```

### Solution 2: Fix Apache Configuration

**If `AllowOverride` is set to `None`, update your Apache virtual host:**

```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    DocumentRoot /path/to/dist
    
    <Directory /path/to/dist>
        AllowOverride All  # Change from None to All
        Options -Indexes +FollowSymLinks
        Require all granted
    </Directory>
</VirtualHost>
```

Then restart Apache:
```bash
sudo systemctl restart apache2
```

### Solution 3: Move Rules to Virtual Host (If .htaccess Doesn't Work)

**If `.htaccess` still doesn't work, move the rules directly to your Apache config:**

```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    DocumentRoot /path/to/dist
    
    <Directory /path/to/dist>
        AllowOverride None
        Require all granted
        
        # Set MIME types
        <IfModule mod_mime.c>
            AddType application/javascript .js
            AddType application/javascript .mjs
        </IfModule>
        
        # Rewrite rules
        <IfModule mod_rewrite.c>
            RewriteEngine On
            RewriteBase /
            
            # CRITICAL: Check if file exists FIRST
            RewriteCond %{REQUEST_FILENAME} -f
            RewriteRule . - [L]
            
            # Explicitly exclude registerSW.js
            RewriteCond %{REQUEST_URI} ^/registerSW\.js$ [NC]
            RewriteRule . - [L]
            
            # Exclude service worker files
            RewriteCond %{REQUEST_URI} ^/(sw\.js|workbox-.*\.js)$ [NC]
            RewriteRule . - [L]
            
            # Exclude assets directory
            RewriteCond %{REQUEST_URI} ^/assets/ [NC]
            RewriteRule . - [L]
            
            # Exclude files by extension
            RewriteCond %{REQUEST_URI} \.(js|mjs|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|webp|json|xml|webmanifest)$ [NC]
            RewriteRule . - [L]
            
            # Everything else goes to index.html
            RewriteRule . /index.html [L]
        </IfModule>
    </Directory>
</VirtualHost>
```

### Solution 4: Disable Service Worker (Temporary Fix)

**If you don't need the service worker right now, you can disable it:**

In `vite.config.ts`, change:
```typescript
VitePWA({
  registerType: 'autoUpdate',
  // ... rest of config
})
```

To:
```typescript
VitePWA({
  registerType: 'autoUpdate',
  injectRegister: false, // Disable automatic registration
  // ... rest of config
})
```

Then manually register the service worker in your code if needed.

### Solution 5: Test Direct File Access

**Verify the file is accessible:**

1. **On your server, check the file exists:**
   ```bash
   ls -la /path/to/dist/registerSW.js
   cat /path/to/dist/registerSW.js
   ```

2. **Test direct URL access:**
   - Open: `https://yourdomain.com/registerSW.js`
   - **Expected:** Should see JavaScript code: `if('serviceWorker' in navigator)...`
   - **If you see HTML:** The rewrite rules are still catching it

3. **Check browser Network tab:**
   - Open DevTools → Network tab
   - Reload the page
   - Find `registerSW.js` in the list
   - Check the Response - it should be JavaScript, not HTML

## Quick Diagnostic Commands

```bash
# 1. Check if file exists
ls -la dist/registerSW.js

# 2. Check Apache modules
apache2ctl -M | grep -E "(rewrite|mime)"

# 3. Check Apache config
apache2ctl -S

# 4. Test configuration
apache2ctl configtest

# 5. Check file permissions
ls -la dist/.htaccess
chmod 644 dist/.htaccess

# 6. View error logs
tail -20 /var/log/apache2/error.log
```

## Most Likely Fix

**90% of the time, the issue is:**

1. **`AllowOverride None`** in Apache config → Change to `AllowOverride All`
2. **`.htaccess` file not in the right location** → Must be in the same directory as `index.html`
3. **File permissions** → Set `chmod 644` on `.htaccess`

After making these changes, **restart Apache** and test again.
