import { newInputEvent, dispatch } from "@lib/events"
import { pageId } from "@lib/globals"
import { err } from "@lib/log"

const attachListeners = (event: Event) => {
    const page = document.getElementById(pageId)
    !page && err(`Page container ${pageId} not found.`)
    const buttons = page?.querySelectorAll('button[data-component-command-trigger]') || []
    const location = window.location.pathname
    buttons.forEach(b => {
        const cmd = b.getAttribute('data-component-command-trigger') || ''
        b.addEventListener('click', (_event: Event) => {
            dispatch(newInputEvent(
                cmd, `guest :${location} > ${cmd}`
            )) 
        })
    })
}

document.addEventListener('tty:rewire:page', attachListeners)