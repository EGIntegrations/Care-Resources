const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Copy the source logo to assets directory
const sourceLogo = '/Users/elliottgodwin/Desktop/Expat/AppIconv1.png';
const destinationIcon = path.join(__dirname, '..', 'assets', 'icon.png');
const destinationAdaptive = path.join(__dirname, '..', 'assets', 'adaptive-icon.png');
const destinationFavicon = path.join(__dirname, '..', 'assets', 'favicon.png');

console.log('Copying Care Resources logo to app assets...');

// Ensure assets directory exists
const assetsDir = path.dirname(destinationIcon);
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Copy the logo file
fs.copyFileSync(sourceLogo, destinationIcon);
fs.copyFileSync(sourceLogo, destinationAdaptive);
fs.copyFileSync(sourceLogo, destinationFavicon);

console.log('✅ App icons updated with Care Resources logo');
console.log('📱 icon.png:', destinationIcon);
console.log('🤖 adaptive-icon.png:', destinationAdaptive);
console.log('🌐 favicon.png:', destinationFavicon);