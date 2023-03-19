// https://www.ccw.site/post/109edca6-8fd7-4e9c-8462-dcc06ec38988
const code = `// Powered by 凌 @ Simplicity Studio。使用请保留此代码的注释。此代码不可用于生产环境。
Object.defineProperty(window,"tempExt",{get(){console.error("[Error] Never use tempExt as a variable.")},set(n){window.ExtensionLib=window.ExtensionLib||{},window.ExtensionLib[n.info.extensionId]={Extension:async()=>n.Extension,info:n.info,l10n:n.l10n}}});`
const fs = require('fs')
console.info('[INFO] Patching script')
const path = fs.realpathSync(`${__dirname}/../dist/main.js`)
const raw = fs.readFileSync(path).toString('utf-8')
fs.writeFileSync(path, code + raw)
console.info('[DONE] Finished')
console.info('Hint: use `python3 -m http.server [port]` for a simple http file server.')