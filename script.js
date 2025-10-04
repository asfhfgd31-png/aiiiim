document.addEventListener('DOMContentLoaded', () => {
    const dayInput = document.getElementById('day');
    const monthInput = document.getElementById('month');
    const yearInput = document.getElementById('year');

    const yearsResult = document.getElementById('years-result');
    const monthsResult = document.getElementById('months-result');
    const daysResult = document.getElementById('days-result');

    const totalMonthsResult = document.getElementById('total-months');
    const totalWeeksResult = document.getElementById('total-weeks');
    const totalDaysResult = document.getElementById('total-days');
    const totalHoursResult = document.getElementById('total-hours');
    const totalMinutesResult = document.getElementById('total-minutes');

    const zodiacSignResult = document.getElementById('zodiac-sign');
    const milestoneCountdownResult = document.getElementById('milestone-countdown');

    const inputs = [dayInput, monthInput, yearInput];

    inputs.forEach(input => {
        input.addEventListener('input', calculateAge);
    });

    function calculateAge() {
        const day = parseInt(dayInput.value);
        const month = parseInt(monthInput.value);
        const year = parseInt(yearInput.value);

        if (!day || !month || !year || !isValidDate(day, month, year)) {
            resetResults();
            return;
        }

        const birthDate = new Date(year, month - 1, day);
        const today = new Date();

        if (birthDate > today) {
            alert("Birth date cannot be in the future!");
            resetResults();
            return;
        }

        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();

        if (days < 0) {
            months--;
            const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += prevMonth.getDate();
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        animateValue(yearsResult, years);
        animateValue(monthsResult, months);
        animateValue(daysResult, days);

        calculateExpandedData(birthDate, today);
        calculateZodiacSign(day, month);
        calculateNextMilestone(birthDate, today);
    }

    function isValidDate(d, m, y) {
        const date = new Date(y, m - 1, d);
        return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
    }

    function resetResults() {
        yearsResult.textContent = '- -';
        monthsResult.textContent = '- -';
        daysResult.textContent = '- -';
        totalMonthsResult.textContent = '-';
        totalWeeksResult.textContent = '-';
        totalDaysResult.textContent = '-';
        totalHoursResult.textContent = '-';
        totalMinutesResult.textContent = '-';
        zodiacSignResult.textContent = '-';
        milestoneCountdownResult.textContent = '-';
    }

    function animateValue(element, endValue) {
        let startValue = parseInt(element.textContent);
        if (isNaN(startValue)) {
            startValue = 0;
        }

        if (startValue === endValue) {
            element.textContent = endValue;
            return;
        }

        const duration = 500;
        const range = endValue - startValue;
        let startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const currentValue = Math.floor(progress * range + startValue);
            element.textContent = currentValue;
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                element.textContent = endValue;
            }
        }
        requestAnimationFrame(step);
    }

    function calculateExpandedData(birthDate, today) {
        const diffTime = Math.abs(today - birthDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = diffDays * 24;
        const diffMinutes = diffHours * 60;

        const totalMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());

        totalDaysResult.textContent = diffDays.toLocaleString();
        totalHoursResult.textContent = diffHours.toLocaleString();
        totalMinutesResult.textContent = diffMinutes.toLocaleString();
        totalMonthsResult.textContent = totalMonths.toLocaleString();
        totalWeeksResult.textContent = Math.floor(diffDays / 7).toLocaleString();
    }

    function calculateZodiacSign(day, month) {
        let sign = '';
        if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) sign = 'Aquarius';
        else if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) sign = 'Pisces';
        else if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) sign = 'Aries';
        else if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) sign = 'Taurus';
        else if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) sign = 'Gemini';
        else if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) sign = 'Cancer';
        else if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) sign = 'Leo';
        else if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) sign = 'Virgo';
        else if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) sign = 'Libra';
        else if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) sign = 'Scorpio';
        else if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) sign = 'Sagittarius';
        else if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) sign = 'Capricorn';
        zodiacSignResult.textContent = sign;
    }

    function calculateNextMilestone(birthDate, today) {
        const birthDay = birthDate.getDate();
        const birthMonth = birthDate.getMonth();

        const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        let nextBirthday = new Date(today.getFullYear(), birthMonth, birthDay);
        if (nextBirthday < todayDateOnly) {
            nextBirthday.setFullYear(today.getFullYear() + 1);
        }

        if (nextBirthday.getTime() === todayDateOnly.getTime()) {
            milestoneCountdownResult.textContent = "Happy Birthday!";
            return;
        }

        const diffTime = nextBirthday - todayDateOnly;
        const totalDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        const months = Math.floor(totalDays / 30.4375);
        const days = Math.round(totalDays % 30.4375);

        let parts = [];
        if (months > 0) {
            parts.push(`${months} month${months > 1 ? 's' : ''}`);
        }
        if (days > 0) {
            parts.push(`${days} day${days > 1 ? 's' : ''}`);
        }

        if (parts.length > 0) {
            milestoneCountdownResult.textContent = parts.join(' and ') + ' left';
        } else {
            milestoneCountdownResult.textContent = "Almost there!";
        }
    }

    const now = new Date();
    yearInput.value = now.getFullYear() - 25;
    monthInput.value = now.getMonth() + 1;
    dayInput.value = now.getDate();
    calculateAge();
});