class SpaceBackground {
    constructor() {
        this.canvas = document.getElementById('space-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.speed = 3;

        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());

        // Slow down on scroll
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            this.speed = 1;
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.speed = 3;
            }, 200);
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        // Create a dense starfield
        const starCount = 300;
        for (let i = 0; i < starCount; i++) {
            this.createStar();
        }
    }

    createStar() {
        this.stars.push({
            x: (Math.random() - 0.5) * 6000,
            y: (Math.random() - 0.5) * 6000,
            z: Math.random() * 3000,
            size: Math.random() * 2.5 + 0.5
        });
    }

    project(x, y, z) {
        const scale = 800 / (z + 800);
        const projectedX = x * scale + this.canvas.width / 2;
        const projectedY = y * scale + this.canvas.height / 2;
        return { x: projectedX, y: projectedY, scale };
    }

    drawStars() {
        this.stars.forEach(star => {
            // Move star towards camera (flying at you)
            star.z -= this.speed * 4;

            // Reset star when it passes camera
            if (star.z < 1) {
                star.z = 3000;
                star.x = (Math.random() - 0.5) * 6000;
                star.y = (Math.random() - 0.5) * 6000;
            }

            const projected = this.project(star.x, star.y, star.z);

            // Only draw stars on screen
            if (projected.x < -100 || projected.x > this.canvas.width + 100 ||
                projected.y < -100 || projected.y > this.canvas.height + 100) {
                return;
            }

            const size = star.size * projected.scale * 4;
            const alpha = Math.min(projected.scale * 3, 1);

            // Draw the star point
            this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(projected.x, projected.y, size, 0, Math.PI * 2);
            this.ctx.fill();

            // Add motion blur trail for closer/faster stars
            if (star.z < 800) {
                const prevZ = star.z + this.speed * 4;
                const prevProjected = this.project(star.x, star.y, prevZ);

                const gradient = this.ctx.createLinearGradient(
                    prevProjected.x, prevProjected.y,
                    projected.x, projected.y
                );
                gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
                gradient.addColorStop(1, `rgba(255, 255, 255, ${alpha * 0.6})`);

                this.ctx.strokeStyle = gradient;
                this.ctx.lineWidth = size * 0.8;
                this.ctx.beginPath();
                this.ctx.moveTo(prevProjected.x, prevProjected.y);
                this.ctx.lineTo(projected.x, projected.y);
                this.ctx.stroke();
            }

            // Extra glow for closer stars
            if (star.z < 400) {
                const gradient = this.ctx.createRadialGradient(
                    projected.x, projected.y, 0,
                    projected.x, projected.y, size * 6
                );
                gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.3})`);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(projected.x, projected.y, size * 6, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
    }

    animate() {
        // Pure black background
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawStars();

        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SpaceBackground();
});
