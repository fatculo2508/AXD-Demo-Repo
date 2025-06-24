require('dotenv').config(); // Load .env at the top

const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  console.log("Using CLIENT_ID:", process.env.GITHUB_CLIENT_ID);

  const authUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo`;
  res.send(`<a href="${authUrl}">Authorize with GitHub</a>`);
});

app.get('/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Missing code parameter');
  }

  try {
    const tokenRes = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: 'application/json' },
      }
    );

    const accessToken = tokenRes.data.access_token;

    if (!accessToken) {
      return res.status(401).send("Failed to retrieve access token.");
    }

    const userRes = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `token ${accessToken}` },
    });

    const user = userRes.data;
    console.log(`✅ GitHub user logged in: ${user.login} (ID: ${user.id})`);

    res.json({
      message: 'Authenticated successfully!',
      githubUser: user,
    });
  } catch (err) {
    console.error("OAuth error:", err.message);
    res.status(500).send('OAuth Error: ' + err.message);
  }
});

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
