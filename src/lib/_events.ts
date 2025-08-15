import { log } from "./log"

export {
    eventHandler,
    removeHandler
}

const handlers = new Map()
function eventHandler(
    event: string, 
    handler: (event: Event) => void, 
    target: Element | Document = document, 
    logTag?: string
) {
    !handlers.has(target) && handlers.set(target, new Map())
    const targetHandlers = handlers.get(target)
    const count = (targetHandlers.get(event) ?? 0) + 1
    log({elem: ((target as any).id || (target as any).tagName) ?? 'DOC', event, count}, logTag ? `HANDLER@${logTag}` : "HANDLER")
    targetHandlers.set(event, count)
    target.addEventListener(event, handler)
}

function removeHandler(
    event: string, 
    handler: (event: Event) => void, 
    target: Element = document.documentElement, 
    logTag?: string
) {
    if (!handlers.has(target)) return
    const targetHandlers = handlers.get(target)
    const count = targetHandlers.get(event) 
    log({elem: target.id || target.tagName, event, count, newCount: (count ?? 1) - 1}, logTag ? `HANDLER@${logTag}` : "HANDLER")
    targetHandlers.set(event, (count ?? 1) - 1)
    target.removeEventListener(event, handler)
}