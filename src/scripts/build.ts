import { build, BuildOptions } from 'esbuild'
import UblockPlugin from '../ublock.plugin'
import tsconfig from '../../tsconfig.json'
import path from 'path'
import * as fs from 'fs'
import { Required } from 'utility-types'

const pluginFileName = 'ublock.plugin.js'

const buildOptions: Required<BuildOptions, 'outfile'> = {
    entryPoints: [path.join(tsconfig.compilerOptions.outDir, 'src', pluginFileName)],
    bundle: true,
    outfile: path.join('dist', pluginFileName),
    platform: 'node',
    external: [
        'electron',
        'original-fs', // used by asar package
    ],
    banner: {
        // language=JavaScript
        js: `/**
 * @name ${UblockPlugin.name}
 */`,
    },
}

;(async () => {
    await build(buildOptions)

    // TODO: this currently only supports windows, figure out how to install https://github.com/BetterDiscordBuilder/bdbuilder because it might have this functionality
    fs.copyFileSync(
        buildOptions.outfile,
        `${process.env['APPDATA']}/BetterDiscord/plugins/${pluginFileName}`,
    )
})()
