import { err } from "./log"

export {
    t,
    t_obj
}

/**
 * Resolve the localized version of a string using key, optionally
 * replacing any !{placeholder_name} with args[placeholder_name]. 
 * The placeholder sequence can be escaped with '!{_}',
 * which is replaced by '!{' (removing the underscore and closing bracket).
 */
function t(key, args) {
    if (typeof key !== 'string') {
        err(`Invalid key: ${JSON.stringify(key)}.`)
        return ''
    }
    let _lang = window._jbazann.lang
    for (const k of key.split('.')) {
        if (Object.hasOwn(_lang, k)) {
            _lang = _lang[k]
        } else {
            err(`${k} not found in ${JSON.stringify(_lang)}.`)
            return ''
        }   
    }
    if (typeof _lang !== 'string') {
        err(`${key} did not resolve to a string, it was instead: ${JSON.stringify(_lang)}`)
        return ''
    }
    if (args) _lang = resolve(_lang, args)
    return _lang
}

/**
 * Resolve the localized versions of an object's keys, following
 * the same rules as {@link t}. This method requires an init object,
 * from which the property names will be replaced with the ones found
 * in the provided key, falling back to the init object's property names
 * when needed.
 */
function t_obj(key, init) {
    if (typeof key !== 'string') {
        err(`Invalid key: ${JSON.stringify(key)}.`)
        return ''
    }
    let _lang = window._jbazann.lang
    for (const k of key.split('.')) {
        if (Object.hasOwn(_lang, k)) {
            _lang = _lang[k]
        } else {
            err(`${k} not found in ${JSON.stringify(_lang)}.`)
            return ''
        }   
    }
    const obj = {}
    for (const [prop, val] of Object.entries(init)) {
        if (Object.hasOwn(_lang, prop)) {
            obj[_lang[prop]] = val 
        } else {
            dev(`${k} not found in ${JSON.stringify(_lang)}, falling back to init's property name.`, 'TRANSLATE OBJECT')
            obj[prop] = val
        }
    }
    return obj
}

function resolve(template,args) {
    return template.replaceAll(/!{(\w+)}/g, (_, key) => {
        if (key === '_') return '!{'
        return args[key] ?? `!{${key}}`
    })
}