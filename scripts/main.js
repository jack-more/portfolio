document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollAnimations();
    initVideoPlayer();
    initWorkCards();
});

function initNavigation() {
    const nav = document.querySelector('.nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            nav.style.background = 'rgba(10, 14, 39, 0.95)';
            nav.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.4)';
        } else {
            nav.style.background = 'rgba(10, 14, 39, 0.8)';
            nav.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = nav.offsetHeight;
                const targetPosition = target.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.work-card, .expertise-item, .stat-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

function initVideoPlayer() {
    const videoPlaceholder = document.querySelector('.video-placeholder');
    const videoBtn = document.querySelector('.video-placeholder-btn');

    if (videoBtn) {
        videoBtn.addEventListener('click', () => {
            const mockVideoElement = document.createElement('div');
            mockVideoElement.className = 'video-mock-player';
            mockVideoElement.innerHTML = `
                <div style="
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #1a2849 0%, #0a0e27 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    gap: 1rem;
                    border-radius: 1rem;
                    padding: 3rem;
                ">
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#4dabf7" stroke-width="2">
                        <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
                        <line x1="7" y1="2" x2="7" y2="22"/>
                        <line x1="17" y1="2" x2="17" y2="22"/>
                        <line x1="2" y1="12" x2="22" y2="12"/>
                        <line x1="2" y1="7" x2="7" y2="7"/>
                        <line x1="2" y1="17" x2="7" y2="17"/>
                        <line x1="17" y1="17" x2="22" y2="17"/>
                        <line x1="17" y1="7" x2="22" y2="7"/>
                    </svg>
                    <h3 style="color: #e9ecef; font-size: 1.5rem; font-weight: 700; margin-top: 1rem;">
                        Remotion Video Player Ready
                    </h3>
                    <p style="color: #adb5bd; font-size: 1.125rem; text-align: center; max-width: 600px;">
                        This is where your Remotion-generated videos will appear. The player component is set up
                        and ready to receive video content.
                    </p>
                    <div style="display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap; justify-content: center;">
                        <div style="padding: 0.75rem 1.5rem; background: rgba(77, 171, 247, 0.15); border-radius: 0.5rem; color: #4dabf7; font-weight: 600; font-size: 0.875rem;">
                            MP4 Support
                        </div>
                        <div style="padding: 0.75rem 1.5rem; background: rgba(77, 171, 247, 0.15); border-radius: 0.5rem; color: #4dabf7; font-weight: 600; font-size: 0.875rem;">
                            WebM Support
                        </div>
                        <div style="padding: 0.75rem 1.5rem; background: rgba(77, 171, 247, 0.15); border-radius: 0.5rem; color: #4dabf7; font-weight: 600; font-size: 0.875rem;">
                            Auto-play
                        </div>
                        <div style="padding: 0.75rem 1.5rem; background: rgba(77, 171, 247, 0.15); border-radius: 0.5rem; color: #4dabf7; font-weight: 600; font-size: 0.875rem;">
                            Custom Controls
                        </div>
                    </div>
                    <button class="btn btn-secondary" style="margin-top: 2rem;" onclick="location.reload()">
                        Reset Demo
                    </button>
                </div>
            `;

            videoPlaceholder.innerHTML = '';
            videoPlaceholder.appendChild(mockVideoElement);
            videoPlaceholder.style.border = '1px solid rgba(77, 171, 247, 0.3)';
        });
    }
}

function initWorkCards() {
    const workCards = document.querySelectorAll('.work-card');

    workCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;

        card.addEventListener('mouseenter', function() {
            const image = this.querySelector('.work-card-image');
            if (image) {
                image.style.transform = 'scale(1.05)';
                image.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            }
        });

        card.addEventListener('mouseleave', function() {
            const image = this.querySelector('.work-card-image');
            if (image) {
                image.style.transform = 'scale(1)';
            }
        });
    });
}

function createParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;

        hero.style.transform = `translateY(${parallax}px)`;
        hero.style.opacity = 1 - (scrolled / 1000);
    });
}

createParallaxEffect();
