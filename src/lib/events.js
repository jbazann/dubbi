import { log } from "./log"
import { t } from "./t"

export {
    dispatch,
    newInputEvent,
    newPrintEvent,
    newScrollToBottomEvent,
    newScrollToPageEvent,
    newFetchPartialEvent,
    newLocationEvent,
    newHistoryPushEvent,
    newCommandEvent,
    newTtyFocusEvent,
    newRewireEvent,
    newSetAttributeEvent,
    newErrorMessageEvent,
    newLanguageSwitchEvent,
    newCheckRedirectEvent,
    newNoticeEvent,
    newPrintPrefacedEvent,
    newCatImgEvent,
    newPrepareCatImgEvent,
    newHrEvent
}

const DEFAULT_DISPATCH_OPTIONS = {
    target: document
}
function dispatch(event, opt = DEFAULT_DISPATCH_OPTIONS) {
    opt.target.dispatchEvent(_log(event))
}

function newInputEvent(input, line) {
    return new CustomEvent('tty:input', {detail: {input, line}})
}

function newPrintEvent(line) {
    return new CustomEvent('tty:print', {detail: {line}})
}

function newScrollToBottomEvent() {
    return new CustomEvent('tty:scroll:bottom')
}

function newScrollToPageEvent() {
    return new CustomEvent('tty:scroll:page')
}

function newFetchPartialEvent(detail) {
    return new CustomEvent('tty:partial', {detail})
}

function newLocationEvent(path) {
    return new CustomEvent('tty:location', {detail: {path}})
}

function newHistoryPushEvent() {
    return new CustomEvent('tty:history:push')
}

function newCommandEvent(cmd) {
    return new CustomEvent('tty:command', {detail: {cmd}})
}

function newTtyFocusEvent() {
    return new CustomEvent('tty:focus')
}

function newRewireEvent(kind = 'page') {
    return new CustomEvent(`tty:rewire:${kind}`)
}

function newSetAttributeEvent(attribute,value,target = document.documentElement) {
    return new CustomEvent('set:attribute',{detail: {attribute,value,target}})
}

function newErrorMessageEvent(msg) {
    return new CustomEvent('tty:print:error',{detail: {line: msg}})
}

function newLanguageSwitchEvent() {
    return new CustomEvent('tty:lang:switch')
}

function newCheckRedirectEvent() {
    return new CustomEvent('tty:check-redirect')
}

function newNoticeEvent(msg) {
    return new CustomEvent('tty:print:notice', {detail: {line: msg}})
}

function newPrintPrefacedEvent(preface,line) {
    return new CustomEvent('tty:print:preface', {detail: {preface,line}})
}

function newHrEvent() {
    return new CustomEvent('tty:print:hr')
}

function newCatImgEvent(url) {
    return new CustomEvent('tty:print:cat', {detail: {url, alt: t('cmd.cat.alt')}})
}

function newPrepareCatImgEvent(urls) {
    return new CustomEvent('tty:prepare:print:cat', {detail: {urls}})
}

function _log(event) {
    log({
        type: event.type,
        detail: event.detail
    }, 'EVENT')
    return event
} 