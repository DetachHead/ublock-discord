import { BdPlugin } from '@bandagedbd/bdapi'
import { getEnvVariable } from './utils'
import { patchBetterDiscordAsar, removePatchFromBetterDiscordAsar } from './asar-patcher'

export default class UblockPlugin implements BdPlugin {
    getName = () => 'ublock'
    getDescription = () =>
        'ublock but for discord. useful for blocking ads in the youtube together activity'
    getVersion = () => '0.0.1'
    getAuthor = () => 'detach head'
    start = () =>
        patchBetterDiscordAsar(
            'ublock extension injected into betterdiscord',
            async ({ electron, path }) => {
                await electron.session.defaultSession.loadExtension(
                    // TODO: unhardcode
                    path.join(
                        getEnvVariable('LOCALAPPDATA'),
                        'Microsoft\\Edge\\User Data\\Default\\Extensions\\cjpalhdlnbpafiamejdnhcphjbkeiagm\\1.37.2_24',
                    ),
                )
            },
        )
    stop = () => removePatchFromBetterDiscordAsar('ublock extension removed from betterdiscord')
}
