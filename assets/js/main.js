// Main site JavaScript
// Performance-optimized utilities

/**
 * Lazy load images
 */
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

/**
 * Smooth scroll to anchors
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/**
 * Add active state to navigation
 */
function initActiveNav() {
    const currentPath = window.location.pathname;
    document.querySelectorAll('nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '/' && href === '/')) {
            link.style.borderBottom = '1px solid #fff';
        }
    });
}

/**
 * Performance monitoring
 */
function initPerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
        try {
            const perfObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    console.log(`${entry.name}: ${entry.duration.toFixed(2)}ms`);
                }
            });

            perfObserver.observe({ entryTypes: ['navigation', 'resource'] });
        } catch (e) {
            // Fallback for browsers that don't support PerformanceObserver
        }
    }
}

/**
 * Cache posts data
 */
class PostsCache {
    constructor() {
        this.cacheKey = 'posts-cache-v1';
        this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
    }

    get() {
        const cached = localStorage.getItem(this.cacheKey);
        if (cached) {
            const data = JSON.parse(cached);
            if (Date.now() - data.timestamp < this.cacheExpiry) {
                return data.posts;
            }
        }
        return null;
    }

    set(posts) {
        localStorage.setItem(this.cacheKey, JSON.stringify({
            posts: posts,
            timestamp: Date.now()
        }));
    }

    clear() {
        localStorage.removeItem(this.cacheKey);
    }
}

/**
 * Initialize all features
 */
document.addEventListener('DOMContentLoaded', () => {
    initLazyLoading();
    initSmoothScroll();
    initActiveNav();

    // Only monitor performance in development
    if (window.location.hostname === 'localhost') {
        initPerformanceMonitoring();
    }
});

/**
 * Utility: Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility: Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Google Analytics helper (optional)
 */
function trackEvent(category, action, label) {
    if (window.gtag) {
        window.gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }
}
