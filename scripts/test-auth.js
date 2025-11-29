import fetch from 'node-fetch';

const API_URL = 'http://localhost:4174/api';

async function testAuth() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                identifier: 'ram@farmer.com',
                password: 'farmer123'
            })
        });

        const loginData = await loginRes.json();
        console.log('Login Status:', loginRes.status);

        if (!loginData.success) {
            console.error('Login Failed:', loginData);
            return;
        }

        const token = loginData.data.token;
        console.log('Token received');

        // 2. Get Me
        console.log('Fetching /me...');
        const meRes = await fetch(`${API_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const meData = await meRes.json();
        console.log('Me Status:', meRes.status);
        console.log('Me Data:', JSON.stringify(meData, null, 2));

    } catch (error) {
        console.error('Test Error:', error);
    }
}

testAuth();
