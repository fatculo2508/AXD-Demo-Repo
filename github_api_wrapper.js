const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const GITHUB_API_BASE = 'https://api.github.com';
const TOKEN = process.env.ACCESS_TOKEN;

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  Accept: 'application/vnd.github+json',
  'User-Agent': 'AXD-App-Agent'
};

async function createRepo(repoName) {
  const res = await axios.post(`${GITHUB_API_BASE}/user/repos`, {
    name: repoName,
    private: false,
    auto_init: false
  }, { headers });
  return res.data.full_name;
}

async function uploadFile(owner, repo, filePath, content, message = 'Initial commit') {
  const encodedContent = Buffer.from(content).toString('base64');
  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${filePath}`;
  await axios.put(url, {
    message,
    content: encodedContent,
    branch: 'main'
  }, { headers });
}

async function createIssue(owner, repo, title, body) {
  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/issues`;
  const res = await axios.post(url, { title, body }, { headers });
  return res.data.html_url;
}

module.exports = {
  createRepo,
  uploadFile,
  createIssue
};
