# Troubleshooting MIME Type Issues

## Quick Diagnostic Checklist

### Step 1: Verify Files Exist
```bash
# On your server, check these files exist:
ls -la dist/assets/*.js
ls -la dist/registerSW.js
ls -la dist/.htaccess
ls -la dist/index.html
```

### Step 2: Test Direct File Access
Open these URLs directly in your browser (replace with your domain):
- `https://yourdomain.com/assets/index.[hash].js`
- `https://yourdomain.com/registerSW.js`

**Expected:** Should download or display JavaScript code
**If you see HTML:** The rewrite rules are catching these files

### Step 3: Check Server Configuration

#### For Apache:
```bash
# Check if mod_rewrite is enabled
apache2ctl -M | grep rewrite

# Check if mod_mime is enabled
apache2ctl -M | grep mime

# Check Apache configuration
cat /etc/apache2/sites-available/your-site.conf | grep AllowOverride
# Should show: AllowOverride All
```

#### For Nginx:
```bash
# Check nginx configuration
cat /etc/nginx/sites-available/your-site | grep -A 5 "location"
```

### Step 4: Check File Permissions
```bash
chmod 644 dist/.htaccess
chmod 644 dist/index.html
chmod 644 dist/assets/*
chmod 644 dist/*.js
```

### Step 5: Check Server Logs
```bash
# Apache
tail -f /var/log/apache2/error.log

# Nginx
tail -f /var/log/nginx/error.log
```

### Step 6: Test .htaccess Syntax
```bash
# Test Apache configuration
apache2ctl configtest

# Or
httpd -t
```

## Common Solutions

### Solution 1: Fix Apache AllowOverride
Edit your Apache site configuration:
```apache
<Directory /path/to/your/dist>
    AllowOverride All
    Options -Indexes +FollowSymLinks
    Require all granted
</Directory>
```
Then restart Apache:
```bash
sudo systemctl restart apache2
```

### Solution 2: Check Base Path
If your app is in a subdirectory (e.g., `/app/`), update `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/app/',  // Change this to match your subdirectory
  // ...
})
```
Then rebuild:
```bash
npm run build
```

### Solution 3: Manual MIME Type Configuration
If `.htaccess` isn't working, add to Apache main config:
```apache
<IfModule mod_mime.c>
    AddType application/javascript .js
    AddType application/javascript .mjs
</IfModule>
```

### Solution 4: Disable .htaccess and Use Virtual Host Config
Move rewrite rules to your Apache virtual host:
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
            RewriteCond %{REQUEST_FILENAME} !-f
            RewriteCond %{REQUEST_FILENAME} !-d
            RewriteCond %{REQUEST_URI} !\.(js|mjs|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|webp|json|xml|webmanifest)$ [NC]
            RewriteRule . /index.html [L]
        </IfModule>
    </Directory>
</VirtualHost>
```

## Still Not Working?

1. **Check browser console** - Look for the exact file path that's failing
2. **Check Network tab** - See what the server is actually returning (should be JavaScript, not HTML)
3. **Try a different browser** - Rule out browser caching issues
4. **Clear browser cache** - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
5. **Check CDN/proxy settings** - If using Cloudflare or similar, check their settings
