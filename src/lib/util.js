import { log } from "./log"
import COOKIES from "./cookies.json"

export {
    parseDOMData,
    setCookie,
    clearCookie,
    getLooselyParsedCookies,
    localizePath,
    getLocalStorage,
    getSessionStorage,
    setLocalStorage,
    setSessionStorage,
    currentLanguage
}

function parseDOMData(id,attribute) {
    return JSON.parse(document.getElementById(id)?.getAttribute(attribute) || '{}')
}

const DAY_SEC = 86_400
const DEFAULT_MAX_AGE_DAYS = 72
const RENEWABLE_COOKIES = {
    theme: DEFAULT_MAX_AGE_DAYS,
    language: DEFAULT_MAX_AGE_DAYS,
}
function setCookie(key, value, days = DEFAULT_MAX_AGE_DAYS) {
    log({key, value, days}, 'SET COOKIE')
    document.cookie = `${key}=${value}; Path=/; Secure; SameSite=None; Max-Age=${days * DAY_SEC};`
}

function clearCookie(key) {
    document.cookie = `${key}=; Path=/; Secure; SameSite=None; Expires=Thu, 01 Jan 1970 00:00:00 GMT;`
}

function getLooselyParsedCookies() {
    const cookies = document.cookie.split(";")
        .map(str => str.split("=", 2))
        .reduce((acc, curr) => {
            acc[curr[0]?.trim() ?? ''] = curr[1]?.trim()
            return acc;
        }, {})
    return cookies
}

typeof document !== 'undefined' && setTimeout((function cookiesAutoRenew() {
    const cookies = getLooselyParsedCookies()

    if (Object.hasOwn(cookies,COOKIES.renew)) return
    log(`${COOKIES.renew} not found.}.`, 'COOKIE RENEWAL')
    log(`Checking cookies: ${JSON.stringify(RENEWABLE_COOKIES)} in ${JSON.stringify(cookies)}`, 'COOKIE RENEWAL')
    
    setCookie(COOKIES.renew, '', 1)
    for (const [qk, days] of Object.entries(RENEWABLE_COOKIES)) {
        if (Object.hasOwn(cookies, COOKIES[qk])) {
            log(`Setting ${qk}: ${cookies[qk]}`, 'COOKIE RENEWAL')
            setCookie(qk, cookies[qk], days)
        }
    }
}))

// TODO do this correctly
function localizePath(path, locale) {
    if (path.startsWith('/es')) path = path.slice(3)
    if (path.startsWith('/es/')) path = path.slice(4)
    if (path.startsWith('/')) path = path.slice(1)
    return locale === 'en' ? `/${path}` : `/${locale}/${path}`
}

function setLocalStorage(key, val) {
    localStorage.setItem(key, val)
    log({key,val}, "LOCAL STORAGE SET")
}

function getLocalStorage(key) {
    const r = localStorage.getItem(key)
    log({key, r}, "LOCAL STORAGE GET")
    return r
}

function setSessionStorage(key, val) {
    sessionStorage.setItem(key, val)
    log({key,val}, "SESSION STORAGE SET")
}

function getSessionStorage(key) {
    const r = sessionStorage.getItem(key)
    log({key, r}, "SESSION STORAGE GET")
    return r
}

function currentLanguage() {
    return document.documentElement.getAttribute('lang')
}
