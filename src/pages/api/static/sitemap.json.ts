import type { APIRoute } from "astro"

export const prerender = true

export const getStaticPaths = () => {
  return [
    { params: { lang: 'es' } },
    { params: { lang: 'en' } },
  ]
}

export const GET: APIRoute = ({ params, request }) => {
  return new Response(
    JSON.stringify({
      path: new URL(request.url).pathname,
    }),
  )
}

const projects = {
  sbupi: {

  },
  skwidl: {

  },
  dubbi: {

  }
}

const proyectos = {
  sbupi: {

  },
  skwidl: {

  },
  dubbi: {

  }
}

const about = {

}

const acerca = {

}

const gallery = {
  the_old_man_and_death: {

  },
  pretty_little_lady: {

  }
}

const galeria = {

}


const es = {
  proyectos
}

const en = {
  projects
}


