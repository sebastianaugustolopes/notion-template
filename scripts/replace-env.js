const fs = require('fs');
const path = require('path');

// Read the environment variable from Vercel (or use default)
const apiUrl = process.env.VITE_API_URL || 'http://localhost:8080';

// Path to the environment file
const envPath = path.join(__dirname, '../src/environments/environment.ts');

// Read the file
let content = fs.readFileSync(envPath, 'utf8');

// Replace the placeholder with the actual API URL
content = content.replace(/__API_URL__/g, apiUrl);

// Write back to the file
fs.writeFileSync(envPath, content, 'utf8');

console.log(`✅ Environment variable replaced: ${apiUrl}`);
