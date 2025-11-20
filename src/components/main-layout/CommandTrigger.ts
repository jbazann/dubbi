import { eventHandler, removeHandler } from "@lib/_events"
import { newInputEvent, dispatch } from "@lib/events"
// import { ttyCurrentPageId } from "@lib/ids"
// import { err } from "@lib/log"

const attachListeners = (_event: Event) => {
    // const page = document.getElementById(ttyCurrentPageId)
    // !page && err(`Page container ${ttyCurrentPageId} not found.`)
    // const buttons = page?.querySelectorAll('button[data-component-command-trigger]') || []
    const buttons = document.querySelectorAll('button[data-component-command-trigger]') || []
    const location = window.location.pathname
    buttons.forEach(b => {
        const cmd = b.getAttribute('data-component-command-trigger') || ''
        const handler = (_event: Event) => {
            dispatch(newInputEvent(
                cmd, `guest :${location} > ${cmd}`
            )) 
        }
        const logTag = `CommandTrigger - ${cmd}`
        eventHandler('click', handler, b, logTag)
        eventHandler('sys:unmount', (_event: Event) => {
            removeHandler('click', handler, b, logTag)
        }, document, logTag)
    })
}

eventHandler('sys:mount', attachListeners)