import { build } from 'esbuild'
import tsconfig from '../../tsconfig.json'
import path from 'path'
import * as fs from 'fs/promises'
import UblockPlugin from '../../renderer/src/ublock.plugin'
import inlineImportPlugin from 'esbuild-plugin-inline-import'
;(async () => {
    // build the injector that the plugin will load into betterdiscord's injector (we need its output because it needs to be inlined)
    const injectorFileName = 'injector.js'
    await build({
        entryPoints: [path.join(tsconfig.compilerOptions.outDir, 'injector/src', injectorFileName)],
        bundle: true,
        outfile: path.join('dist', injectorFileName),
        platform: 'node',
        external: [
            'electron',
            '@cliqz/adblocker-electron-preload', // uses require.resolve for which doesn't work with bundling tools
        ],
    })

    // build the plugin file (for the renderer)
    const pluginFileName = 'ublock.plugin.js'
    const outFile = path.join('dist', pluginFileName)
    await build({
        entryPoints: [
            path.join(tsconfig.compilerOptions.outDir, 'renderer', 'src', pluginFileName),
        ],
        bundle: true,
        outfile: outFile,
        platform: 'node',
        external: [
            'electron',
            'original-fs', // used by asar package
        ],
        plugins: [inlineImportPlugin()],
        banner: {
            // language=JavaScript
            js: `/**
 * @name ${UblockPlugin.name}
 */`,
        },
    })

    // TODO: this currently only supports windows, figure out how to install https://github.com/BetterDiscordBuilder/bdbuilder because it might have this functionality
    await fs.copyFile(outFile, `${process.env['APPDATA']}/BetterDiscord/plugins/${pluginFileName}`)
})()
