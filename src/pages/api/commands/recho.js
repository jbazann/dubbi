export const prerender = false

export async function POST({ request }) {
    const txt = await request.text()
    return new Response(txt, {
        headers: {
            'Content-Type': 'application/text'
        }
    })
}