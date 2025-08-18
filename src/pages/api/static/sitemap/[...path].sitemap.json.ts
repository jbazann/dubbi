import type { APIRoute } from "astro";
export const prerender = true

export const paths = [
    'index',
    'projects/index',
    'about/index',
    'gallery/index',
    'gallery/early-drafts/index',
    'gallery/early-drafts/muse/index',
    'gallery/early-drafts/reality/index',
    'gallery/early-drafts/the-end-of-i/index',
    'gallery/early-drafts/the-old-man-and-death/index',
    'gallery/early-drafts/pretty-little-lady/index',
    'projects/skwidl/index',
    'projects/sbupi/index',
    'projects/dubbi/index',
    'es/index',
    'es/proyectos/index',
    'es/acerca/index',
    'es/galeria/index',
    'es/galeria/early-drafts/index',
    'es/galeria/early-drafts/muse/index',
    'es/galeria/early-drafts/reality/index',
    'es/galeria/early-drafts/the-end-of-i/index',
    'es/galeria/early-drafts/the-old-man-and-death/index',
    'es/galeria/early-drafts/pretty-little-lady/index',
    'es/proyectos/sbupi/index',
    'es/proyectos/skwidl/index',
    'es/proyectos/dubbi/index',
]

const candidates = Object.keys(import.meta.glob([
    '/src/pages/**/*.astro', 
    '!/src/pages/**/[[]...path].astro', 
    '!/src/pages/robots.txt.ts', 
    '!/src/pages/api/**'
]))

export const GET: APIRoute = async ({ params }) => {
    let path = params.path as string
    path = Array.isArray(path) ? path.join('/') : path     
    path = path.endsWith('index') ? path.replace('index', '') : path 

    const map = candidates.map(v => v.slice(v.indexOf('/pages/') + 7 /*/pages/.length*/))
        .filter(v => v.startsWith(path))
        .filter(v => v.slice(path.length).match('^/?[^/]*$') !== null)
        .map(v => v.replace('.astro',''))
        .map(v => v.endsWith('index') ? '' : v.replace(path, ''))
        .filter(v => v)

    return new Response(JSON.stringify(map), {
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export const getStaticPaths = () => {
    return paths.map(p => ({ params: {path: p}}))
}