import { defineMiddleware, sequence } from "astro:middleware";
import { middleware, getPathByLocale } from "astro:i18n"; 
import COOKIES from '@lib/cookies.json'
import { getLocale, translatePath,  localizePath  } from "@lib/ssr";

export const cookiesMiddleware = defineMiddleware(async (ctx, next) => {
    if (ctx.url.pathname.startsWith('/api')) return next()

    let forceLanguage = ctx.cookies.get(COOKIES["force-language"])?.value
    const path = ctx.url.pathname
    // console.log({forceLanguage, path}, "MIDDLEWARE")

    if (forceLanguage !== 'true' && typeof forceLanguage !== 'undefined') {
        return next()
    }

    const flags = { unset: false }
    
    const lang = getLocale(ctx.request, ctx.preferredLocale, flags)
    // console.log({lang,flags, ctx.preferredLocale}, "MIDDLEWARE")

    if (flags.unset) return next()
    if (ctx.currentLocale === lang) return next()
    
    let translatedPath
    if (ctx.currentLocale !== 'en') {
        const currentLocalePath = getPathByLocale(ctx.currentLocale)
        // TODO do this again but better
        translatedPath = translatePath(path.slice(currentLocalePath.length + 1), lang)
    } else {
        translatedPath = translatePath(path, lang)
    }

    const redirectPath = localizePath(translatedPath,lang)
    // console.log({path, translatedPath, redirectPath}, "MIDDLEWARE")

    const headers = new Headers()
    headers.append('Location', redirectPath)
    headers.append('Cache-Control', 'no-store')
    headers.append('Set-Cookie', `${COOKIES['redirect-notice']}=force-language; Path=/; Max-Age=22`)
    headers.append('Set-Cookie', `${COOKIES['redirect-from']}=${path}; Path=/; Max-Age=22`)
    headers.append('Set-Cookie', `${COOKIES['redirect-to']}=${redirectPath}; Path=/; Max-Age=22`)
    return new Response(null, {status: 307, headers})
})

export const onRequest = sequence(
    cookiesMiddleware,
    middleware({
        redirectToDefaultLocale: false,
        prefixDefaultLocale: false,
        fallbackType: 'redirect'
    })
)