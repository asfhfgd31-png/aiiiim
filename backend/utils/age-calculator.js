const { DateTime } = require('luxon');

function calculateAge(birthdate, asOfDate) {
  const start = DateTime.fromISO(birthdate);
  const end = asOfDate ? DateTime.fromISO(asOfDate) : DateTime.now();

  if (!start.isValid) {
    throw new Error('Invalid birthdate format. Please use ISO 8601 format (YYYY-MM-DD).');
  }

  if (!end.isValid) {
    throw new Error('Invalid as_of_date format. Please use ISO 8601 format (YYYY-MM-DD).');
  }

  if (end < start) {
    throw new Error('As of date cannot be earlier than birthdate.');
  }

  const diff = end.diff(start, ['years', 'months', 'days', 'hours', 'minutes', 'seconds']).toObject();

  // Luxon's diff gives floating point numbers, so we need to integerize them.
  const years = Math.floor(diff.years);
  const months = Math.floor(diff.months);
  const days = Math.floor(diff.days);
  const hours = Math.floor(diff.hours);
  const minutes = Math.floor(diff.minutes);
  const seconds = Math.floor(diff.seconds);

  const fractionalYears = end.diff(start, 'years').as('years');

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    fractionalYears,
  };
}

module.exports = { calculateAge };