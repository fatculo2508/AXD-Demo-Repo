# AXD App Alpha – GitHub OAuth Starter

## Features
- ✅ Browser-based OAuth with redirect
- ✅ Device Flow support for CLI / headless auth

## Setup
1. Create `.env` with:
   ```
   GITHUB_CLIENT_ID=0v23lix7d1poiYhscn8X
   GITHUB_CLIENT_SECRET=5d5f27b4af7890c99de8d8eef261e506bde158d4
   CALLBACK_URL=http://localhost:3000/callback
   ```

2. Install dependencies:
   ```
   npm install express axios dotenv
   ```

3. Run:
   ```
   node server.js      # browser-based
   node device_flow.js # terminal-based
   ```

## Callback
Make sure the GitHub App callback URL is:
```
http://localhost:3000/callback
```
# AXD GitHub API App
