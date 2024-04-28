const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Handle POST request for login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    // Implement your login logic here
    res.send('Login functionality will be implemented here.');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
