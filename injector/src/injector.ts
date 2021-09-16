/*
this file is intended to be bundled separately from the rest of this project, then injected into the bundled betterdiscord injector.js file

the injector has become the injectee!!!!!!!! LOL!
 */

// imports we're bundling into the injector
import { adsAndTrackingLists, ElectronBlocker } from '@cliqz/adblocker-electron'

// type imports for values we declare already exist in the betterdiscord injector
import type Electron from 'electron'

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
declare const t: typeof Electron
;(async () => {
    await t.app.whenReady()
    const blocker = await ElectronBlocker.fromLists(fetch, adsAndTrackingLists, {
        loadCosmeticFilters: false,
    })
    blocker.enableBlockingInSession(t.session.defaultSession)
})()
