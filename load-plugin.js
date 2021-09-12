//TODO: this currently only supports windows, figure out how to install https://github.com/BetterDiscordBuilder/bdbuilder because it might have this functionality

const fs = require('fs')
const path = require('path')

const distPath = './dist/ublock.plugin.js'
const fileName = path.basename(distPath)
fs.copyFileSync(distPath, `${process.env.APPDATA}/BetterDiscord/plugins/${fileName}`)
