// Poetry Analysis Application JavaScript

class PoetryAnalysisApp {
    constructor() {
        this.tooltip = null;
        this.activeTab = 'europapa';
        this.europapaAudio = document.getElementById('europapa-audio');
        this.userInteracted = false;
        this.init();
    }

    init() {
        this.setupTooltip();
        this.setupTabNavigation();
        this.setupHighlightInteractions();
        this.setupInvisibleAudio();
        this.addAccessibilityFeatures();
    }

    setupTooltip() {
        this.tooltip = document.getElementById('tooltip');
        if (!this.tooltip) {
            console.error('Tooltip element not found');
            return;
        }
    }

    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const targetTab = e.target.getAttribute('data-tab');
                this.switchTab(targetTab, tabButtons, tabContents);
            });

            // Keyboard navigation
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const targetTab = e.target.getAttribute('data-tab');
                    this.switchTab(targetTab, tabButtons, tabContents);
                }
            });
        });

        // Handle arrow key navigation between tabs
        const tabContainer = document.querySelector('.nav-tabs .container');
        if (tabContainer) {
            tabContainer.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.navigateTabsWithKeyboard(e.key, tabButtons);
                }
            });
        }
    }

    switchTab(targetTab, tabButtons, tabContents) {
        // Update active states
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Set new active tab
        const activeButton = document.querySelector(`[data-tab="${targetTab}"]`);
        const activeContent = document.getElementById(targetTab);

        if (activeButton && activeContent) {
            activeButton.classList.add('active');
            activeContent.classList.add('active');
            this.activeTab = targetTab;

            // Scroll to top of content
            activeContent.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Hide tooltip when switching tabs
            this.hideTooltip();

            // Announce tab change for screen readers
            this.announceTabChange(activeButton.textContent);
        }
        
        if (targetTab === 'europapa') {
            this.startEuropapaAudio();
        } else {
            this.stopEuropapaAudio();
        }
    }

    setupInvisibleAudio() {
        if (this.europapaAudio) {
            // Start met muted voor autoplay compliance
            this.europapaAudio.muted = true;
            this.europapaAudio.loop = true;
            this.europapaAudio.volume = 0.3;

            // Unmute na eerste user interaction
            document.addEventListener('click', () => {
                if (!this.userInteracted) {
                    this.europapaAudio.muted = false;
                    this.userInteracted = true;
                }
            }, { once: true });

            // Start audio als Europapa tab al actief is
            if (document.getElementById('europapa').classList.contains('active')) {
                this.startEuropapaAudio();
            }

            // Error handling
            this.europapaAudio.addEventListener('error', (e) => {
                console.log('Audio error:', e);
            });
        }
    }

    startEuropapaAudio() {
        if (this.europapaAudio) {
            this.europapaAudio.currentTime = 0;
            this.europapaAudio.play().catch(error => {
                console.log('Audio kon niet worden afgespeeld:', error);
            });
        }
    }

    stopEuropapaAudio() {
        if (this.europapaAudio && !this.europapaAudio.paused) {
            this.europapaAudio.pause();
            this.europapaAudio.currentTime = 0;
        }
    }

    setupHighlightInteractions() {
        const highlights = document.querySelectorAll('.highlight[data-tooltip]');
        
        highlights.forEach(highlight => {
            // Mouse events
            highlight.addEventListener('mouseenter', (e) => {
                this.showTooltip(e);
            });

            highlight.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });

            highlight.addEventListener('mousemove', (e) => {
                this.updateTooltipPosition(e);
            });

            // Touch events for mobile
            highlight.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.showTooltip(e.touches[0]);
            });

            highlight.addEventListener('touchend', () => {
                setTimeout(() => this.hideTooltip(), 2000); // Hide after 2 seconds on mobile
            });

            // Keyboard events
            highlight.addEventListener('focus', (e) => {
                this.showTooltip(e);
            });

            highlight.addEventListener('blur', () => {
                this.hideTooltip();
            });

            // Make highlights focusable
            if (!highlight.hasAttribute('tabindex')) {
                highlight.setAttribute('tabindex', '0');
            }

            // Add ARIA label for accessibility
            const tooltipText = highlight.getAttribute('data-tooltip');
            highlight.setAttribute('aria-label', tooltipText);
        });
    }

    showTooltip(event) {
        if (!this.tooltip) return;

        const element = event.target || event;
        const tooltipText = element.getAttribute('data-tooltip');
        
        if (!tooltipText) return;

        this.tooltip.textContent = tooltipText;
        this.tooltip.classList.add('show');
        
        this.updateTooltipPosition(event);
    }

    // Fixed tooltip positioning using clientX/Y coordinates with fixed positioning
    updateTooltipPosition(event) {
        if (!this.tooltip || !this.tooltip.classList.contains('show')) return;

        const mouseX = event.clientX;
        const mouseY = event.clientY;
        const tooltipRect = this.tooltip.getBoundingClientRect();
        const tooltipHeight = tooltipRect.height;
        const windowHeight = window.innerHeight;

        // Position calculation
        let posX = mouseX + 10;
        let posY = mouseY - tooltipHeight - 15;

        // Horizontal boundary check
        if (posX + tooltipRect.width > window.innerWidth) {
            posX = window.innerWidth - tooltipRect.width - 10;
        }

        // Vertical boundary check
        if (posY < 10) {
            posY = mouseY + 25;
            this.tooltip.classList.add('tooltip-bottom');
            this.tooltip.classList.remove('tooltip-top');
        } else {
            this.tooltip.classList.add('tooltip-top');
            this.tooltip.classList.remove('tooltip-bottom');
        }

        // Apply final position
        this.tooltip.style.left = `${Math.max(10, posX)}px`;
        this.tooltip.style.top = `${Math.max(10, posY)}px`;
    }


    hideTooltip() {
        if (this.tooltip) {
            this.tooltip.classList.remove('show');
        }
    }

    addAccessibilityFeatures() {
        // Add skip links
        this.addSkipLinks();
        
        // Improve focus management
        this.improveFocusManagement();
        
        // Add live region for announcements
        this.addLiveRegion();
    }

    addSkipLinks() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Spring naar hoofdinhoud';
        skipLink.className = 'sr-only';
        skipLink.style.cssText = `
            position: absolute;
            left: -9999px;
            top: auto;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.cssText = `
                position: absolute;
                left: 6px;
                top: 7px;
                z-index: 999999;
                padding: 8px 16px;
                background: #000;
                color: #fff;
                text-decoration: none;
                border-radius: 3px;
            `;
        });

        skipLink.addEventListener('blur', () => {
            skipLink.style.cssText = `
                position: absolute;
                left: -9999px;
                top: auto;
                width: 1px;
                height: 1px;
                overflow: hidden;
            `;
        });

        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    improveFocusManagement() {
        // Ensure all interactive elements are focusable
        const interactiveElements = document.querySelectorAll('button, a, .highlight');
        interactiveElements.forEach(element => {
            if (!element.hasAttribute('tabindex') && !['BUTTON', 'A'].includes(element.tagName)) {
                element.setAttribute('tabindex', '0');
            }
        });

        // Add focus indicators
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    addLiveRegion() {
        const liveRegion = document.createElement('div');
        liveRegion.id = 'live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
        this.liveRegion = liveRegion;
    }

    announceTabChange(tabName) {
        if (this.liveRegion) {
            this.liveRegion.textContent = `Tabblad ${tabName} geselecteerd`;
        }
    }

    // Utility methods
    debounce(func, wait) {
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

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Enhanced interactions
class EnhancedInteractions {
    constructor() {
        this.setupSmoothScrolling();
        this.setupCardHoverEffects();
        this.setupResponsiveFeatures();
    }

    setupSmoothScrolling() {
        // Smooth scrolling for internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupCardHoverEffects() {
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }

    setupResponsiveFeatures() {
        // Handle orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                // Recalculate tooltip positions if any are visible
                const visibleTooltip = document.querySelector('.tooltip.show');
                if (visibleTooltip) {
                    visibleTooltip.classList.remove('show');
                }
            }, 100);
        });

        // Handle window resize
        const debouncedResize = this.debounce(() => {
            // Hide tooltips on resize
            const tooltip = document.getElementById('tooltip');
            if (tooltip) {
                tooltip.classList.remove('show');
            }
        }, 250);

        window.addEventListener('resize', debouncedResize);
    }

    debounce(func, wait) {
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
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.startTime = performance.now();
        this.measureLoadTime();
    }

    measureLoadTime() {
        window.addEventListener('load', () => {
            const loadTime = performance.now() - this.startTime;
            console.log(`Application loaded in ${loadTime.toFixed(2)}ms`);
        });
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main application
    const app = new PoetryAnalysisApp();
    
    // Initialize enhanced interactions
    const enhancedInteractions = new EnhancedInteractions();
    
    // Initialize performance monitoring
    const perfMonitor = new PerformanceMonitor();
    
    // Add global error handling
    window.addEventListener('error', (e) => {
        console.error('Application error:', e.error);
    });
    
    // Add unhandled promise rejection handling
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
    });
    
    console.log('Poetry Analysis Application initialized successfully');
});

// Add CSS for keyboard navigation focus indicators
const style = document.createElement('style');
style.textContent = `
    .keyboard-navigation *:focus {
        outline: 2px solid #003399 !important;
        outline-offset: 2px !important;
    }
    
    .keyboard-navigation .highlight:focus {
        outline: 2px solid #FFCC00 !important;
        outline-offset: 2px !important;
    }
`;
document.head.appendChild(style);