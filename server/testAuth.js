const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const PORT = 5099; // temporary port for test

async function runTests() {
  console.log('--- Starting Auth Backend Test ---');
  
  const express = require('express');
  const cors = require('cors');
  const connectDB = require('./config/db');
  
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api/auth', require('./routes/authRoutes'));
  
  // Connect database
  await connectDB();
  
  // Start server
  const server = app.listen(PORT);
  console.log(`Test server running on port ${PORT}`);
  
  const baseUrl = `http://127.0.0.1:${PORT}/api/auth`;
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'securePassword123';
  const testName = 'Test User';
  
  try {
    // Test 1: Register User
    console.log('\n[Test 1] Registering a new user...');
    const regRes = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: testName, email: testEmail, password: testPassword })
    });
    const regData = await regRes.json();
    console.log(`Response Status: ${regRes.status}`);
    console.log('Response Body:', regData);
    
    if (regRes.status !== 201 || !regData.token || regData.email !== testEmail) {
      throw new Error('Register user test failed!');
    }
    console.log('✓ Register user test PASSED');
    
    // Test 2: Duplicate Email Check
    console.log('\n[Test 2] Testing duplicate registration check...');
    const dupRes = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: testName, email: testEmail, password: testPassword })
    });
    const dupData = await dupRes.json();
    console.log(`Response Status: ${dupRes.status}`);
    console.log('Response Body:', dupData);
    
    if (dupRes.status !== 400 || !dupData.message || !dupData.message.includes('exists')) {
      throw new Error('Duplicate email registration check failed!');
    }
    console.log('✓ Duplicate registration check PASSED');
    
    // Test 3: Login User
    console.log('\n[Test 3] Logging in with correct credentials...');
    const loginRes = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: testPassword })
    });
    const loginData = await loginRes.json();
    console.log(`Response Status: ${loginRes.status}`);
    console.log('Response Body:', loginData);
    
    if (loginRes.status !== 200 || !loginData.token) {
      throw new Error('Login user test failed!');
    }
    console.log('✓ Login user test PASSED');
    
    // Test 4: Invalid Password Login
    console.log('\n[Test 4] Logging in with incorrect password...');
    const badLoginRes = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: 'wrongpassword' })
    });
    const badLoginData = await badLoginRes.json();
    console.log(`Response Status: ${badLoginRes.status}`);
    console.log('Response Body:', badLoginData);
    
    if (badLoginRes.status !== 401) {
      throw new Error('Invalid password check failed!');
    }
    console.log('✓ Invalid password check PASSED');
    
    // Clean up test data
    console.log('\n[Cleanup] Removing test user from database...');
    const User = require('./models/User');
    await User.deleteOne({ email: testEmail });
    console.log('✓ Test user removed successfully');
    
    console.log('\n=========================================');
    console.log('🎉 ALL AUTHENTICATION TESTS PASSED SUCCESSFULLY! 🎉');
    console.log('=========================================');
    
  } catch (error) {
    console.error('\n❌ TEST RUN FAILED:', error.message);
    process.exitCode = 1;
  } finally {
    // Close server and DB connection
    server.close();
    await mongoose.connection.close();
    console.log('Test server shut down and database connection closed.');
  }
}

runTests();
