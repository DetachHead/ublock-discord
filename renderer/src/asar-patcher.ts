import path from 'path'
import { tmpdir } from 'os'
import { createPackage, extractAll } from 'asar'
import { readFile, writeFile } from 'fs/promises'
import { getEnvVariable, promptRelaunchDiscord } from './utils'

const patchRegex = /\/\* discord-ublock patch \*\/(.|\n)*\/\* end patch \*\//

const withExtractedAsar = async (fn: (path: string) => void) => {
    const asarPath = path.join(
        getEnvVariable('BETTERDISCORD_DATA_PATH'),
        'data',
        'betterdiscord.asar',
    )
    const extractedAsarPath = path.join(tmpdir(), 'betterdiscordPatch')
    extractAll(asarPath, extractedAsarPath)
    await fn(extractedAsarPath)
    await createPackage(extractedAsarPath, asarPath)
}

export const patchBetterDiscordAsar = async (restartMessage: string, code: string) => {
    await withExtractedAsar(async (extractedAsarPath) => {
        const injectorPath = path.join(extractedAsarPath, 'injector.js')
        const injectorCode = await readFile(injectorPath, 'utf8')
        const appendedCode =
            // language=js
            `/* discord-ublock patch */ ${code}; /* end patch */`
        if (injectorCode.includes(appendedCode)) {
            // TODO: backup the file instead, this method seems to make it double patch and mess up the file
            console.log("function already added. removing (in case it's been updated)")
            await writeFile(injectorPath, injectorCode.replace(patchRegex, appendedCode))
        } else {
            const endOfCode = '})();'
            await writeFile(
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

const replacePatchFromInjectJsFile = async (injectorPath: string, replaceWith: string) => {
    const text = await readFile(injectorPath, 'utf8')
    await writeFile(injectorPath, text.replace(patchRegex, replaceWith))
}

export const removePatchFromBetterDiscordAsar = async (restartMessage: string) => {
    await withExtractedAsar((path) => replacePatchFromInjectJsFile(path, ''))
    promptRelaunchDiscord(restartMessage)
}
