import { log } from "./log"
import { t } from "./t"

const DEFAULT_DISPATCH_OPTIONS = {
    target: document
}
export function dispatch(event, opt = DEFAULT_DISPATCH_OPTIONS) {
    opt.target.dispatchEvent(_log(event))
}

export function newInputEvent(input, line) {
    return new CustomEvent('tty:input', {detail: {input, line}})
}

export function newPrintEvent(line) {
    return new CustomEvent('tty:print', {detail: {line}})
}

export function newPrintCodeEvent(line) {
    return new CustomEvent('tty:print:code', {detail: {line}})
}

export function newScrollToBottomEvent() {
    return new CustomEvent('tty:scroll:bottom')
}

export function newScrollToPageEvent() {
    return new CustomEvent('tty:scroll:page')
}

export function newFetchPartialEvent(detail) {
    return new CustomEvent('tty:partial', {detail})
}

export function newLocationEvent(path) {
    return new CustomEvent('tty:location', {detail: {path}})
}

export function newHistoryPushEvent() {
    return new CustomEvent('tty:history:push')
}

export function newCommandEvent(cmd) {
    return new CustomEvent('tty:command', {detail: {cmd}})
}

export function newTtyFocusEvent() {
    return new CustomEvent('tty:focus')
}

export function newRewireEvent(kind = 'page') {
    return new CustomEvent(`tty:rewire:${kind}`)
}

export function newSetAttributeEvent(attribute,value,target = document.documentElement) {
    return new CustomEvent('set:attribute',{detail: {attribute,value,target}})
}

export function newErrorMessageEvent(msg) {
    return new CustomEvent('tty:print:error',{detail: {line: msg}})
}

export function newLanguageSwitchEvent() {
    return new CustomEvent('tty:lang:switch')
}

export function newCheckRedirectEvent() {
    return new CustomEvent('tty:check-redirect')
}

export function newNoticeEvent(msg) {
    return new CustomEvent('tty:print:notice', {detail: {line: msg}})
}

export function newTipEvent(msg) {
    return new CustomEvent('tty:print:tip', {detail: {line: msg}})
}

export function newPrintPrefacedEvent(preface,line) {
    return new CustomEvent('tty:print:preface', {detail: {preface,line}})
}

export function newHrEvent() {
    return new CustomEvent('tty:print:hr')
}

export function newCatImgEvent(url) {
    return new CustomEvent('tty:print:cat', {detail: {url, alt: t('cmd.cat.alt')}})
}

export function newPrepareCatImgEvent(urls) {
    return new CustomEvent('tty:prepare:print:cat', {detail: {urls}})
}

export function newClsEvent() {
    return new CustomEvent('tty:cls')
}

export function newSettingsChangeEvent() {
    return new CustomEvent('settings:change')
}

export function newPrintLsEvent(entries) {
    return new CustomEvent('tty:print:ls', {detail: {entries}})
}

function _log(event) {
    log({
        type: event.type,
        detail: event.detail
    }, 'EVENT')
    return event
} 