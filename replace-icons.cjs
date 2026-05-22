const fs = require('fs');
const https = require('https');

const htmlPath = 'index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

async function downloadSvg(name, weight) {
  const w = weight ? weight.replace('-', '') : 'regular';
  const fileName = w === 'regular' ? `${name}.svg` : `${name}-${w}.svg`;
  const url = `https://raw.githubusercontent.com/phosphor-icons/core/main/assets/${w}/${fileName}`;
  
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        resolve(null);
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  let match;
  const matches = [];
  const regex2 = /<i\s+([^>]*)class="([^"]*ph(?:-[a-z]+)?\s+ph-[a-z-]+[^"]*)"([^>]*)><\/i>/g;
  while ((match = regex2.exec(html)) !== null) {
    matches.push(match);
  }
  
  for (const m of matches) {
    const fullMatch = m[0];
    const beforeClass = m[1];
    const classStr = m[2];
    const afterClass = m[3];
    
    const classMatch = classStr.match(/ph(-[a-z]+)?\s+ph-([a-z-]+)/);
    if (!classMatch) continue;
    
    const weight = classMatch[1] || '';
    const name = classMatch[2];
    
    console.log(`Downloading ${name} (${weight})...`);
    let svg = await downloadSvg(name, weight);
    if (svg) {
      svg = svg.replace(/<\?xml.*?\?>/g, '').trim();
      const svgTagRegex = /^<svg([^>]*)>/;
      // Also remove phosphor-specific classes from classStr if you want, but it's fine to leave them.
      // Wait, phosphor uses `currentColor` naturally.
      // Add a width/height 1em if not present.
      const newSvg = svg.replace(svgTagRegex, `<svg class="${classStr}" ${beforeClass} ${afterClass} width="1em" height="1em" $1>`);
      html = html.replace(fullMatch, newSvg);
    } else {
      console.log(`Failed to download ${name}`);
    }
  }
  
  // Remove phosphor stylesheets
  html = html.replace(/<link rel="stylesheet".*?phosphor-icons.*?>\n?/g, '');
  // Remove noscript block related to phosphor
  html = html.replace(/<noscript>\s*<link rel="stylesheet".*?phosphor-icons.*?>\s*<link rel="stylesheet".*?phosphor-icons.*?>\s*<link rel="stylesheet".*?phosphor-icons.*?>\s*<\/noscript>\n?/g, '');
  
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log('Done!');
}

run();
