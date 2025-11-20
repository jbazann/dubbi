import { navigate } from "astro:transitions/client"
import { dispatch, newCatImgEvent, newClsEvent, newErrorMessageEvent, newFetchPartialEvent, newLocationEvent, newPrepareCatImgEvent, newPrintCodeEvent, newPrintEvent, newPrintLsEvent, newPrintPrefacedEvent, newSetAttributeEvent, newStartLoadEvent, newEndLoadEvent, newHideInputEvent, newShowInputEvent } from "./events"
import { err, log, loggedEvent } from "./log"
import { get, post } from "./net"
import { clearCookie, currentLanguage, localizePath, setCookie } from "./util"
import COOKIES from "./cookies.json"
import { t, t_obj } from "./t"
import { getCurrentSettings, loadSettings, setForceLanguage, setLanguage, setLogging, setTheme, setNavTools } from "./settings"
import { eventHandler } from "./_events"

export {
    runCommand
}

const error = Symbol('error')
const blankText = /^\s*$/

const commands = {
    _ev,
    _silly,
    _cookies,
    echo,
    recho,
    "remote-echo": recho,
    help,
    h: help,
    "?": help,
    nav,
    n: nav,
    navigate: nav,
    navegar: nav,
    cd,
    c: cd,
    goto: cd,
    sitemap,
    m: sitemap,
    sm: sitemap,
    map: sitemap,
    settings,
    s: settings,
    set: settings,
    setting: settings,
    cat,
    cls,
    ls,
    l: ls,
    whoami,
}

function splitArguments(str) {
    if (typeof str !== 'string') {
        err({str: JSON.stringify(str), msg: "str must be a string."})
        return [null, error]
    }
    str = str.trim()
    let quote = '', current = ''
    const args = []
    for (let i = 0;i < str.length;i++) {
        const chr = str[i]
        if (chr === '"' || chr === "'") {
            if (quote === '' && current !== '') {
                current += chr
            } else if (quote === '') {
                quote = chr
            } else if (quote === chr) {
                quote = ''
                if (!blankText.test(current)) {
                    args.push(current)
                }
                current = ''
            } else {
                current += chr
            }
        } else if (chr === ' ') {
            if (quote === '' && current !== '') {
                args.push(current)
                current = ''
            } else if (quote !== '') {
                current += chr
            } else {
                // skip repeated white space
            }
        } else {
            current += chr
        }
    }

    if (current !== '') {
        if (quote !== '') {
            const [subSplit, e] = splitArguments(current)
            if (e === error) return [null, error] 
            subSplit[0] = quote + subSplit[0]
            args.concat(subSplit)
        } else {
            args.push(current)
        }
    }

    return [args, null]
}

function runCommand(str) {
    log(str,'RUN')
    if (blankText.test(str)) {
        emptyLine()
        return
    }

    const [args, e] = splitArguments(str)
    if (e || args.length === 0) {
        err({e,args})
        invalidInput(str)
        return
    }

    const cmd = args[0].toLowerCase()
    log({cmd,args}, 'COMMAND')
    args[0] = str
    if (Object.hasOwn(commands, cmd)) {
        commands[cmd](args)
    } else {
        unknownCommand(cmd)
    }
}

function emptyLine() {
   dispatch(newPrintEvent(''))
}

function unknownCommand(cmd) {
   dispatch(newPrintEvent(`Unknown command '${cmd}'.`))
}

function invalidInput(str) {
   dispatch(newPrintEvent(`Invalid input '${str}'.`))
}

function echo(args) {
    if (args[1] === '-c' || args[1] === '--code') {
        dispatch(newPrintCodeEvent(args.length === 3 ? args[2] : args[0].slice(args[0].indexOf(' ', args[0].indexOf(' ') + 1)).trim()))
        return
    }
   dispatch(newPrintEvent(args.length === 2 ? args[1] : args[0].slice(args[0].indexOf(' ')).trim()))
}

function recho(args) {
    post(window.location.origin + '/api/commands/recho', args.length === 2 ? args[1] : args[0].slice(args[0].indexOf(' ')).trim())
        .then((r) => dispatch(newPrintEvent(r || '')))
}

function help(args) {
    // plain cmd
    if (args.length <= 1) {
        dispatch(newFetchPartialEvent({url: `/api/partials/${currentLanguage()}/help/base`}))
        return
    }

    // plain cmd with flags
    if (args[1].startsWith('-')) {
        let section = null
        for (const arg of args.slice(1)) {
            switch(arg.toLowerCase()) {
                case '-n':
                case '--navegacion':
                case '--navigation': section = 'navigation'
                    break
                case '-t':
                case '--tutorial': section = 'tutorial'
                    break
            }
        }
        if (section === null) {
            dispatch(newErrorMessageEvent(t('cmd.help.msg.inv_opt',  {opt: args[1]})))
        } else {
            dispatch(newFetchPartialEvent({
                url: `/api/partials/${currentLanguage()}/help/${section}`
            }))   
        }
        return
    }
    
    const command = getCommandHelpSection(args[1])

    if (command) {
        dispatch(newFetchPartialEvent({
            url: `/api/partials/${currentLanguage()}/help/${command}`
        }))   
    } else {
        dispatch(newPrintEvent(t('cmd.help.msg.unknown', {cmd: args[1]})))
    }
}

function getCommandHelpSection(arg) {
    let command = null
    switch (arg?.toLowerCase()) {
        case 'help':
        case 'nav':
        case 'cd':
        case 'ls':
        case 'cat':
        case 'sitemap':
        case 'whoami':
        case 'echo':
        case 'remote-echo':
        case 'recho':
        case 'settings':
        case 'cls':
            command = arg.toLowerCase()
    }
    return command
}

const FORM_HACK = document.createElement('form') // TODO find a better way
const NAV_DEFAULT_OPTIONS = {
    history: 'replace',
    sourceElement: FORM_HACK,
}
function nav(args) {
    const options = Object.assign({
        formData: (() => {
            const fd = new FormData(FORM_HACK)
            fd.append('hideIntro', 'true')
            return fd
        })()
    }, NAV_DEFAULT_OPTIONS)
    let path = ''
    for (const arg of args.slice(1)) {
        if (arg.startsWith('-')) {
            switch (arg.toLowerCase) {
                // case '-r':
                // case '--reload': options.reload = true; break;
                case '-p':
                case '--push':
                    options.history = 'push'
                    break
            }
        } else {
            path = arg
        }
    }

    if (path === '') {
        navigate(window.location.pathname, options)
    } else {
        navigate(parseNavArgument(path), options)
    }
}

function parseNavArgument(path) {
    if (path.startsWith('/')) return path
    let base = window.location.pathname.split('/').filter(s => s)
    for (const segment of path.split('/').filter(s => s)) {
        if (segment === '..') {
            base.pop()
        } else if (segment === '.') {
            continue
        } else {
            base.push(segment)
        }
    }

    return `/${base.join('/')}`
}

function cd(args) {
    const path = parseNavArgument(args[1])
    dispatch(newLocationEvent(path))
    history.replaceState(null, '', path)
}

function _ev(args) {
    const detail = {}, props = args.slice(2).length / 2
    for (let i = 0;i < props;i++) {
        detail[args[2 + 2*i]] = args[3 + 2*i]
    }
    dispatch(new CustomEvent(args[1], {detail}))
}

function sitemap(args) {
    let path = `${window.location.pathname}`
    path += path.endsWith('/') ? 'index' : '/index'

    const lang = document.documentElement.getAttribute('lang')
    const url = `/api/partials/sitemap/${lang}${path}`

    dispatch(newFetchPartialEvent({
        url,
        method: 'get'
    }))
}

const getCookiesSettingHandler = () => {
    const handler = (val) => {
        dispatch(newPrintEvent(t('cmd.settings.cookies.msg.mandatory'))) 
    }
    return handler
}

const getLoggingSettingHandler = () => {
    const handler = (val) => {
        if (typeof val === 'undefined') {
            dispatch(newPrintEvent(t('cmd.settings.logging.msg.available', {opt: JSON.stringify(handler.opt)}))) 
            return
        } 
        if (setLogging(val)) {
            dispatch(newPrintEvent(t('cmd.settings.logging.msg.set', {val})))
        } else {
            dispatch(newErrorMessageEvent(t('cmd.settings.logging.msg.invalid', {val})))
        }
    }
    handler.opt = ['off', 'console']
    return handler
}

const getNavigationToolsSettingHandler = () => {
    const handler = (val) => {
        if (typeof val === 'undefined') {
            dispatch(newPrintEvent(t('cmd.settings.navtools.msg.available', {opt: JSON.stringify(handler.opt)}))) 
            return
        }
        if (setNavTools(val)) {
            dispatch(newPrintEvent(t('cmd.settings.navtools.msg.set', {val})))
        } else {
            dispatch(newErrorMessageEvent(t('cmd.settings.navtools.msg.invalid', {val})))
        }
    }
    handler.opt = [true, false]
    return handler
}

const getForceLanguageSettingHandler = () => {
    const handler = (val) => {
        if (typeof val === 'undefined') {
            dispatch(newPrintEvent(t('cmd.settings.force-language.msg.available', {opt: JSON.stringify(handler.opt)}))) 
            return
        }
        if (setForceLanguage(val)) {
            dispatch(newPrintEvent(t('cmd.settings.force-language.msg.set', {val})))
        } else {
            dispatch(newErrorMessageEvent(t('cmd.settings.force-language.msg.invalid', {val})))
        }
    }
    handler.opt = [true, false]
    return handler
}
const getLanguageSettingHandler = () => {
    const handler = (lang) => {
        if (typeof lang === 'undefined') {
            dispatch(newPrintEvent(t('cmd.settings.language.msg.available', {opt: JSON.stringify(handler.opt)}))) 
            return
        }

        setLanguage(lang).then((r) => {
            switch (r) {
                case true:
                    dispatch(newPrintEvent(t('cmd.settings.language.msg.' + lang)))
                    navigate(localizePath(window.location.pathname, lang), NAV_DEFAULT_OPTIONS)
                    break
                case false:
                    dispatch(newErrorMessageEvent(t('cmd.settings.language.msg.invalid', {lang})))
            }
        }, (e) => {err(e); dispatch(newErrorMessageEvent(t('cmd.settings.language.msg.neterr')))})

    }
    handler.opt = ['en', 'es']
    return handler
}

const getThemeSettingHandler = () => {
    const handler = (v) => {
        if (!v) {
            dispatch(newPrintEvent(t('cmd.settings.theme.msg.available', {opt: JSON.stringify(Object.keys(handler.opt), null, '\t')}))) 
            return
        }
        if (Object.hasOwn(handler.opt, v) && setTheme(handler.opt[v])) {
            dispatch(newPrintEvent(t('cmd.settings.theme.msg.set', {v})))
        } else {
            dispatch(newErrorMessageEvent(t('cmd.settings.theme.msg.invalid', {v})))
        }
    }
    handler.languageSwitchHandler = (_event) => {
        handler.opt = t_obj('cmd.settings.theme.names', {
            "default": "default",
            "default-light": "default-light",
            "default-dark": "default-dark",
            "autumn-dawn": "autumn-dawn",
            "autumn-dusk": "autumn-dusk",    
            "psycho-stark": "psycho-stark",
            "psycho-dark": "psycho-dark",
            "neo-cyan": "neo-cyan",
            "retro-cyan": "retro-cyan",
            "cloudy-salmon": "cloudy-salmon",
            "nightly-lavender": "nightly-lavender",
            "dawnly-lavender": "dawnly-lavender",
            "dainty-elegance": "dainty-elegance",
        })
    }
    handler.languageSwitchHandler()
    eventHandler('tty:lang:switch', handler.languageSwitchHandler, document, 'theme@commands.js')

    return handler
}

let SETTINGS
const settingsLanguageSwitchHandler = (_event) => {
    SETTINGS = t_obj('cmd.settings.names', {
        "theme": getThemeSettingHandler(),
        "language": getLanguageSettingHandler(),
        "nav-tools": getNavigationToolsSettingHandler(),
        "force-language": getForceLanguageSettingHandler(),
        "cookies": getCookiesSettingHandler(),
        "logging": getLoggingSettingHandler(),
    })
}
settingsLanguageSwitchHandler()
eventHandler('tty:lang:switch', settingsLanguageSwitchHandler, document, 'settings@commands.js')

function settings(args) {
    if (args.length === 1) {
        dispatch(newPrintPrefacedEvent(t('cmd.settings.msg.variants.pref'), t('cmd.settings.msg.variants.line')))
        dispatch(newPrintPrefacedEvent(t('cmd.settings.msg.usage.pref'), t('cmd.settings.msg.usage.line')))
        dispatch(newPrintPrefacedEvent(t('cmd.settings.msg.available.pref'), JSON.stringify(Object.keys(SETTINGS))))
        dispatch(newPrintPrefacedEvent(t('cmd.settings.msg.try.pref'), t('cmd.settings.msg.try.line')))
        dispatch(newPrintEvent(''))
        dispatch(newPrintPrefacedEvent(t('cmd.settings.msg.current.pref'), JSON.stringify(getCurrentSettings(), null, '\t')))
        return
    }
    if (args[1].startsWith('-')) {
        const flags = args.filter(a => a.startsWith('-'))
        for (const flag of flags) {
            switch (flag) {
                case '--reload':
                    loadSettings()
                    break
                case '-q':
                case '--quit':
                    return
            }
        }
        args = [args[0], ...args.slice(1 + flags.length)]
    }
    if (Object.hasOwn(SETTINGS, args[1])) {
        SETTINGS[args[1]](args.at(2))
    } else {
        dispatch(newPrintEvent(t('cmd.settings.msg.invalid', {arg: args[1]})))
    }
}

function _silly(args) {
    switch (_silly.count++) {
        case 3: case 4:
            _silly.msg += '.'
            break
        case 5:
            _silly.msg = _silly.msg2
            break
        case 8:
            _silly.msg = _silly.msg3
            break
        case 12:
            _silly.msg = _silly.msg4
            break
        case 17:
            _silly.msg = _silly.msg5
            break
        case 18:
            _silly.count = 18
            navigate(_silly.place)
            return
    }
    dispatch(newPrintEvent(_silly.msg))
}
_silly.place = '/r/toldyou'

const sillyLanguageSwitchHandler = (_event) => {
    _silly.count = 0
    _silly.msg = _silly.msg1 = t('cmd._silly.msg1')
    _silly.msg2 = t('cmd._silly.msg2')
    _silly.msg3 = t('cmd._silly.msg3')
    _silly.msg4 = t('cmd._silly.msg4')
    _silly.msg5 = t('cmd._silly.msg5')
}
sillyLanguageSwitchHandler()
eventHandler('tty:lang:switch', sillyLanguageSwitchHandler, document, "silly@commands.js")

function _cookies(args) {
    if (args.length === 3) {
        setCookie(args[1], args[2], 1/24 /* 1 hour */)
        return
    }
    if (args.length === 2) {
        switch (args[1]) {
            case 'clear':
                for (const cookie of Object.values(COOKIES)) {
                    clearCookie(cookie)
                }
                return
        }
    }
}

let kitties = []
let moreKitties = null
async function fetchCats() {
    if (import.meta.env.DEV) {
        log("Returning fake cats.", 'CATS')
        const bob = `${window.location.origin}/spbob.jpg`
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({cats: [bob,bob,bob]})
            }, 2222)
        })
    }
    return post(window.location.origin+'/api/commands/cat', {amount: 12})
        .catch(e => {
            dispatch(newEndLoadEvent())
			dispatch(newShowInputEvent())
            dispatch(newErrorMessageEvent(t('cmd.cat.msg.err')))
            return {cats: []}
        })
}

async function catImg() {
    if (kitties.length === 2 && moreKitties === null) {
        log("Prefetching.", 'CATS')
        moreKitties = fetchCats().then((r) => {
            dispatch(newPrepareCatImgEvent(r.cats))
            return r
        })
    }
    if (kitties.length > 0) {
        dispatch(newEndLoadEvent())
			dispatch(newShowInputEvent())
        dispatch(newCatImgEvent(kitties.pop()))
    } else {
        let onDemand = false
        if (!(moreKitties && 'then' in moreKitties && typeof moreKitties.then === 'function')) {
            onDemand = true
            log(`Fetching on-demand litter.`, 'CATS')
            moreKitties = fetchCats().then((r) => {
                dispatch(newPrepareCatImgEvent(r.cats))
                return r
            })
        } 
        dispatch(newHideInputEvent())
        dispatch(newStartLoadEvent(), { context: "Awaiting cat images." })
        kitties = (await moreKitties).cats
        moreKitties = null
        if (kitties.length > 0) {
            if (onDemand) {
                setTimeout(catImg, 222) // give newPrepareCatImgEvent some time to pre-render.
            } else {
                catImg()
            }
        } 
    }
}

function cat(args) {
    if (args.length === 1) {
        catImg()
        return
    }
    dispatch(newPrintEvent(t("cmd.cat.msg.no_impl")))
}

function cls(args) {
    dispatch(newClsEvent())
}

function ls(args) {
    let path = window.location.pathname
    path += path.endsWith('/') ? 'index' : '/index' 
    get(window.location.origin + `/api/static/sitemap${path}.sitemap.json`)
        .then(
            (r) => dispatch(newPrintLsEvent(r)), 
            e => {
                dispatch(newErrorMessageEvent(t('cmd.ls.msg.err')))
                dispatch(newPrintPrefacedEvent('Tip: ',t('cmd.ls.msg.tip')))
            }
        )
}

function whoami(args) {
    dispatch(newPrintEvent(t('cmd.whoami.msg.fake')))
}