const express = require('express');
const { Resend } = require('resend');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY || '');

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Data file
const dataFile = path.join(__dirname, 'data.json');

// Load data
let users = [];
if (fs.existsSync(dataFile)) {
    users = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
}

// Save data
function saveData() {
    fs.writeFileSync(dataFile, JSON.stringify(users, null, 2));
}

// Email transporter - Using Resend
// Requires RESEND_API_KEY environment variable

// Register endpoint
app.post('/register', async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ success: false, message: 'Nombre y email son requeridos.' });
    }

    // Check if email already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ success: false, message: 'Este email ya está registrado.' });
    }

    // Check if API key is configured
    if (!process.env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY not configured');
        return res.status(500).json({ success: false, message: 'Servicio de email no configurado.' });
    }

    // Generate unique code
    const code = uuidv4();

    // Save user
    const newUser = { name, email, code, registeredAt: new Date().toISOString() };
    users.push(newUser);
    saveData();

    // Send email via Resend
    try {
        const response = await resend.emails.send({
            from: 'no-reply@techarena.es',
            to: email,
            subject: 'Tu código de acceso a Tech Arena',
            html: `
                <h2>¡Bienvenido a Tech Arena, ${name}!</h2>
                <p>Tu código único para acceder es:</p>
                <h1 style="background: #1a1a1a; color: #00ff00; padding: 20px; text-align: center; font-family: monospace;">${code}</h1>
                <p>Guárdalo bien, lo necesitarás para acceder a tu cuenta.</p>
                <p>Saludos,<br>Tech Arena Team</p>
            `
        });

        console.log('Email sent:', response);
        res.json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Error al enviar el email.' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    if (!process.env.RESEND_API_KEY) {
        console.warn('⚠️  RESEND_API_KEY not set. Email sending will not work.');
        console.warn('📝 Configure it with: $env:RESEND_API_KEY = "your_api_key"');
    } else {
        console.log('✅ Resend email service configured');
    }
});