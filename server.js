const fastify = require('fastify')({ logger: true });
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Temporary in-memory storage for demo purposes (in a real app, use a database)
let users = [];
let otpStore = {};  // To store OTPs temporarily

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'alexie83@ethereal.email',
      pass: 'E1ayP8Ky2PCAR97Nsx'
  }
});

// Middleware to check if email exists in the users array
const findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

// Route to register user and send OTP
fastify.post('/register', async (request, reply) => {
  const { email } = request.body;

  // Check if email is already registered
  if (findUserByEmail(email)) {
    return reply.status(400).send({ message: 'Email already registered' });
  }

  // Save the new user (For demo purposes, without password)
  users.push({ email });

  // Send OTP via email
  const otp = crypto.randomInt(100000, 999999).toString();
  otpStore[email] = otp;  // Store OTP temporarily

  // Send OTP email
  try {
    await transporter.sendMail({
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Your OTP for registration',
      text: `Your OTP is: ${otp}`,
    });

    reply.send({ message: 'OTP sent to your email' });
  } catch (error) {
    reply.status(500).send({ message: 'Failed to send OTP' });
  }
});

// Route to login and send OTP
fastify.post('/sendOTP', async (request, reply) => {
  const { email } = request.body;

  const user = findUserByEmail(email);
  if (!user) {
    return reply.status(404).send({ message: 'Email not found' });
  }

  // Send OTP via email
  const otp = crypto.randomInt(100000, 999999).toString();
  otpStore[email] = otp;  // Store OTP temporarily

  try {
    await transporter.sendMail({
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Your OTP for login',
      text: `Your OTP is: ${otp}`,
    });

    reply.send({ message: 'OTP sent to your email' });
  } catch (error) {
    reply.status(500).send({ message: 'Failed to send OTP' });
  }
});

// Route to verify OTP for registration
fastify.post('/verify-register-otp', async (request, reply) => {
  const { email, otp } = request.body;

  if (otpStore[email] === otp) {
    // Successfully verified, register user (in real app, store password etc.)
    reply.send({ message: 'Registration successful' });
  } else {
    reply.status(400).send({ message: 'Invalid OTP' });
  }
});

// Route to login with OTP
fastify.post('/login', async (request, reply) => {
  const { email, otp } = request.body;

  const user = findUserByEmail(email);
  if (!user) {
    return reply.status(404).send({ message: 'Email not found' });
  }

  if (otpStore[email] === otp) {
    reply.send({ message: 'Login successful' });
  } else {
    reply.status(400).send({ message: 'Invalid OTP' });
  }
});

// Route to reset password
fastify.post('/reset-password', async (request, reply) => {
  const { email, otp, newPassword } = request.body;

  const user = findUserByEmail(email);
  if (!user) {
    return reply.status(404).send({ message: 'Email not found' });
  }

  if (otpStore[email] === otp) {
    // Reset the password (For demo, we just update the user's email entry)
    user.password = newPassword;  // In a real app, hash the password
    delete otpStore[email];  // Clear OTP after use
    reply.send({ message: 'Password reset successful' });
  } else {
    reply.status(400).send({ message: 'Invalid OTP' });
  }
});



// Start the Fastify server
const start = async () => {
  try {
    // Use an object with 'port' and 'host' properties
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server listening on http://localhost:3000');
  } catch (err) {
    console.error('Error starting Fastify server:', err);
    process.exit(1); // Exit with error code if server fails to start
  }
};

// Start the server
start();
