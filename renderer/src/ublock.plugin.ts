import { BdPlugin } from '@bandagedbd/bdapi'
import { extractedAsarPath, ublockDiscordDir, withExtractedAsar } from './asar-patcher'
import { appendFile, copyFile, mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { promptRelaunchDiscord } from './utils'

export default class UblockPlugin implements BdPlugin {
    private betterDiscordInjectorFilePath = path.join(extractedAsarPath, 'injector.js')
    private betterDiscordInjectorBackupFilePath = path.join(ublockDiscordDir, 'injectorBackup.js')
    private uninject = async (): Promise<boolean> => {
        try {
            await copyFile(
                this.betterDiscordInjectorBackupFilePath,
                this.betterDiscordInjectorFilePath,
            )
            return true
        } catch (_) {
            return false
        }
    }
    getName = () => 'ublock'
    getDescription = () =>
        'ublock but for discord. useful for blocking ads in the youtube together activity'
    getVersion = () => '0.0.1'
    getAuthor = () => 'detach head'
    start = async () => {
        await withExtractedAsar(async () => {
            // write this module to the asar separately from the bundle, because it's accessed using require.resolve
            const adblockerElectronPreloadModuleDir = path.join(
                extractedAsarPath,
                'node_modules/@cliqz/adblocker-electron-preload',
            )
            await mkdir(path.join(adblockerElectronPreloadModuleDir, 'dist'), { recursive: true })
            await writeFile(
                path.join(adblockerElectronPreloadModuleDir, 'dist/preload.cjs.js'),
                // eslint-disable-next-line @typescript-eslint/no-var-requires -- import not recognized at compiletime, gets inlined when bundled
                require('inline:../../../node_modules/@cliqz/adblocker-electron-preload/dist/preload.cjs.js'),
            )
            await writeFile(
                path.join(adblockerElectronPreloadModuleDir, 'package.json'),
                // eslint-disable-next-line @typescript-eslint/no-var-requires -- import not recognized at compiletime, gets inlined when bundled
                require('inline:../../../node_modules/@cliqz/adblocker-electron-preload/package.json'),
            )

            // try to restore the injector from the backup before changing it again
            const isFirstInstall = !(await this.uninject())
            if (isFirstInstall)
                // there was no backup, so make one
                await copyFile(
                    this.betterDiscordInjectorFilePath,
                    this.betterDiscordInjectorBackupFilePath,
                )

            // now inject
            await appendFile(
                this.betterDiscordInjectorFilePath,
                // language=js
                `/* discord-ublock patch */${require('inline:../../../dist/injector.js')}/* end patch */`,
            )
            if (isFirstInstall)
                promptRelaunchDiscord('ublock extension injected into betterdiscord')
        })
    }
    stop = async () => {
        await withExtractedAsar(async () => {
            if (await this.uninject())
                promptRelaunchDiscord('ublock extension removed from betterdiscord')
            else {
                BdApi.alert(
                    'something went wrong',
                    "tried to uninject the plugin but it wasn't found",
                )
            }
        })
    }
}
