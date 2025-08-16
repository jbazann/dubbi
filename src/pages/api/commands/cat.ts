import type {APIRoute} from "astro";

export {
    POST
}

const bucket_keys = {
    cat_metrics: 'cat_metrics',
    Aoperations: 'a_operations', // TODO use these
    Boperations: 'b_operations'
}

type RequestBody = {
    amount: number
}

type Metrics = {
    cat_amount: number
    cat_size: number
}

type ResponseBody = {
    cats: string[]
}

const error = Symbol('error')

const POST: APIRoute = async (context) => {
    let metrics: Metrics | undefined = await context.locals.runtime.env.CATS
        .get(bucket_keys.cat_metrics)
        .then(r2o => r2o?.json())
    if (!metrics) {
        console.log("Metrics not found.", bucket_keys.cat_metrics, metrics)
        return new Response(null, { status: 500 })
    }

    const [body, e] = await (context.request.json() as Promise<RequestBody>)
        .then(b => [b, null], (e) => { console.log(e); return [null, error] }
    ) as [RequestBody, Symbol | null]
    if (e === error) return new Response(null, { status: 400 })

    let amount = (typeof body.amount === 'number' && body.amount > 0 && body.amount <= 20) 
        ? body.amount
        : 12

    const ids = Array.from({ length: amount },
        () => Math.floor(Math.random() * metrics.cat_amount));

    const headers = new Headers()
    headers.set('Content-Type','application/json')

    const response: ResponseBody = {
        cats: await Promise.all(ids.map(
            ((id) =>  context.locals.runtime.env.CATS.get(id.toString()).then(r2o => r2o?.text() ?? ''))
        )).then(arr => arr.filter(s => s))
    }

    return new Response(JSON.stringify(response), { headers })
}