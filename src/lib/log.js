import { eventHandler } from "./_events"
import { getCurrentSettings } from "./settings"

export {
    loggedEvent,
    log,
    err
}

let logging
const settingsLoader = (_event) => {
    logging = getCurrentSettings().logging
}
settingsLoader()
// TODO fix this, the scripts are full of circular dependencies
setTimeout(() => eventHandler('settings:change', settingsLoader))

function log(o, tag) {
    switch (logging) {
        case 'off':
            return
        case 'console':
            if (tag) { console.log(`${tag}: ${JSON.stringify(o)}`) } 
            else { console.log(JSON.stringify(o)) }
            return
    }
}

function err(e) {
        switch (logging) {
        case 'off':
            return
        case 'console':
            console.error(e)
            return
    }
}

function loggedEvent(type, options) {
    const event = new CustomEvent(type, options)
    log({
        type: event.type,
        detail: event.detail
    }, 'EVENT')
    return event
}