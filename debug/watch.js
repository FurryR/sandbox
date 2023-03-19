const fs = require('fs')
const child_process = require('child_process')
const path = fs.realpathSync(`${__dirname}/../src/main.ts`)
console.info('[INFO] Start watching.')
const target = process.argv[2] ?? 'build'
const command = process.env['npm_config_command']
fs.watchFile(path, () => {
  process.stdout.write('[INFO] File modified, compiling')
  child_process.execSync(`npm run ${target}`)
  command && child_process.execSync(command)
  console.info(
    `\r[DONE] '${target}' Build done (${new Date().toLocaleString()})`
  )
})
