const fs = require('fs');
const path = require('path');

const walk = (dir, ext = '.tsx', files = []) => {
  const entries = fs.readdirSync(dir);
  for (let entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath, ext, files);
    } else if (fullPath.endsWith(`page${ext}`)) {
      files.push(fullPath);
    }
  }
  return files;
};

const TARGET_HOOKS = ['useSearchParams', 'usePathname', 'useRouter'];

const insertDirectivesIfNeeded = (filePath) => {
  let code = fs.readFileSync(filePath, 'utf-8');

  const hasHook = TARGET_HOOKS.some((hook) => code.includes(hook));
  const alreadyClient = code.includes("'use client'") || code.includes('"use client"');
  const alreadyDynamic = code.includes("export const dynamic =");

  if (hasHook) {
    let updated = false;

    if (!alreadyClient) {
      code = `'use client';\n` + code;
      updated = true;
    }

    if (!alreadyDynamic) {
      code = `'use client';\nexport const dynamic = 'force-dynamic';\n` + code.replace(/^('use client'|"use client");\n/, '');
      updated = true;
    }

    if (updated) {
      fs.writeFileSync(filePath, code, 'utf-8');
      console.log(`✅ Fixed: ${filePath}`);
    }
  }
};

const pages = walk(path.join(__dirname, 'src', 'app'));
pages.forEach(insertDirectivesIfNeeded);

console.log('\n🚀 انتهى التعديل على الصفحات تلقائيًا!');
