// Dynamically load latest YouTube videos into the featured episodes section
document.addEventListener('DOMContentLoaded', function() {
    // --- Lightweight YouTube Embeds (replace iframes until play) ---
    try {
        const ytIframes = document.querySelectorAll('.video-frame iframe[src*="youtube.com/embed/"]');
        ytIframes.forEach((iframe) => {
            const src = iframe.getAttribute('src') || '';
            const match = src.match(/embed\/(.*?)\b/);
            const videoId = match ? match[1] : null;
            if (!videoId) return;

            const container = iframe.parentElement; // .video-frame
            // Build placeholder button
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'yt-lite';
            btn.setAttribute('aria-label', 'Play video');
            btn.style.backgroundImage = `url(https://i.ytimg.com/vi/${videoId}/hqdefault.jpg)`;
            btn.innerHTML = '<span class="play-btn" aria-hidden="true"></span>';

            // Replace iframe with placeholder button
            container.innerHTML = '';
            container.appendChild(btn);

            // On click, swap back to iframe with autoplay
            btn.addEventListener('click', () => {
                const player = document.createElement('iframe');
                // Adopt a minimal, privacy-friendly embed
                const base = `https://www.youtube-nocookie.com/embed/${videoId}`;
                const params = 'autoplay=1&rel=0&modestbranding=1&playsinline=1';
                player.src = `${base}?${params}`;
                player.setAttribute('title', 'YouTube video player');
                player.setAttribute('frameborder', '0');
                player.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
                player.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
                player.allowFullscreen = true;
                container.innerHTML = '';
                container.appendChild(player);
            });
        });
    } catch (e) {
        console.warn('Lite YouTube enhancement skipped:', e);
    }
    const featuredContainer = document.getElementById('featured-episodes-dynamic');
    if (!featuredContainer) return;

    // YouTube channel ID for B3U Podcast
    const channelId = 'UCSrtA1gGlgo4cQUzoSlzZ5w'; // Replace with actual channel ID
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const proxyUrl = `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(rssUrl)}`;

    fetch(proxyUrl)
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, 'text/xml'))
        .then(data => {
            const entries = Array.from(data.querySelectorAll('entry')).slice(0, 3);
            featuredContainer.innerHTML = '';
            entries.forEach((entry, idx) => {
                const title = entry.querySelector('title')?.textContent || 'Untitled';
                const link = entry.querySelector('link')?.getAttribute('href') || '#';
                const published = entry.querySelector('published')?.textContent || '';
                const date = published ? new Date(published).toLocaleDateString() : '';
                const thumbnail = entry.querySelector('media\\:thumbnail, thumbnail')?.getAttribute('url') || '';
                // Dynamic label for each video
                const label = `Latest Video ${idx + 1}`;
                featuredContainer.innerHTML += `
                    <div class="featured-video-card" style="background:#2c3e50;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08);padding:18px 16px;max-width:340px;min-width:220px;display:flex;flex-direction:column;align-items:center;transition:box-shadow 0.2s;">
                        <div class="featured-label" style="background:#ff6b35;color:#fff;font-weight:600;padding:4px 12px;border-radius:6px;margin-bottom:10px;font-family:'Oswald',sans-serif;letter-spacing:1px;">${label}</div>
                        <img src="${thumbnail}" alt="${title}" style="width:120px;height:auto;border-radius:8px;margin-bottom:10px;box-shadow:0 1px 6px rgba(0,0,0,0.10);object-fit:cover;" loading="lazy">
                        <h3 style="color:#fff;font-family:'Oswald',sans-serif;font-size:1.1rem;text-align:center;margin:0 0 8px 0;">${title}</h3>
                        <div class="episode-meta" style="color:#f8f9fa;font-size:0.95rem;margin-bottom:8px;">${date}</div>
                        <a href="${link}" class="episode-link" target="_blank" rel="noopener" style="background:#ff6b35;color:#fff;padding:7px 18px;border-radius:6px;text-decoration:none;font-weight:500;font-family:'Inter',sans-serif;transition:background 0.2s;">Watch on YouTube ▶</a>
                    </div>
                `;
            });
        })
        .catch(err => {
            featuredContainer.innerHTML = '<p>Unable to load latest episodes at this time.</p>';
        });
});
// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            document.body.classList.toggle('nav-open');
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', String(!isExpanded));
            
            // Animate hamburger bars
            const bars = navToggle.querySelectorAll('.bar');
            bars.forEach((bar, index) => {
                if (navMenu.classList.contains('active')) {
                    if (index === 0) bar.style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                    if (index === 1) bar.style.opacity = '0';
                    if (index === 2) bar.style.transform = 'rotate(45deg) translate(-5px, -6px)';
                } else {
                    bar.style.transform = 'none';
                    bar.style.opacity = '1';
                }
            });
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');
                if (navToggle) {
                    navToggle.setAttribute('aria-expanded', 'false');
                    const bars = navToggle.querySelectorAll('.bar');
                    bars.forEach(bar => {
                        bar.style.transform = 'none';
                        bar.style.opacity = '1';
                    });
                }
            }
            // Update aria-current on click
            navLinks.forEach(l => l.removeAttribute('aria-current'));
            link.setAttribute('aria-current', 'page');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    link.removeAttribute('aria-current');
                });
                if (navLink) {
                    navLink.classList.add('active');
                    navLink.setAttribute('aria-current', 'page');
                }
            }
        });
    });

    // Contact Form Handling
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            // No nav menu toggle logic here; handled above for accessibility and consistency
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            // Honeypot: support both legacy 'company' and new 'extra_field'
            const companyHp = formData.get('extra_field') || formData.get('company');

            // Basic validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            // Honeypot check: if filled, silently ignore
            if (companyHp) {
                showNotification('Thanks! Your message has been received.', 'success');
                contactForm.reset();
                return;
            }

            // Prefer Google Apps Script if configured; fall back to PHP; then mailto
            const gasEndpoint = contactForm.getAttribute('data-gas-endpoint') || '';
            const statusEl = document.getElementById('form-status');
            if (statusEl) {
                statusEl.textContent = 'Sending…';
                statusEl.className = 'form-status form-status--sending';
            }
            if (gasEndpoint) {
                sendViaGoogleAppsScript(gasEndpoint, { name, email, subject, message, company: companyHp, extra_field: companyHp })
                    .then(() => {
                        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                        if (statusEl) {
                            statusEl.textContent = 'Message sent successfully!';
                            statusEl.className = 'form-status form-status--success';
                        }
                        contactForm.reset();
                    })
                    .catch((err) => {
                        console.error('GAS send failed:', err);
                        // Fallback to PHP
                        sendEmailDirectly(name, email, subject, message, companyHp);
                    });
            } else {
                // No GAS configured, try PHP
                sendEmailDirectly(name, email, subject, message, companyHp);
            }
        });
    }

    // Send via Google Apps Script (expects a deployed Web App URL)
    async function sendViaGoogleAppsScript(endpoint, payload) {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        try {
            const fd = new FormData();
            Object.entries(payload).forEach(([k, v]) => fd.append(k, v ?? ''));
            await fetch(endpoint, {
                method: 'POST',
                mode: 'no-cors', // allow anonymous Web App without CORS headers
                body: fd,
            });
            // With no-cors, we can\'t read status reliably; assume success if no exception
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            return true;
        } catch (e) {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            throw e;
        }
    }

    // Send email directly using PHP backend
    async function sendEmailDirectly(name, email, subject, message, companyHp = '') {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Show loading state
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        try {
            const response = await fetch('send-email.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    subject,
                    message,
                    company: companyHp
                })
            });

            const result = await response.json();

            if (result.success) {
                showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                const statusEl = document.getElementById('form-status');
                if (statusEl) {
                    statusEl.textContent = 'Message sent successfully!';
                    statusEl.className = 'form-status form-status--success';
                }
                contactForm.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            } else {
                throw new Error(result.message || 'Failed to send email');
            }

        } catch (error) {
            console.error('Direct email failed:', error);
            showNotification('Unable to send message directly. Please try the email client option.', 'error');
            const statusEl = document.getElementById('form-status');
            if (statusEl) {
                statusEl.textContent = 'Could not send via server. Use "Open Email App" below.';
                statusEl.className = 'form-status form-status--error';
            }
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            
            // Show email client fallback button
            showEmailClientFallback(name, email, subject, message);
        }
    }

    // Show email client fallback option
    function showEmailClientFallback(name, email, subject, message) {
        const fallbackButton = document.getElementById('email-client-fallback');
        if (fallbackButton) {
            fallbackButton.style.display = 'inline-block';
            fallbackButton.onclick = () => openEmailClient(name, email, subject, message);
        }
    }

    // Fallback: Open email client
    function openEmailClient(name, email, subject, message) {
        const contactEmail = 'BreeCharles@b3unstoppable.com';
        const emailSubject = `B3U Message!!!`;
        const emailBody = `
Hello B3U Podcast Team,

Contact Information:
- Name: ${name}
- Email: ${email}
- Subject: ${subject}

Message:
${message}

---
This message was sent from the B3U Podcast website contact form.
        `.trim();

        // Create mailto link
        const mailtoLink = `mailto:${contactEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

        try {
            window.location.href = mailtoLink;
            showNotification('Email client opened! Please send the message from your email app.', 'success');
            
            // Hide the fallback button after use
            const fallbackButton = document.getElementById('email-client-fallback');
            if (fallbackButton) {
                fallbackButton.style.display = 'none';
            }
        } catch (error) {
            console.error('Error opening email client:', error);
            showNotification('Could not open email client. Please contact us directly at BreeCharles@b3unstoppable.com', 'error');
        }
    }

    // Episode click handlers
    const episodeLinks = document.querySelectorAll('.episode-link');
    episodeLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const episodeTitle = this.closest('.episode-card').querySelector('h3').textContent;
            showNotification(`Opening "${episodeTitle}" - Podcast player would launch here!`, 'info');
        });
    });

    // Intersection Observer for animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.episode-card, .quality, .about-image, .hero-stats .stat');
    animateElements.forEach(el => observer.observe(el));

    // Podcast cover hover effect
    const podcastCover = document.querySelector('.podcast-cover');
    if (podcastCover) {
        podcastCover.addEventListener('click', function() {
            this.style.transform = 'rotate(360deg) scale(1.1)';
            setTimeout(() => {
                this.style.transform = 'rotate(-5deg)';
            }, 600);
        });
    }

    // Dynamic stats counter
    const stats = document.querySelectorAll('.stat h3');
    let hasAnimated = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateStats();
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }

    function animateStats() {
        // Only animate if we have the expected number of stats
        if (stats.length < 3) {
            console.warn('Expected 3 stats elements, found:', stats.length);
            return;
        }

        const statValues = [
            { element: stats[0], target: 20, suffix: '+' },
            { element: stats[1], target: 40, suffix: '+' },
            { element: stats[2], target: 5, suffix: '★' }
        ];

        statValues.forEach(({ element, target, suffix }) => {
            if (element) {
                let current = 0;
                const increment = target / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    element.textContent = Math.floor(current) + suffix;
                }, 40);
            }
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            document.body.classList.remove('nav-open');
            if (navToggle) {
                navToggle.setAttribute('aria-expanded', 'false');
                const bars = navToggle.querySelectorAll('.bar');
                bars.forEach(bar => {
                    bar.style.transform = 'none';
                    bar.style.opacity = '1';
                });
            }
        }
    });

    // Close menu if clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu && navMenu.classList.contains('active')) {
            const clickInsideMenu = navMenu.contains(e.target);
            const clickOnToggle = navToggle && navToggle.contains(e.target);
            if (!clickInsideMenu && !clickOnToggle) {
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');
                if (navToggle) {
                    navToggle.setAttribute('aria-expanded', 'false');
                    const bars = navToggle.querySelectorAll('.bar');
                    bars.forEach(bar => {
                        bar.style.transform = 'none';
                        bar.style.opacity = '1';
                    });
                }
            }
        }
    });

    // Navbar scroll effect removed - navbar now stays fixed at top
});

// Utility Functions


function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// --- B3U Podcast: Auto-populate Latest Episodes from YouTube RSS Feed ---
// Replace YOUR_CHANNEL_ID below with your actual YouTube channel ID
const YOUTUBE_CHANNEL_ID = "UCSrtA1gGlgo4cQUzoSlzZ5w"; // <-- PUT YOUR CHANNEL ID HERE
const YOUTUBE_RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;

// Add this to your main DOMContentLoaded block
document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...

    // --- YouTube Episodes Loader ---
    const episodesSection = document.getElementById('latest-episodes');
    if (!episodesSection) {
        return; // silently skip when latest section is not present
    }

    // Try allorigins first, fallback to corsproxy.io if needed
    const proxyUrls = [
        `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(YOUTUBE_RSS_URL)}`
    ];

    function fetchEpisodes(proxyIndex = 0) {
        fetch(proxyUrls[proxyIndex])
            .then(response => response.text())
            .then(xmlStr => {
                const xml = (new window.DOMParser()).parseFromString(xmlStr, "text/xml");
                const items = xml.querySelectorAll('entry');
                if (!items.length) throw new Error('No episodes found in RSS feed.');
                let html = '';
                items.forEach((item, idx) => {
                    if (idx >= 3) return; // Show only the first 3 episodes
                    const title = item.querySelector('title').textContent;
                    const link = item.querySelector('link').getAttribute('href');
                    const published = item.querySelector('published').textContent;
                    const thumbnail = item.querySelector('media\\:thumbnail')?.getAttribute('url') || 'images/youtube.png';
                    html += `
                        <div class="episode-card">
                            <a href="${link}" target="_blank" rel="noopener" class="episode-link">
                                <img src="${thumbnail}" alt="${title}" loading="lazy" class="episode-thumb" />
                                <h3>${title}</h3>
                                <p class="episode-date">${new Date(published).toLocaleDateString()}</p>
                            </a>
                        </div>
                    `;
                });
                episodesSection.innerHTML = html;
            })
            .catch(err => {
                if (proxyIndex + 1 < proxyUrls.length) {
                    // Try next proxy
                    fetchEpisodes(proxyIndex + 1);
                } else {
                    console.error('Failed to load YouTube episodes:', err);
                    episodesSection.innerHTML = '<p>Unable to load latest episodes. Please visit our <a href="https://www.youtube.com/@B3uCreatingSuccess" target="_blank">YouTube channel</a>.</p>';
                }
            });
    }
    fetchEpisodes();

    // ...existing code...
});

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', type === 'error' ? 'alert' : 'status');
    notification.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
    notification.innerHTML = `
        <div class="notification-content">
            <span class="sr-only">${type === 'error' ? 'Error:' : type === 'success' ? 'Success:' : 'Notice:'}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        removeNotification(notification);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            removeNotification(notification);
        }
    }, 5000);
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.remove();
        }
    }, 300);
}

// Add animation CSS
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .animate-in {
        animation: slideInUp 0.6s ease forwards;
    }

    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
    }

    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }

    .notification-close:hover {
        opacity: 0.7;
    }
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
`;

document.head.appendChild(animationStyles);

// Performance optimization - Lazy loading for images (when added)
function lazyLoad() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if there are images
document.addEventListener('DOMContentLoaded', lazyLoad);

// SEO and Analytics placeholder functions
function trackEvent(eventName, properties = {}) {
    // Placeholder for analytics tracking
    console.log('Event tracked:', eventName, properties);
    
    // Example: Google Analytics 4
    // gtag('event', eventName, properties);
    
    // Example: Facebook Pixel
    // fbq('track', eventName, properties);
}

// Track important user interactions
document.addEventListener('DOMContentLoaded', function() {
    // Track episode clicks
    document.querySelectorAll('.episode-link').forEach(link => {
        link.addEventListener('click', () => {
            let episodeTitle = 'Episode';
            const card = link.closest('.episode-card');
            if (card) {
                const h3 = card.querySelector('h3');
                if (h3) episodeTitle = h3.textContent;
            }
            trackEvent('episode_click', { episode_title: episodeTitle });
        });
    });

    // Track contact form submissions
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            trackEvent('contact_form_submit');
        });
    }

    // Track navigation usage
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const section = link.getAttribute('href').replace('#', '');
            trackEvent('navigation_click', {
                section: section
            });
        });
    });

    // Image cycling for cover image - every 2 seconds with 0.5s fade
    const coverImage = document.getElementById('cover-image');
    if (coverImage) {
        const images = [
            'images/B3Upro.jpeg',
            'images/B3Upro1.jpeg',
            'images/B3Upro2.jpeg'
        ];
        let currentImageIndex = 0;

        function cycleImages() {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            coverImage.style.opacity = '0';
            
            setTimeout(() => {
                coverImage.src = images[currentImageIndex];
                coverImage.style.opacity = '1';
            }, 100);
        }

        // Start cycling immediately, then every 2 seconds
        setInterval(cycleImages, 2000);
    }
});
