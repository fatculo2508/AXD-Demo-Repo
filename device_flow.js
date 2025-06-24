require('dotenv').config();
const axios = require('axios');

const CLIENT_ID = 'Ov23livfMTcqIprNMB7F';
const SCOPE = 'repo';

async function startDeviceFlow() {
  try {
    const initRes = await axios.post(
      'https://github.com/login/device/code',
      new URLSearchParams({
        client_id: CLIENT_ID,
        scope: SCOPE
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
      }
    );

    const {
      device_code,
      user_code,
      verification_uri,
      interval
    } = initRes.data;

    console.log(`🔑 Go to ${verification_uri} and enter code: ${user_code}`);

    // Polling loop
    let accessToken = null;
    while (!accessToken) {
      try {
        const tokenRes = await axios.post(
          'https://github.com/login/oauth/access_token',
          new URLSearchParams({
            client_id: CLIENT_ID,
            device_code: device_code,
            grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
          }).toString(),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json',
            },
          }
        );

        if (tokenRes.data.access_token) {
          accessToken = tokenRes.data.access_token;
          console.log('\n✅ Access Token:', accessToken);

          // Optional: use the token to fetch user info
          const userInfo = await axios.get('https://api.github.com/user', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'User-Agent': 'AXD-App-Alpha'
            }
          });

          console.log('\n👤 GitHub User:', userInfo.data.login);
          console.log('📧 Email:', userInfo.data.email);
        } else {
          if (tokenRes.data.error === 'authorization_pending') {
            console.log('⏳ Waiting for authorization...');
          } else if (tokenRes.data.error === 'slow_down') {
            console.log('⏱️ Rate limited — slowing down...');
          } else {
            throw new Error(tokenRes.data.error_description || tokenRes.data.error);
          }
        }
      } catch (err) {
        console.log(`❌ Device Flow Error:`, err.message);
      }

      await new Promise((resolve) => setTimeout(resolve, interval * 1000));
    }
  } catch (err) {
    console.error('❌ Initialization Error:', err.message);
  }
}

startDeviceFlow();
