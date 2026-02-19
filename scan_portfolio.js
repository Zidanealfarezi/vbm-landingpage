const fs = require('fs');
const path = require('path');

const PORTFOLIO_DIR = './PORTFOLIO';
const OUTPUT_FILE = './portfolio-data.json';
const VALID_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

function scanPortfolio() {
    if (!fs.existsSync(PORTFOLIO_DIR)) {
        console.error(`Directory ${PORTFOLIO_DIR} not found!`);
        return;
    }

    const projects = [];
    const entries = fs.readdirSync(PORTFOLIO_DIR, { withFileTypes: true });

    entries.forEach(entry => {
        if (entry.isDirectory()) {
            const projectPath = path.join(PORTFOLIO_DIR, entry.name);
            const files = fs.readdirSync(projectPath);

            // Find the first valid image
            const imageFile = files.find(file => {
                const ext = path.extname(file).toLowerCase();
                return VALID_EXTENSIONS.includes(ext);
            });

            if (imageFile) {
                // Construct path relative to the root for the <img> src
                // Encode URI component to handle spaces and special chars
                const relativePath = `PORTFOLIO/${encodeURIComponent(entry.name)}/${encodeURIComponent(imageFile)}`;

                projects.push({
                    title: entry.name,
                    category: 'Proyek', // Default category
                    image: relativePath
                });
                console.log(`[OK] Added project: ${entry.name}`);
            } else {
                console.warn(`[SKIP] No valid image found in: ${entry.name}`);
                // Check if there are HEIC files to warn specifically
                const heicFile = files.find(file => path.extname(file).toLowerCase() === '.heic');
                if (heicFile) {
                    console.warn(`       -> Found HEIC file (${heicFile}). Please convert to JPG/PNG.`);
                }
            }
        }
    });

    const jsonContent = JSON.stringify(projects, null, 2);
    fs.writeFileSync(OUTPUT_FILE, jsonContent);
    console.log(`\nSuccessfully generated ${OUTPUT_FILE} with ${projects.length} projects.`);
}

scanPortfolio();
