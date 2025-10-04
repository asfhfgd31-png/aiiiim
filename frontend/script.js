document.addEventListener('DOMContentLoaded', () => {
    const { DateTime } = luxon;
    const gsap = window.gsap;

    // DOM Elements
    const dayInput = document.getElementById('day');
    const monthInput = document.getElementById('month');
    const yearInput = document.getElementById('year');
    const calculateBtn = document.getElementById('calculate-btn');
    const asOfDateSlider = document.getElementById('as-of-date-slider');
    const asOfDateDisplay = document.getElementById('as-of-date-display');

    const outputs = {
        years: document.getElementById('years-output'),
        months: document.getElementById('months-output'),
        days: document.getElementById('days-output'),
        hours: document.getElementById('hours-output'),
        minutes: document.getElementById('minutes-output'),
        seconds: document.getElementById('seconds-output'),
        fractionalYears: document.getElementById('fractional-years-output'),
    };

    let birthDate;
    let asOfDate = DateTime.now();

    // --- Slider and Date Display ---
    function updateSliderAndDisplay() {
        const now = DateTime.now();
        const oneYearAgo = now.minus({ years: 1 });
        const oneYearHence = now.plus({ years: 1 });

        asOfDateSlider.min = oneYearAgo.toMillis();
        asOfDateSlider.max = oneYearHence.toMillis();
        asOfDateSlider.value = asOfDate.toMillis();
        asOfDateDisplay.textContent = asOfDate.toLocaleString(DateTime.DATETIME_MED);
    }

    function attemptAgeCalculation() {
        const day = parseInt(dayInput.value);
        const month = parseInt(monthInput.value);
        const year = parseInt(yearInput.value);

        if (!day || !month || String(year).length < 4) {
            return; // Not a complete date, do nothing.
        }

        const tempBirthDate = DateTime.fromObject({ day, month, year });

        if (tempBirthDate.isValid) {
            birthDate = tempBirthDate;
            fetchAndDisplayAge();
        }
    }

    // --- Event Listeners ---
    dayInput.addEventListener('input', attemptAgeCalculation);
    monthInput.addEventListener('input', attemptAgeCalculation);
    yearInput.addEventListener('input', attemptAgeCalculation);

    asOfDateSlider.addEventListener('input', () => {
        asOfDate = DateTime.fromMillis(parseInt(asOfDateSlider.value));
        updateSliderAndDisplay();
        if (birthDate && birthDate.isValid) {
            fetchAndDisplayAge();
        }
    });

    calculateBtn.addEventListener('click', () => {
        gsap.fromTo(calculateBtn, { scale: 1 }, { scale: 1.05, yoyo: true, repeat: 1, duration: 0.2 });
        attemptAgeCalculation();

        const day = parseInt(dayInput.value);
        const month = parseInt(monthInput.value);
        const year = parseInt(yearInput.value);
        const tempBirthDate = DateTime.fromObject({ day, month, year });
        if (!tempBirthDate.isValid) {
            alert('Please enter a valid birth date.');
        }
    });

    async function fetchAndDisplayAge() {
        if (!birthDate || !birthDate.isValid) return;

        try {
            const response = await fetch('http://localhost:3000/api/age', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    birthdate: birthDate.toISODate(),
                    as_of_date: asOfDate.toISO(),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'An error occurred.');
            }

            const age = await response.json();
            updateUI(age);

        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    function updateUI(age) {
        const timeline = gsap.timeline();

        for (const key in outputs) {
            if (age.hasOwnProperty(key) && outputs[key]) {
                const target = { val: parseFloat(outputs[key].textContent) || 0 };
                const endValue = key === 'fractionalYears' ? parseFloat(age[key]).toFixed(8) : parseInt(age[key]);

                timeline.to(target, {
                    val: endValue,
                    duration: 1,
                    ease: 'power3.out',
                    onUpdate: () => {
                         outputs[key].textContent = key === 'fractionalYears' ? parseFloat(target.val).toFixed(8) : Math.round(target.val);
                    },
                }, "<0.1");
            }
        }
    }

    // --- Particle Animation ---
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray;

    const mouse = {
        x: null,
        y: null,
        radius: (canvas.height / 100) * (canvas.width / 100)
    };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
            ctx.fill();
        }

        update() {
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            particlesArray.push(new Particle(x, y, directionX, directionY, size));
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
    }

    window.addEventListener('resize', () => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = (canvas.height / 100) * (canvas.width / 100);
        initParticles();
    });

    window.addEventListener('mouseout', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    // --- Initial Setup ---
    updateSliderAndDisplay();
    initParticles();
    animateParticles();
});