/**
 * @name UblockPlugin
 */

// typescript normally includes "use strict" in the compiled output, but the meta block must be on the first line or the plugin will fail to load
'use strict'

import { BdPlugin } from '@bandagedbd/bdapi'

export default class UblockPlugin implements BdPlugin {
    getName = () => 'ublock'
    getDescription = () =>
        'ublock but for discord. useful for blocking ads in the youtube together activity'
    getVersion = () => '0.0.1'
    getAuthor = () => 'detach head'
    start = () => {
        BdApi.alert('😳', 'todo')
    }
    stop = () => undefined
}
