document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const dayInput = document.getElementById('day');
    const monthInput = document.getElementById('month');
    const yearInput = document.getElementById('year');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultYears = document.querySelector('.result-years');
    const resultMonths = document.querySelector('.result-months');
    const resultDays = document.querySelector('.result-days');

    const inputs = [dayInput, monthInput, yearInput];

    // --- VALIDATION ---
    const showError = (input, message) => {
        const parent = input.parentElement;
        parent.classList.add('error');
        let errorEl = parent.querySelector('.error-message');
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.classList.add('error-message');
            parent.appendChild(errorEl);
        }
        errorEl.textContent = message;
    };

    const clearError = (input) => {
        const parent = input.parentElement;
        parent.classList.remove('error');
        const errorEl = parent.querySelector('.error-message');
        if (errorEl) {
            errorEl.textContent = '';
        }
    };

    const validateInputs = () => {
        let isValid = true;
        const today = new Date();
        const day = parseInt(dayInput.value);
        const month = parseInt(monthInput.value);
        const year = parseInt(yearInput.value);

        // Clear previous errors
        inputs.forEach(clearError);

        // 1. Check for empty fields
        if (!day) { showError(dayInput, 'This field is required'); isValid = false; }
        if (!month) { showError(monthInput, 'This field is required'); isValid = false; }
        if (!year) { showError(yearInput, 'This field is required'); isValid = false; }

        if (!isValid) return false;

        // 2. Check for valid ranges
        if (day < 1 || day > 31) { showError(dayInput, 'Must be a valid day'); isValid = false; }
        if (month < 1 || month > 12) { showError(monthInput, 'Must be a valid month'); isValid = false; }
        if (year > today.getFullYear()) { showError(yearInput, 'Must be in the past'); isValid = false; }

        // 3. Check for valid date (e.g., not 31st of April)
        if (isValid) {
            const daysInMonth = new Date(year, month, 0).getDate();
            if (day > daysInMonth) {
                showError(dayInput, 'Must be a valid date');
                isValid = false;
            }
        }

        // 4. Check if the date is in the future
        if (isValid) {
            const birthDate = new Date(year, month - 1, day);
            if (birthDate > today) {
                showError(yearInput, 'Must be in the past');
                isValid = false;
            }
        }

        return isValid;
    };

    // --- CALCULATION & ANIMATION ---
    const animateValue = (element, start, end, duration) => {
        if (start === end) {
            element.textContent = end;
            return;
        }
        const range = end - start;
        let current = start;
        const increment = end > start ? 1 : -1;
        const stepTime = Math.abs(Math.floor(duration / range));
        const timer = setInterval(() => {
            current += increment;
            element.textContent = current;
            if (current == end) {
                clearInterval(timer);
            }
        }, stepTime);
    };

    const calculateAge = () => {
        if (!validateInputs()) {
            // Reset results if validation fails
            resultYears.textContent = '- -';
            resultMonths.textContent = '- -';
            resultDays.textContent = '- -';
            return;
        }

        const birthDate = new Date(yearInput.value, monthInput.value - 1, dayInput.value);
        const today = new Date();

        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();

        if (months < 0 || (months === 0 && days < 0)) {
            years--;
            months += 12;
        }

        if (days < 0) {
            const prevMonthLastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
            days += prevMonthLastDay;
            months--;
        }

        // Trigger animations
        animateValue(resultYears, 0, years, 800);
        animateValue(resultMonths, 0, months, 800);
        animateValue(resultDays, 0, days, 800);
    };

    // --- EVENT LISTENERS ---
    calculateBtn.addEventListener('click', calculateAge);

    // Allow calculation on pressing Enter key
    inputs.forEach(input => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                calculateAge();
            }
        });
    });
});