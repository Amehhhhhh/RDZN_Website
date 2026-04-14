document.addEventListener('DOMContentLoaded', () => {

    // --- LOADING SCREEN ---
    const loadingScreen = document.getElementById('loading-screen');
    const loadingMask = document.getElementById('loading-mask');

    // Inject the GIF programmatically to avoid initial render glitches
    const loadingGif = new Image();
    loadingGif.src = './media/website_loading.gif?' + new Date().getTime(); // Cache busting
    loadingGif.alt = 'Loading RDZN Studio';
    loadingGif.className = 'loading-gif';

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
            document.body.classList.remove('is-loading');
        }, 4000);
    };

    // --- CUSTOM CURSOR ---
    const cursor = document.getElementById('custom-cursor');
    const body = document.body;

    // Track mouse position
    const animContainers = document.querySelectorAll('.anim-container');

    document.addEventListener('mousemove', (e) => {
        // Show cursor if hidden
        if (cursor.style.opacity === '') {
            cursor.style.opacity = '1';
        }
        // Update position (using translate3d for performance)
        cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;

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

    // Handle interactive element hover
    const interactables = document.querySelectorAll('a, button, .hero-click-area');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => body.classList.add('interacting'));
        el.addEventListener('mouseleave', () => body.classList.remove('interacting'));
    });

    // Header Links (Prevent default)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            console.log(`Navigate to: ${link.getAttribute('data-page')} - (Feature to be implemented)`);
        });
    });

    // --- MODALS ---
    const contactModal = document.getElementById('contact-modal');
    const contactBtn = document.getElementById('contact-btn');
    const videoModal = document.getElementById('video-modal');
    const heroClickArea = document.getElementById('hero-click-area');
    const heroBgVideo = document.getElementById('hero-bg-video');
    const showreelVideo = document.getElementById('showreel-video');
    const modals = document.querySelectorAll('.modal-overlay');
    const closeBtns = document.querySelectorAll('.modal-close');

    // Open Contact Modal
    contactBtn.addEventListener('click', () => {
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