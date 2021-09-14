import { ipcRenderer } from 'electron'

export const relaunchDiscord = () => ipcRenderer.send('bd-relaunch-app')

export const promptRelaunchDiscord = (restartMessage: string) =>
    BdApi.showConfirmationModal(
        'restart required',
        `${restartMessage} - restart discord for changes to take effect`,
        {
            confirmText: 'ok',
            cancelText: 'later',
            onConfirm: relaunchDiscord,
        },
    )

export const getEnvVariable = (name: string) => {
    const result: string | undefined = process.env[name]
    if (typeof result === 'undefined') throw new Error(`env variable not set: ${name}`)
    return result
}
