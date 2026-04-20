document.addEventListener('DOMContentLoaded', () => {

    // --- TOUCH DEVICE DETECTION ---
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const body = document.body;

    if (isTouchDevice) {
        body.classList.add('is-touch-device');
    }

    // --- LOADING SCREEN ---
    const loadingScreen = document.getElementById('loading-screen');
    const loadingMask = document.getElementById('loading-mask');

    // Inject the GIF programmatically to avoid initial render glitches
    const loadingGif = new Image();
    const isMobileView = isTouchDevice || window.innerWidth <= 1024;
    loadingGif.alt = 'Loading RDZN Studio';
    loadingGif.className = 'loading-gif';

    if (isMobileView) {
        // On mobile, fetch the shorter GIF as binary and strip the Netscape
        // Application Extension block entirely. Without this block, the GIF
        // has no loop instruction and plays exactly once, freezing on the last frame.
        fetch('./media/website_loading_mobile.gif?' + new Date().getTime())
            .then(res => res.arrayBuffer())
            .then(buffer => {
                let data = new Uint8Array(buffer);
                // Find the Netscape 2.0 Application Extension block (19 bytes total):
                // 0x21 0xFF 0x0B "NETSCAPE2.0" 0x03 0x01 [loopLo] [loopHi] 0x00
                for (let i = 0; i < data.length - 19; i++) {
                    if (data[i] === 0x21 && data[i + 1] === 0xFF && data[i + 2] === 0x0B) {
                        const sig = String.fromCharCode(...data.slice(i + 3, i + 14));
                        if (sig === 'NETSCAPE2.0') {
                            // Remove the entire 19-byte extension block
                            const before = data.slice(0, i);
                            const after = data.slice(i + 19);
                            const stripped = new Uint8Array(before.length + after.length);
                            stripped.set(before, 0);
                            stripped.set(after, before.length);
                            data = stripped;
                            break;
                        }
                    }
                }
                const blob = new Blob([data], { type: 'image/gif' });
                loadingGif.src = URL.createObjectURL(blob);
            });
    } else {
        loadingGif.src = './media/website_loading.gif?' + new Date().getTime();
    }

    loadingGif.onload = () => {
        loadingScreen.insertBefore(loadingGif, loadingMask);

        // Start the loading bar animation
        setTimeout(() => {
            const fill = document.querySelector('.loading-bar-fill');
            if (fill) fill.style.width = '100%';
        }, 50);

        // Trigger the fade-to-black mask at 3.5s
        setTimeout(() => {
            if (loadingMask) loadingMask.classList.add('active');
        }, 3500);

        // Hide loading screen after 4s (longer loading duration)
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            body.classList.remove('is-loading');
        }, 4000);
    };

    // --- CUSTOM CURSOR (desktop only) ---
    const cursor = document.getElementById('custom-cursor');
    const cursorDot = document.getElementById('cursor-dot');
    const cursorText = document.getElementById('cursor-text');

    // Track mouse position
    const animContainers = document.querySelectorAll('.anim-container');
    const heroClickArea = document.getElementById('hero-click-area');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let isCursorActive = false;

    // Only initialize cursor logic on non-touch devices
    if (!isTouchDevice) {
        // Show/Hide "CLICK" text on hover
        if (heroClickArea && cursorText) {
            heroClickArea.addEventListener('mouseenter', () => {
                cursorText.classList.add('active');
            });
            heroClickArea.addEventListener('mouseleave', () => {
                cursorText.classList.remove('active');
            });
        }

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Show cursor if hidden
            if (!isCursorActive && cursor) {
                cursor.style.opacity = '1';
                if (cursorDot) cursorDot.style.opacity = '1';
                isCursorActive = true;
            }

            if (cursorDot) {
                cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
            }

            // Hover Proximity Logic
            animContainers.forEach(container => {
                const rect = container.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                // Calculate distance between mouse and element center
                const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
                
                // Trigger threshold distance
                if (dist < 100) {
                    container.classList.add('near');
                } else {
                    container.classList.remove('near');
                }
            });
        });

        // Smooth cursor follow loop
        let orbitAngle = 0;
        const orbitRadius = 35;

        function renderCursor() {
            if (isCursorActive && cursor) {
                // Increment angle for continuous orbit
                orbitAngle += 0.04;
                
                // Calculate target position offset by the orbit
                const targetX = mouseX + Math.cos(orbitAngle) * orbitRadius;
                const targetY = mouseY + Math.sin(orbitAngle) * orbitRadius;

                // Lerp mathematical smoothing towards the orbiting target
                cursorX += (targetX - cursorX) * 0.1;
                cursorY += (targetY - cursorY) * 0.1;
                
                // Update position (using translate3d for performance)
                cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
            }
            requestAnimationFrame(renderCursor);
        }
        requestAnimationFrame(renderCursor);
    }

    // Header Links (Prevent default)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            console.log(`Navigate to: ${link.getAttribute('data-page')} - (Feature to be implemented)`);
        });
    });

    // --- MOBILE HAMBURGER MENU ---
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('open');
            menuToggle.classList.toggle('active', isOpen);
        });

        // Close menu when a nav link is tapped
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                menuToggle.classList.remove('active');
            });
        });

        // Close menu when tapping outside the menu content
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                mobileMenu.classList.remove('open');
                menuToggle.classList.remove('active');
            }
        });
    }

    // --- MODALS ---
    const contactModal = document.getElementById('contact-modal');
    const contactBtn = document.getElementById('contact-btn');
    const videoModal = document.getElementById('video-modal');
    const heroBgVideo = document.getElementById('hero-bg-video');
    const showreelVideo = document.getElementById('showreel-video');
    const modals = document.querySelectorAll('.modal-overlay');
    const closeBtns = document.querySelectorAll('.modal-close');

    // Open Contact Modal
    contactBtn.addEventListener('click', () => {
        // Close mobile menu first if open
        if (mobileMenu) {
            mobileMenu.classList.remove('open');
            menuToggle.classList.remove('active');
        }
        openModal(contactModal);
    });

    // Open Video Modal
    heroClickArea.addEventListener('click', () => {
        openModal(videoModal);
        if (heroBgVideo) {
            heroBgVideo.pause(); // Pause background loop
        }
        if (showreelVideo) {
            showreelVideo.currentTime = 0;
            showreelVideo.play().catch(e => console.error("Auto-play prevented:", e));
        }
    });

    // Generic Open Modal
    function openModal(modal) {
        modal.classList.remove('hidden');
        body.classList.add('in-modal'); // Re-enable standard cursor
    }

    // Generic Close Modal
    function closeModal() {
        modals.forEach(m => m.classList.add('hidden'));
        body.classList.remove('in-modal');
        
        // Stop showreel if playing
        if (showreelVideo) {
            showreelVideo.pause();
        }
        
        // Resume background video if paused
        if (heroBgVideo && heroBgVideo.paused) {
            heroBgVideo.play().catch(e => console.log('Autoplay prevented', e));
        }
    }

    // Bind Close behaviors
    closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
    
    // Close on outer overlay click
    modals.forEach(m => {
        m.addEventListener('click', (e) => {
            if (e.target === m) closeModal();
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // --- COPY EMAIL LOGIC ---
    const copyBtn = document.getElementById('copy-email-btn');
    const copyTooltip = document.getElementById('copy-tooltip');

    copyBtn.addEventListener('click', async () => {
        const emailText = document.getElementById('contact-email').textContent.trim();
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(emailText);
            } else {
                // Fallback for insecure contexts (like local file:// viewing)
                const textArea = document.createElement("textarea");
                textArea.value = emailText;
                // Move it off-screen to avoid scrolling or visual blips
                textArea.style.position = "fixed";
                textArea.style.left = "-999999px";
                textArea.style.top = "-999999px";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            // Show Feedback
            copyTooltip.classList.add('show');
            setTimeout(() => copyTooltip.classList.remove('show'), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            copyTooltip.innerText = "Failed to copy";
            copyTooltip.classList.add('show');
            setTimeout(() => copyTooltip.classList.remove('show'), 2000);
        }
    });
});
