const { createRepo, createIssue, uploadFile } = require('./github_api_wrapper');

// Examples
createRepo('AXD-Demo-Repo', false);
createIssue('fatculo2508', 'AXD-Demo-Repo', 'Test Issue', 'This is a test issue from CLI.');
uploadFile('fatculo2508', 'AXD-Demo-Repo', './README.md', 'README.md');
