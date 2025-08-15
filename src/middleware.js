import { defineMiddleware, sequence } from "astro:middleware";
import { middleware, getPathByLocale } from "astro:i18n"; 
import COOKIES from '@lib/cookies.json'
import { log } from "@lib/log";
import { getLocale, translatePath } from "@lib/ssr";
import { localizePath } from "@lib/util";

export const cookiesMiddleware = defineMiddleware(async (ctx, next) => {
    if (ctx.url.pathname.startsWith('/api')) return next()

    const forceLanguage = ctx.cookies.get(COOKIES["force-language"])?.value
    const path = ctx.url.pathname
    log({forceLanguage, path}, "MIDDLEWARE")

    if (forceLanguage !== 'true') {
        return next()
    }

    const flags = { unset: false }
    const lang = getLocale(ctx.request, ctx.request.headers.get('Accept-Language'), flags)
    log({lang,flags}, "MIDDLEWARE")

    if (flags.unset) return next()
    if (ctx.currentLocale === lang) return next()
    
    let translatedPath
    if (ctx.currentLocale !== 'en') {
        const currentLocalePath = getPathByLocale(ctx.currentLocale)
        translatedPath = translatePath(path.slice(currentLocalePath.length), lang)
    } else {
        translatedPath = translatePath(path, lang)
    }

    const redirectPath = localizePath(translatedPath,lang)
    log({path, translatedPath, redirectPath}, "MIDDLEWARE")

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