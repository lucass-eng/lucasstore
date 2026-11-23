

// SUPER SMOOTH SCROLL - LUCAS STORE

let scrollAnimation = null;
// Hentikan animasi jika pengguna melakukan scroll manual
function stopSmoothScroll() {
    if (scrollAnimation !== null) {
        cancelAnimationFrame(scrollAnimation);
        scrollAnimation = null;
    }
}

window.addEventListener('wheel', stopSmoothScroll, { passive: true });
window.addEventListener('touchstart', stopSmoothScroll, { passive: true });
window.addEventListener('pointerdown', stopSmoothScroll, { passive: true });

window.addEventListener('keydown', function(e) {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) {
        stopSmoothScroll();
    }
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        const id = this.getAttribute('href').slice(1);
        const target = document.getElementById(id);

        if (!target) return;

        e.preventDefault();

        if (scrollAnimation !== null) {
            cancelAnimationFrame(scrollAnimation);
        }

        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar
            ? navbar.getBoundingClientRect().height
            : 0;

        const startPosition = window.scrollY;
        const targetPosition =
            target.getBoundingClientRect().top +
            window.scrollY -
            navbarHeight - 12;

        const distance = targetPosition - startPosition;

        // Durasi otomatis berdasarkan jarak scroll
        const duration = Math.min(
            5000,
            Math.max(3000, Math.abs(distance) * 0.55)
        );

        let startTime = null;

        // Easing cosine agar gerakan lembut dan stabil
       /** @param {number} time */
      function easeInOut(time) {
            return -(Math.cos(Math.PI * time) - 1) / 2;
        }
/** @param {number} currentTime */
        function animateScroll(currentTime) {
            if (startTime === null) {
                startTime = currentTime;
            }

            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeInOut(progress);

            window.scrollTo(
                0,
                startPosition + distance * easedProgress
            );

            if (progress < 1) {
                scrollAnimation =
                    requestAnimationFrame(animateScroll);
            } else {
                window.scrollTo(0, targetPosition);
                scrollAnimation = null;
            }
        }

        scrollAnimation = requestAnimationFrame(animateScroll);
    });
});

// SCROLL REVEAL
const revealElements = document.querySelectorAll(
    '.hero-content, .section-heading, .product-category, .about, .contact'
);

revealElements.forEach(element => {
    element.classList.add('reveal');
});

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12
});

revealElements.forEach(element => {
    revealObserver.observe(element);
});
// NAVBAR HEIGHT AUTO ADJUST
(function () {
    const navbar = document.querySelector(".navbar");

    if (!navbar) return;

    function updateNavbarHeight() {
        const height = navbar.getBoundingClientRect().height;

        document.documentElement.style.setProperty(
            "--lucas-navbar-height",
            height + "px"
        );
    }

    updateNavbarHeight();
    window.addEventListener("resize", updateNavbarHeight);

    if ("ResizeObserver" in window) {
        const observer = new ResizeObserver(updateNavbarHeight);
        observer.observe(navbar);
    }
})();