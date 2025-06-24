const fs = require('fs');
const axios = require('axios');

// Load token from .access_token file
const tokenPath = `${__dirname}/.access_token`;
if (!fs.existsSync(tokenPath)) {
  console.error('❌ Token file not found at .access_token');
  process.exit(1);
}

const ACCESS_TOKEN = fs.readFileSync(tokenPath, 'utf-8').trim();

async function fetchGitHubData() {
  try {
    const userRes = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'User-Agent': 'AXD-App-Alpha'
      }
    });

    const reposRes = await axios.get('https://api.github.com/user/repos', {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'User-Agent': 'AXD-App-Alpha'
      }
    });

    console.log(`👤 Username: ${userRes.data.login}`);
    console.log(`📧 Email: ${userRes.data.email || 'Not public'}`);
    console.log(`📁 Repositories:`);

    reposRes.data.forEach(repo => {
      console.log(`- ${repo.full_name}`);
    });

  } catch (err) {
    console.error('❌ GitHub API Error:', err.response?.data || err.message);
  }
}

fetchGitHubData();
