import { getLooselyParsedCookies, setCookie } from "./util"
import QK from "./cookies.json"
import { dispatch, newLanguageSwitchEvent } from "./events"
import { get } from "./net"
import { t_obj } from "./t"
import { log } from "./log"
import { cookiesMiddleware } from "src/middleware"

export {
    getCurrentSettings,
    loadSettings,
    setLanguage,
    setForceLanguage,
    setTheme,
}

const current = {
    "force-language": true,
    language: '',
    theme: '',
    cookies: "allow"
}


function loadSettings() {
    log("LOADING SETTINGS", "SETTINGS")
    const cookies = getLooselyParsedCookies()
    if (cookies[QK.language]) current.language = cookies[QK.language]
    if (cookies[QK["force-language"]]) {
        current["force-language"] = cookies[QK["force-language"]]
    } else {
        setCookie(QK["force-language"], 'true')
    }
    if (cookies[QK.theme]) current.theme = cookies[QK.theme]
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
            dispatch(newLanguageSwitchEvent())
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
            return true
        default:
            return false
    }
}

function setTheme(theme) {
    switch (theme) {
        case "autumn-dawn":
        case "autumn-dusk":
        case "psycho-stark":
        case "neo-cyan":
        case "cloudy-salmon":
        case "nightly-lavender":
        case "dainty-elegance":
            current.theme = theme
            setCookie(QK.theme, theme)
            document.documentElement.setAttribute('data-theme', theme)
            return true
        default:
            return false
        
    }
}