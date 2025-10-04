const express = require('express');
const cors = require('cors');
const { calculateAge } = require('./utils/age-calculator');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/age', (req, res) => {
  const { birthdate, as_of_date } = req.body;

  if (!birthdate) {
    return res.status(400).json({ error: 'Birthdate is required.' });
  }

  try {
    const age = calculateAge(birthdate, as_of_date);
    res.json(age);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;