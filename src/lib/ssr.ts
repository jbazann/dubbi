import COOKIES from "./cookies.json"

export {
    getLocale,
    translatePath
}

function getLocale(request: Request, acceptLanguage?: string, flags?: {unset?: boolean}) {
    const cookies = looselyParseCookies(request)
    if (Object.hasOwn(cookies, COOKIES.language)) {
        switch (cookies[COOKIES.language]) {
            case 'en': 
            case 'es': 
                return cookies[COOKIES.language]
            default: return 'en'
        }
    }
    switch (acceptLanguage) {
        case 'en': 
        case 'es':
            return acceptLanguage
    }
    if (typeof flags === 'object') flags.unset = true
    return 'en'
}

function looselyParseCookies(request: Request) {
    return (request.headers.get('Cookie') ?? '') 
        .split(";")
        .map(str => str.split("=", 2))
        .reduce((acc: {[_: string]: string}, curr) => {
            acc[curr[0]?.trim() ?? ''] = curr[1]?.trim()
            return acc;
        }, {})
}

function stripLocale(path: string) {
    if (path.startsWith('/es')) path = path.slice(3)
    if (!path.startsWith('/')) path = `/${path}`
    return path
}

// This is a stinky solution but, realistically, making it better is a much worse engineering choice
const localeMap: {[_:string]: {[_:number]: {[_:string]: string | undefined} | undefined} | undefined} = {
    es: {
        // Each language needs to map all the other languages to its version of the path segment.
        // Number indexes are the segment's expected depth into the path.
        0: {
            "projects": "proyectos",
            "about": "acerca",
            "gallery": "galeria"
        }
    },
    en: {
        0: {
            "proyectos": "projects",
            "acerca": "about",
            "galeria": "gallery"
        }
    }
}
/**
 * Converts a path already stripped of its locale to the equivalent in a different locale, also stripped of said locale.
 * Each segment is potentially mapped to a translated version, 
 * keeping the original segment if a translated version isn't found.
 * The usage pattern is as follows:
 * - Client requests '/es/proyectos', but should be redirected to the english locale.
 * - Middleware trims '/es' from the path, and calls translatePath('/proyectos').
 * - This function splits the path into segments, then attempts to translate each one independently of the others.
 * - The result is the original path without a locale, with any segment for which a translated version was found, replaced by said translation.
 * - Middleware prepends the new locale path, if any (currently not the case for the example, '/projects' is the final path).
 */
function translatePath(path: string, targetLocale: string) {
    if (!Object.hasOwn(localeMap, targetLocale)) return path
    const lang = localeMap[targetLocale] || {}
    let depth = 0, newPath = '', last = ''
    for (const segment of path.split('/').filter(s => s)) {
        if (Object.hasOwn(lang[depth] || {},segment)) {
            last = lang[depth++]![segment] || segment
        } else {
            last = segment
        }
        newPath = `${newPath}/${last}`
    }
    return newPath
}