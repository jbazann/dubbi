export {
    loggedEvent,
    log,
    err
}

function log(o, tag) {
    if (import.meta.env.DEV) {
        tag 
            ? console.log(`${tag}: ${JSON.stringify(o)}`)
            : console.log(JSON.stringify(o))
    }
}

function err(e) {
    if (import.meta.env.DEV) {
        console.error(e)
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