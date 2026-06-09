import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';


dotenv.config();

const API_URL = 'http://localhost:5000/api/auth';

const runTests = async () => {
  console.log('--- STARTING AUTHENTICATION TESTS ---');

  // 1. Test Registration
  console.log('\n[1] Testing User Registration...');
  const registerRes = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: 'Test',
      lastName: 'User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      role: 'Employee'
    })
  });
  const registerData = await registerRes.json();
  
  if (registerRes.ok && registerData.token) {
    console.log('✅ Registration SUCCESS!');
    console.log('   User ID:', registerData._id);
    console.log('   JWT Generation SUCCESS! Token starts with:', registerData.token.substring(0, 15) + '...');
  } else {
    console.log('❌ Registration FAILED:', registerData.message);
    process.exit(1);
  }

  // 2. Test Login
  console.log('\n[2] Testing User Login...');
  const loginRes = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: registerData.email,
      password: 'password123'
    })
  });
  const loginData = await loginRes.json();
  
  if (loginRes.ok && loginData.token) {
    console.log('✅ Login SUCCESS!');
  } else {
    console.log('❌ Login FAILED:', loginData.message);
    process.exit(1);
  }

  // 3. Test Protected Route
  console.log('\n[3] Testing Protected Route (/profile)...');
  const profileRes = await fetch(`${API_URL}/profile`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${loginData.token}`
    }
  });
  const profileData = await profileRes.json();

  if (profileRes.ok && profileData.email === loginData.email) {
    console.log('✅ Protected Route SUCCESS!');
    console.log('   Profile Data Retrieved:', profileData.firstName, profileData.lastName);
  } else {
    console.log('❌ Protected Route FAILED:', profileData.message);
    process.exit(1);
  }

  console.log('\n--- ALL VERIFICATIONS PASSED ---');
  process.exit(0);
};

// Wait 2 seconds for server to boot, then test
setTimeout(runTests, 2000);
