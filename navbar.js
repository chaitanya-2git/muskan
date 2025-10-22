// frontend/navbar.js

async function fetchAuthStatus() {
  try {
    const response = await fetch('./backend/api/auth.php?action=check_auth', {
      credentials: 'include'
    });
    return await response.json();
  } catch (error) {
    console.error('Auth check failed:', error);
    return null;
  }
}

function getNavbarHTML(userData) {
  const isLoggedIn = userData?.success && userData.authenticated;
  const userName = userData?.user?.name || 'User';

  return `
    <nav class="navbar navbar-expand-lg" id="navbar">
      <div class="container">
        <a class="navbar-brand" href="index.html">
          <i class="fas fa-heartbeat"></i> Muskan
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="products.html">Products</a></li>
            <li class="nav-item"><a class="nav-link" href="about.html">About</a></li>
            <li class="nav-item"><a class="nav-link" href="contact.html">Contact</a></li>
            <li class="nav-item">
              <a class="nav-link" href="cart.html">
                <i class="fas fa-shopping-cart"></i> Cart <span class="badge bg-primary" id="cartCount">0</span>
              </a>
            </li>

            ${isLoggedIn ? `
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Welcome, ${userName}
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li><a class="dropdown-item" href="profile.html">Profile</a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item" href="#" id="logoutBtn">Logout</a></li>
                </ul>
              </li>
            ` : `
              <li class="nav-item"><a class="btn btn-outline-primary me-2" href="login.html">Login</a></li>
              <li class="nav-item"><a class="btn btn-primary" href="signup.html">Sign Up</a></li>
            `}
          </ul>
        </div>
      </div>
    </nav>
  `;
}

    // Update cart count function - ULTRA AGGRESSIVE for immediate updates
    // Global function to force navbar update (can be called from other scripts)
window.forceNavbarCartUpdate = function() {
  console.log('Force navbar cart update called');
  updateCartCount();
  
  // Extra aggressive update attempt
  setTimeout(() => {
    updateCartCount();
    // Try to find and update any cart count elements manually
    const cartElements = document.querySelectorAll('#cartCount, .cart-count, .badge, span[id*="cart"], span[class*="cart"]');
    
    // Use CORRECT localStorage key - 'cartItems' not 'cart'
    const cartData = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const count = cartData.reduce((sum, item) => sum + (item.quantity || 0), 0);
    
    cartElements.forEach(el => {
      if (el) {
        el.textContent = count;
        el.innerText = count;
        console.log('Manually updated cart element:', el, 'to count:', count);
      }
    });
  }, 50);
};

function updateCartCount() {
    try {
        let count = 0;
        
        // Try to get count from cartItems first (primary storage)
        try {
            const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
            if (Array.isArray(cart) && cart.length > 0) {
                count = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
            }
        } catch (e) {
            // Fallback to cartCount if available
            count = parseInt(localStorage.getItem('cartCount')) || 0;
        }
        
        console.log('Navbar updateCartCount - calculated count:', count);
        
        // ULTRA AGGRESSIVE UPDATE - Try multiple times with delays
        for (let attempt = 0; attempt < 3; attempt++) {
            setTimeout(() => {
                const selectors = [
                    '#cartCount',
                    '.badge', 
                    'span.badge',
                    '.cart-count', 
                    '.navbar .cart-count',
                    '[data-cart-count]',
                    '.nav-link .cart-count',
                    'span[id*="cart"]',
                    'span[class*="cart"]',
                    '.navbar span.badge'
                ];
                
                let updated = false;
                selectors.forEach(selector => {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(el => {
                        if (el) {
                            el.textContent = count;
                            el.innerText = count;
                            el.innerHTML = count;
                            el.style.display = count > 0 ? 'inline-block' : 'inline';
                            updated = true;
                        }
                    });
                });
                
                if (updated) {
                    console.log(`Navbar count updated (attempt ${attempt + 1}):`, count);
                }
            }, attempt * 100);
        }
        
        // Set window variable for other scripts
        window.cartCount = count;
        
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}
    
    // Enhanced event listeners for perfect cart synchronization
    
    // Listen for storage events (cross-tab synchronization)
    window.addEventListener('storage', function(e) {
        if (e.key === 'cartItems' || e.key === 'cartCount') {
            console.log('🔄 Navbar: Storage event detected for', e.key);
            setTimeout(updateCartCount, 10); // Small delay to ensure data is ready
        }
    });
    
    // Listen for custom cart events (same-tab updates)
    window.addEventListener('cartUpdated', function(e) {
        console.log('🛒 Navbar: cartUpdated event received:', e.detail);
        setTimeout(updateCartCount, 10);
    });
    
    // Listen for cart count specific events
    window.addEventListener('cartCountUpdated', function(e) {
        console.log('📊 Navbar: cartCountUpdated event received:', e.detail);
        setTimeout(updateCartCount, 10);
    });
    
    // Listen for DOM mutations to catch any dynamic cart updates
    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.target.classList?.contains('cart-item')) {
                    console.log('🔍 Navbar: Cart DOM mutation detected');
                    setTimeout(updateCartCount, 10);
                }
            });
        });
        
        // Start observing cart containers when they exist
        setTimeout(() => {
            const cartContainer = document.getElementById('cartItems');
            if (cartContainer) {
                observer.observe(cartContainer, { childList: true, subtree: true });
            }
        }, 1000);
    }
    
    // Enhanced periodic update with exponential backoff
    let updateInterval = 1000; // Start with 1 second
    const maxInterval = 5000;   // Max 5 seconds
    let consecutiveUpdates = 0;
    
    const periodicUpdate = () => {
        const previousCount = localStorage.getItem('cartCount') || '0';
        updateCartCount();
        const currentCount = localStorage.getItem('cartCount') || '0';
        
        if (previousCount === currentCount) {
            consecutiveUpdates++;
            if (consecutiveUpdates > 5 && updateInterval < maxInterval) {
                updateInterval = Math.min(updateInterval * 1.5, maxInterval);
                console.log('📈 Navbar: Increased update interval to', updateInterval + 'ms');
            }
        } else {
            consecutiveUpdates = 0;
            updateInterval = 1000; // Reset to fast updates when changes detected
        }
        
        setTimeout(periodicUpdate, updateInterval);
    };
    
    // Start the enhanced periodic updates
    setTimeout(periodicUpdate, 1000);async function setupNavbar() {
  const userData = await fetchAuthStatus();
  const navbarContainer = document.getElementById('navbar-placeholder');
  navbarContainer.innerHTML = getNavbarHTML(userData);
  
  // Initialize Bootstrap components after navbar is created
  setTimeout(() => {
    // Re-initialize Bootstrap components
    const collapseElements = document.querySelectorAll('.collapse');
    collapseElements.forEach(element => {
      new bootstrap.Collapse(element, { toggle: false });
    });
    
    const dropdownElements = document.querySelectorAll('.dropdown-toggle');
    dropdownElements.forEach(element => {
      new bootstrap.Dropdown(element);
    });
    
    // Manual toggle for mobile menu if Bootstrap fails
    const toggler = document.querySelector('.navbar-toggler');
    const collapse = document.querySelector('.navbar-collapse');
    
    if (toggler && collapse) {
      toggler.addEventListener('click', () => {
        collapse.classList.toggle('show');
      });
    }
  }, 100);
  
  // IMMEDIATE cart count update
  updateCartCount();
  
  // SUPER AGGRESSIVE cart count updates - every 500ms
  setInterval(updateCartCount, 500);
  
  // Also update on any click anywhere (in case buttons don't trigger events properly)
  document.addEventListener('click', () => {
    setTimeout(updateCartCount, 100);
  });

  if (userData?.success && userData.authenticated) {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          const res = await fetch('./backend/api/auth.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ action: 'logout' })
          });
          const result = await res.json();
          if (result.success) {
            window.location.href = 'login.html';
          } else {
            alert('Logout failed.');
          }
        } catch (err) {
          console.error('Logout error:', err);
          alert('Logout error.');
        }
      });
    }
  }
}

// Listen for storage changes to update cart count in real-time
window.addEventListener('storage', function(e) {
  if (e.key === 'cartItems') {
    console.log('Storage event detected for cart'); // Debug log
    updateCartCount();
  }
});

// Custom event for cart updates within the same page
window.addEventListener('cartUpdated', function(e) {
  console.log('cartUpdated event received:', e.detail); // Debug log
  updateCartCount();
});

// Also listen for localStorage changes within same page
const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
  originalSetItem.apply(this, arguments);
  if (key === 'cartItems') {
    console.log('localStorage cart updated directly'); // Debug log
    updateCartCount();
  }
};

window.addEventListener('DOMContentLoaded', function() {
  setupNavbar();
  
  // Fallback for Bootstrap if it fails to load
  setTimeout(() => {
    if (typeof bootstrap === 'undefined') {
      console.warn('Bootstrap not loaded, adding fallback navbar functionality');
      const toggler = document.querySelector('.navbar-toggler');
      const collapse = document.querySelector('.navbar-collapse');
      
      if (toggler && collapse) {
        toggler.addEventListener('click', () => {
          collapse.classList.toggle('show');
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
          if (!toggler.contains(e.target) && !collapse.contains(e.target)) {
            collapse.classList.remove('show');
          }
        });
      }
    }
  }, 1000);
});
