const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Auth Service' });
});

app.post('/register', (req, res) => {
    // TODO: implement actual DB logic
    res.json({ message: "Registration successful (mock)" });
});

app.post('/login', (req, res) => {
    // TODO: implement actual login logic
    res.json({ token: "mock_jwt_token", user: { id: 1, name: "Admin User", role: "admin" } });
});

app.listen(PORT, () => {
  console.log(`HireShield Auth Service running on port ${PORT}`);
});
