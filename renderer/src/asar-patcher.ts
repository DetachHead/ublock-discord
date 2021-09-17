import path from 'path'
import { tmpdir } from 'os'
import { createPackage, extractAll } from 'asar'
import { getEnvVariable } from './utils'

export const ublockDiscordDir = path.join(tmpdir(), 'betterdiscordPatch')
export const extractedAsarPath = path.join(ublockDiscordDir, 'extractedAsar')

export const withExtractedAsar = async (fn: () => void) => {
    const asarPath = path.join(
        getEnvVariable('BETTERDISCORD_DATA_PATH'),
        'data',
        'betterdiscord.asar',
    )
    extractAll(asarPath, extractedAsarPath)
    await fn()
    await createPackage(extractedAsarPath, asarPath)
}
