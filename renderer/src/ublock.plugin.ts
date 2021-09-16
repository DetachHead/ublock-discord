import { BdPlugin } from '@bandagedbd/bdapi'
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
            // eslint-disable-next-line @typescript-eslint/no-var-requires -- import doesn't exist at compiletime, gets inlined when bundled
            require('inline:../../../dist/injector.js'),
        )
    stop = () => removePatchFromBetterDiscordAsar('ublock extension removed from betterdiscord')
}
