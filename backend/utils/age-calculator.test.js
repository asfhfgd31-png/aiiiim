const { calculateAge } = require('./age-calculator');
const { DateTime } = require('luxon');

describe('calculateAge', () => {
    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    it('should calculate the correct age for a given birthdate', () => {
        jest.setSystemTime(new Date('2023-10-27T12:00:00.000Z'));

        const birthdate = '1990-01-15';
        const age = calculateAge(birthdate);

        expect(age.years).toBe(33);
        expect(age.months).toBe(9);
        expect(age.days).toBe(12);
    });

    it('should calculate the correct age with a specific "as of" date', () => {
        const birthdate = '1990-01-15';
        const asOfDate = '2020-05-20';
        const age = calculateAge(birthdate, asOfDate);

        expect(age.years).toBe(30);
        expect(age.months).toBe(4);
        expect(age.days).toBe(5);
    });

    it('should throw an error for an invalid birthdate format', () => {
        const birthdate = 'invalid-date';
        expect(() => calculateAge(birthdate)).toThrow('Invalid birthdate format. Please use ISO 8601 format (YYYY-MM-DD).');
    });

    it('should throw an error if the "as of" date is earlier than the birthdate', () => {
        const birthdate = '1990-01-15';
        const asOfDate = '1989-12-31';
        expect(() => calculateAge(birthdate, asOfDate)).toThrow('As of date cannot be earlier than birthdate.');
    });

     it('should handle leap years correctly', () => {
        const birthdate = '2000-02-29'; // A leap day
        const asOfDate = '2001-03-01';
        const age = calculateAge(birthdate, asOfDate);
        expect(age.years).toBe(1);
        expect(age.months).toBe(0);
        expect(age.days).toBe(1);
    });
});