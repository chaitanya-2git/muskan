# Muskan Medicare - Localhost Setup Guide

## 📋 Prerequisites

Before setting up the project locally, ensure you have:

1. **XAMPP/WAMP/MAMP** or **Apache + PHP + MySQL** installed
2. **PHP 7.4 or higher**
3. **MySQL 5.7 or higher**
4. **Web browser** (Chrome, Firefox, Safari, etc.)

## 🚀 Quick Setup Steps

### Step 1: Copy Project Files
1. Copy the entire `public_html` folder to your web server directory:
   - **XAMPP**: `C:/xampp/htdocs/muskan-medicare/`
   - **WAMP**: `C:/wamp64/www/muskan-medicare/`
   - **MAMP**: `/Applications/MAMP/htdocs/muskan-medicare/`

### Step 2: Database Setup
1. Open **phpMyAdmin** (usually at `http://localhost/phpmyadmin`)
2. Import the database setup file:
   - Click "Import" tab
   - Choose file: `setup_localhost.sql`
   - Click "Go"

**OR** manually run the SQL commands:
```sql
CREATE DATABASE IF NOT EXISTS `u628666915_MuskanMedicare` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 3: Start Local Server
1. Start your web server (Apache)
2. Start MySQL service
3. Open browser and navigate to:
   ```
   http://localhost/muskan-medicare/
   ```

## 🔧 Configuration Details

### Database Configuration
The following files are configured for localhost:

**File: `backend/config/database.php`**
```php
private $host = 'localhost';
private $db_name = 'u628666915_MuskanMedicare';
private $username = 'root';
private $password = '';
```

**File: `api/database.php`**
```php
private $host = 'localhost';
private $db_name = 'u628666915_MuskanMedicare';
private $username = 'root';
private $password = '';
```

### Frontend Configuration
**File: `config.js`**
```javascript
API_BASE_URL: '/backend/api'
SITE_URL: 'http://localhost:8000'
ENVIRONMENT: 'development'
```

## 📁 Project Structure
```
muskan-medicare/
├── index.html              # Homepage
├── products.html           # Product catalog
├── cart.html              # Shopping cart
├── checkout.html          # Checkout page
├── config.js              # Frontend config
├── simple-cart.js         # Cart management
├── setup_localhost.sql    # Database setup
├── api/                   # API endpoints
│   ├── products.php       # Products API
│   ├── cart.php          # Cart API
│   └── database.php      # Database config
├── backend/               # Backend files
│   ├── api/              # Backend API
│   ├── config/           # Configuration
│   └── admin/            # Admin panel
└── assets/               # CSS, JS, Images
    ├── css/
    ├── js/
    └── images/
```

## 🛠️ Testing the Setup

### 1. Test Homepage
Navigate to: `http://localhost/muskan-medicare/`
- Should load the homepage with navigation
- Cart icon should show (0) items

### 2. Test Products Page
Navigate to: `http://localhost/muskan-medicare/products.html`
- Should display product grid
- Products should load from database

### 3. Test Cart Functionality
- Add items to cart
- Check cart count updates
- Visit cart page to see items

### 4. Test API Endpoints
Test these URLs directly:
- `http://localhost/muskan-medicare/api/products.php?action=list`
- `http://localhost/muskan-medicare/backend/api/products.php?action=list`

## 🐛 Troubleshooting

### Common Issues:

**1. Database Connection Error**
- Ensure MySQL is running
- Check database name: `u628666915_MuskanMedicare`
- Verify username/password in config files

**2. API Not Working**
- Check PHP errors in browser console
- Ensure Apache mod_rewrite is enabled
- Verify file permissions

**3. Cart Not Working**
- Check browser console for JavaScript errors
- Ensure localStorage is enabled
- Clear browser cache

**4. Products Not Loading**
- Run the sample data insert from `setup_localhost.sql`
- Check database connection
- Verify API endpoints

## 📊 Sample Data

The setup SQL includes sample products and categories. After running the setup, you should see:
- Medical supplies categories
- Sample products with images
- Proper database relationships

## 🔐 Default Settings

- **Database**: `u628666915_MuskanMedicare`
- **Web URL**: `http://localhost/muskan-medicare/`
- **API Base**: `/backend/api/`
- **Cart Storage**: localStorage
- **Session**: PHP sessions for server-side cart

## 📞 Support

If you encounter any issues:
1. Check browser console for errors
2. Check PHP error logs
3. Verify all services are running
4. Ensure proper file permissions

---

**Your Muskan Medicare project is now ready for local development! 🎉**
