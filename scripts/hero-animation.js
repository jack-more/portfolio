class HeroAnimation {
    constructor() {
        this.heroSection = document.querySelector('.hero');
        if (!this.heroSection) return;

        this.initAnimations();
    }

    initAnimations() {
        // Name fade in
        this.animateName();

        // Tagline delayed appearance
        setTimeout(() => this.animateTagline(), 800);

        // Stats counter
        setTimeout(() => this.animateStats(), 1400);

        // Logo belt entrance
        setTimeout(() => this.animateLogoBelt(), 2000);
    }

    animateName() {
        const nameElement = this.heroSection.querySelector('h1');
        if (!nameElement) return;

        nameElement.style.opacity = '0';
        nameElement.style.transform = 'translateY(20px)';

        requestAnimationFrame(() => {
            nameElement.style.transition = 'opacity 1s ease, transform 1s ease';
            nameElement.style.opacity = '1';
            nameElement.style.transform = 'translateY(0)';
        });
    }

    animateTagline() {
        const taglineElement = this.heroSection.querySelector('.tagline');
        if (!taglineElement) return;

        taglineElement.style.opacity = '0';
        taglineElement.style.transform = 'translateY(20px)';

        requestAnimationFrame(() => {
            taglineElement.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            taglineElement.style.opacity = '1';
            taglineElement.style.transform = 'translateY(0)';
        });
    }

    animateStats() {
        const stats = this.heroSection.querySelectorAll('.stat h3');
        stats.forEach((stat, index) => {
            const targetText = stat.textContent;
            const isFirstStat = index === 0; // $1B+
            const isSecondStat = index === 1; // $155M+

            // Start from 0
            stat.style.opacity = '0';
            stat.textContent = '$0';

            setTimeout(() => {
                stat.style.transition = 'opacity 0.5s ease';
                stat.style.opacity = '1';

                if (isFirstStat) {
                    this.countUp(stat, 0, 1000, 1200, (value) => {
                        if (value >= 1000) return '$1B+';
                        return `$${value}M+`;
                    });
                } else if (isSecondStat) {
                    this.countUp(stat, 0, 155, 1200, (value) => {
                        return `$${value}M+`;
                    });
                }
            }, index * 200);
        });
    }

    countUp(element, start, end, duration, formatter) {
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            const current = Math.floor(start + (end - start) * easeProgress);
            element.textContent = formatter(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = formatter(end);
            }
        };

        requestAnimationFrame(animate);
    }

    animateLogoBelt() {
        const logoSection = document.querySelector('.logo-section');
        if (!logoSection) return;

        logoSection.style.opacity = '0';
        logoSection.style.transform = 'translateY(20px)';

        requestAnimationFrame(() => {
            logoSection.style.transition = 'opacity 1s ease, transform 1s ease';
            logoSection.style.opacity = '1';
            logoSection.style.transform = 'translateY(0)';
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new HeroAnimation();
});
