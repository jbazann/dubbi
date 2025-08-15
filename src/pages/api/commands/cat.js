export async function POST({ request }) {
    return new Response("CAT", {
        headers: {
            'Content-Type': 'application/text'
        }
    })
}