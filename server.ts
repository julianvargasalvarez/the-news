import {serve} from "https://deno.land/std@0.119.0/http/server.ts"

// In-memory database
const database = [];

async function HomeController(request: Request): Promise<Response> {
  // Index
  if(request.method == "GET") {
      console.log(`Served by HomeController#index`)

      return new Response(`
        Esta es nuesta aplicacion web basada en texto.

        Para listar los posteos que tenemos en la aplicacion porfa usar el siguiente menu de navegacion:
          * Home: GET /
          * News: GET /news
                  POST /news
      `, {
        status: 200,
        headers: {"content-type": "text/plain; charset=utf-8"}
      })

  } else {
      console.log(`Served by HomeController not found`)

      return new Response(`POST para el Home no existe`, {
        status: 404,
        headers: {"content-type": "text/plan; charset=utf-8"}
      })
  }
}

async function NewsController(_req: Request): Promise<Response> {
  // Index
  if(_req.method == "GET") {
      console.log(`Served by NewsController#index`)

      // Query to the database
      let allArticles: string[] = database.map(article => `* ${article}\n`)

      return new Response(`
      ${allArticles}
      `, {
        status: 200,
        headers: {"content-type": "text/plain; charset=utf-8"}
      })
  }

  // Create
  else if (_req.method == "POST") {
      console.log(`Served by NewsController#create`)
      // Creates a new post in the news board
      let postContent: string = await _req.text()
      database.push(postContent);
      return new Response('', {
        status: 301,
        headers: {"content-type": "text/plain; charset=utf-8", "Location": "/news"}
      })

  } else {
      console.log(`Served by NewsController#create`)

      return new Response(`POST para el Home no existe`, {
        status: 404,
        headers: {"content-type": "text/plain; charset=utf-8"}
      })
  }
}

async function middleware(_req: Request): Promise<Response> {
  const url = new URL(_req.url);

  console.log(`Request received for ${url.pathname}`)

  switch(url.pathname) {
    case '/':
      return HomeController(_req)
      break;
    case '/news':
      return NewsController(_req)
      break;
    default:
      return new Response(`Osea porfa revise porque '${url.path}' no existe`, {
        status: 404,
        headers: {"content-type": "application/json; charset=utf-8"}
      })
  }
}

console.log('Listening on http://localhost:8000')
serve(middleware)
