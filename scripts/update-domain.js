const fs = require('fs');
const path = require('path');

// Configuration
const OLD_DOMAIN = 'farmbro.vercel.app';
const NEW_DOMAIN = process.argv[2]; // Get from command line arg

if (!NEW_DOMAIN) {
    console.error('❌ Please provide your new domain as an argument.');
    console.error('Usage: node update-domain.js mynewdomain.com');
    process.exit(1);
}

// List of files that definitely contain the old domain
const FILES_TO_UPDATE = [
    'frontend/index.html',
    'frontend/public/sitemap.xml',
    'frontend/public/robots.txt',
    'frontend/src/components/SEO.tsx',
    'frontend/src/components/Layout.tsx',
    'frontend/src/pages/HomePage.tsx',
    'frontend/src/pages/Weather.tsx',
    'frontend/src/pages/DiseaseDetection.tsx',
    'frontend/src/pages/MachineryMarketplace.tsx',
    'frontend/src/pages/GovernmentSchemes.tsx',
    'frontend/src/pages/Credits.tsx',
    'frontend/src/pages/UserProfile.tsx',
    'frontend/src/pages/OwnerDashboard.tsx',
    'frontend/src/pages/BookingHistory.tsx',
    'frontend/src/pages/NotFound.tsx'
];

console.log(`🚀 Starting domain migration: ${OLD_DOMAIN} -> ${NEW_DOMAIN}`);
console.log('---------------------------------------------------');

let updatedFiles = 0;
let errors = 0;

FILES_TO_UPDATE.forEach(filePath => {
    try {
        const fullPath = path.resolve(__dirname, '..', filePath);

        if (!fs.existsSync(fullPath)) {
            console.warn(`⚠️ File not found (skipping): ${filePath}`);
            return;
        }

        let content = fs.readFileSync(fullPath, 'utf8');

        // Check if file contains the old domain
        if (content.includes(OLD_DOMAIN)) {
            // Replace all occurrences
            const newContent = content.split(OLD_DOMAIN).join(NEW_DOMAIN);

            fs.writeFileSync(fullPath, newContent, 'utf8');
            console.log(`✅ Updated: ${filePath}`);
            updatedFiles++;
        } else {
            console.log(`ℹ️ No changes needed: ${filePath}`);
        }
    } catch (err) {
        console.error(`❌ Error updating ${filePath}:`, err.message);
        errors++;
    }
});

console.log('---------------------------------------------------');
if (errors === 0) {
    console.log(`🎉 SUCCESS! Updated ${updatedFiles} files.`);
    console.log(`\nNext Steps:`);
    console.log(`1. Redeploy your frontend to Vercel`);
    console.log(`2. Go to Google Search Console and add property: https://${NEW_DOMAIN}`);
    console.log(`3. Submit your new sitemap: https://${NEW_DOMAIN}/sitemap.xml`);
} else {
    console.log(`⚠️ Completed with ${errors} errors.`);
}
