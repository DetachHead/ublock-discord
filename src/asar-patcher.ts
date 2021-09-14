import path from 'path'
import { tmpdir } from 'os'
import { createPackage, extractAll } from 'asar'
import { readFileSync, writeFileSync } from 'fs'
import Electron from 'electron'
import { getEnvVariable, promptRelaunchDiscord } from './utils'

export type InjectorFunction = (modules: { electron: typeof Electron; path: typeof path }) => void

const patchRegex = /\/\* discord-ublock patch \*\/.*\/\* end patch \*\//

/**
 bundled injector js be like:
 ```
 const s = require('path')
 var n = e.n(s)
 const t = require('electron')
 var r = e.n(t)
 const o = require('module')
 ```
 */
const getAppendedCode = (fn: InjectorFunction) =>
    // language=js
    `/* discord-ublock patch */ (${fn})({ electron: t, path: s }); /* end patch */`

const withExtractedAsar = async (fn: (path: string) => void) => {
    const asarPath = path.join(
        getEnvVariable('BETTERDISCORD_DATA_PATH'),
        'data',
        'betterdiscord.asar',
    )
    const extractedAsarPath = path.join(tmpdir(), 'betterdiscordPatch')
    extractAll(asarPath, extractedAsarPath)
    fn(extractedAsarPath)
    await createPackage(extractedAsarPath, asarPath)
}

export const patchBetterDiscordAsar = async (restartMessage: string, fn: InjectorFunction) => {
    await withExtractedAsar((extractedAsarPath) => {
        const injectorPath = path.join(extractedAsarPath, 'injector.js')
        const injectorCode = readFileSync(injectorPath, 'utf8')
        const appendedCode = getAppendedCode(fn)
        if (injectorCode.includes(appendedCode)) {
            console.log("function already added. removing (in case it's been updated)")
            writeFileSync(injectorPath, injectorCode.replace(patchRegex, appendedCode))
        } else {
            const endOfCode = '})();'
            writeFileSync(
                injectorPath,
                injectorCode.replace(
                    new RegExp(_.escapeRegExp(endOfCode) + '$'),
                    appendedCode + endOfCode,
                ),
            )
            promptRelaunchDiscord(restartMessage)
        }
    })
}

const replacePatchFromInjectJsFile = (injectorPath: string, replaceWith: string) => {
    const text = readFileSync(injectorPath, 'utf8')
    writeFileSync(injectorPath, text.replace(patchRegex, replaceWith))
}

export const removePatchFromBetterDiscordAsar = async (restartMessage: string) => {
    await withExtractedAsar((path) => replacePatchFromInjectJsFile(path, ''))
    promptRelaunchDiscord(restartMessage)
}
