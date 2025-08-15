import type { APIRoute } from "astro";
import en from '@lib/lang/en'
import es from '@lib/lang/es'

export const prerender = true

const langs: {[_: string]: {}} = {
    en, es
}

export const GET: APIRoute = async ({ params }) => {
    switch (params.lang) {
        case 'en':
        case 'es':
            return new Response(JSON.stringify(langs[params.lang]), {
                headers: {
                    "Content-Type": "application/json"
                }
            })
    }
    return new Response(null, {status: 404})
}

export const getStaticPaths = () => {
  return [
    { params: { lang: 'es' } },
    { params: { lang: 'en' } },
  ]
}