import { err, log } from "./log"

export {
    get,
    post
}

const netlog = false // TODO externalize

class RequestBuilder {
    #baseUrl = ''
    #path = ''
    #params = ''
    #opt = {
        mode: 'cors'
    }
    #then = [
        {
            then: logHeaders
        },
        {
            then: async (r) => {
                return r.ok ?
                    (r.headers.get('Content-Type') === 'application/json' ?
                        logBody(await r.json()) :
                        logBody(await r.text())) :
                    await neterr(r)
            }
        },
        {
            catch: (e) => {err(e); throw e}
        }
    ]

    constructor(baseUrl) {
        this.#baseUrl = baseUrl
    }

    opt(opt, clear = false) {
        if (clear) {
            this.#opt = opt
        } else {
            Object.assign(this.#opt, opt)
        } 
        return this
    }

    params(params, clear = false) {
        if (clear) {
            this.#params = params
        } else {
            Object.assign(this.#params, params)
        }
        return this
    }

    then(then, catch_, clear = false) {
        if (clear) this.#then = []
        this.#then.push({then: then, catch: catch_})
        return this
    }

    async run() {
        const url = new URL(this.#path, this.#baseUrl)
        for (const param of this.#params) {
            url.searchParams.set(param, this.#params[param])
        }
        let p = fetch(url, this.#opt)
        for (const step of this.#then) {
            p = p.then(step.then, step.catch)
        }
        return await p
    }
}

async function logHeaders(r) {
    let headers = {}
    for (const [key, value] of r.headers.entries()) {
        headers[key] = value
    }
    netlog && log(headers, 'NET — HEADERS')
    return r
}

async function logBody(body) {
    netlog && log(body, 'NET — BODY')
    return body
}

async function neterr(r) {
    log(r, 'NET — ERR')
    throw {msg: 'A RequestBuilder\'s default chain received an empty or unexpected response.', response: await r.text()}
}

async function get(url, params = {}, headers = {}) {
    return await new RequestBuilder(url)
        .opt({method: 'GET', headers})
        .params(params)
        .run()
}

async function post(url, body, params = {}, headers = {}) {
    if (typeof body === 'object') body = JSON.stringify(body)
    return await new RequestBuilder(url)
        .opt({method: 'POST', body, headers})
        .params(params)
        .run()
}