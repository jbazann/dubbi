import { getLooselyParsedCookies, getSessionStorage, setCookie, setSessionStorage } from "./util"
import QK from "./cookies.json"
import { dispatch, newLanguageSwitchEvent, newSettingsChangeEvent } from "./events"
import { get } from "./net"
import { t_obj } from "./t"
import { log } from "./log"

export {
    getCurrentSettings,
    loadSettings,
    setLanguage,
    setForceLanguage,
    setTheme,
    setLogging,
    setNavTools,
}

// SS: sessionStorage
const SSKeys = {
    logs: 'settings:logs'
}

const current = {
    "force-language": true,
    navtools: '',
    language: '',
    theme: '',
    cookies: "allow",
    logging: 'off'
}

// Exceptionally load this immediately so that log.js doesn't misread an 'off' value.
// TODO fix
let logs
if (logs = sessionStorage.getItem(SSKeys.logs)) current.logging = logs

function loadSettings() {
    const cookies = getLooselyParsedCookies()
    if (cookies[QK.language]) current.language = cookies[QK.language]
    if (cookies[QK["force-language"]]) {
        current["force-language"] = cookies[QK["force-language"]]
    } else {
        setCookie(QK["force-language"], 'true')
    }
    if (cookies[QK.theme]) current.theme = cookies[QK.theme]
    let logs
    if (logs = getSessionStorage(SSKeys.logs)) current.logging = logs
    dispatch(newSettingsChangeEvent())
}

function getCurrentSettings() {
    return Object.assign({}, t_obj('cmd.settings.names', current))
}
async function setLanguage(lang) {
    switch (lang) {
        case 'en':
        case 'es':
            window._jbazann.lang = await get(`${window.location.origin}/api/lang/${lang}.json`)
            current.language = lang
            setCookie(QK.language, lang)
            dispatch(newLanguageSwitchEvent()) // TODO deprecate this event?
            dispatch(newSettingsChangeEvent())
            return true
        default:
            return false
    }
}

function setForceLanguage(val) {
    switch (val) {
        case 'true':
        case 'false':
            current["force-language"] = val
            setCookie(QK["force-language"], val)
            dispatch(newSettingsChangeEvent())
            return true
        default:
            return false
    }
}

function setTheme(theme) {
    switch (theme) {
        case "default":
        case "default-light":
        case "default-dark":
        case "autumn-dawn":
        case "autumn-dusk":
        case "psycho-stark":
        case "psycho-dark":
        case "neo-cyan":
        case "retro-cyan":
        case "cloudy-salmon":
        case "nightly-lavender":
        case "dawnly-lavender":
        case "dainty-elegance":
            current.theme = theme
            setCookie(QK.theme, theme)
            document.documentElement.setAttribute('data-theme', theme)
            dispatch(newSettingsChangeEvent())
            return true
        default:
            return false
        
    }
}

function setNavTools(val) {
        switch (val) {
        case 'true':
        case 'false':
            current["navtools"] = val
            setCookie(QK["navtools"], val)
            dispatch(newSettingsChangeEvent())
            return true
        default:
            return false
    }
}

function setLogging(val) {
    switch (val) {
        case 'off':
        case 'console':
            current["logging"] = val
            setSessionStorage(SSKeys.logs, val)
            dispatch(newSettingsChangeEvent())
            return true
        default:
            return false
    }
}