/*
this file is intended to be bundled separately from the rest of this project, then injected into the bundled betterdiscord injector.js file

the injector has become the injectee!!!!!!!! LOL!
 */

import { ElectronBlocker } from '@cliqz/adblocker-electron'
import { app, session } from 'electron'
;(async () => {
    await app.whenReady()
    const blocker = await ElectronBlocker.fromPrebuiltAdsAndTracking(fetch)
    blocker.enableBlockingInSession(session.defaultSession)
})()
