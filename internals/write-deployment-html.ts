import fs from 'fs'
import path from 'path'

interface Config {
  name: string
  repository: string
  branch: string
  urls: string[]
}
function required(propertyName: string): never {
  throw new Error(`Missing '${propertyName}' on given json`)
}

function run({
  urls = required('urls'),
  name = required('name'),
  repository = required('repository'),
  branch = required('branch'),
}: Config) {
  const html = `
<html>
  <head>
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/1.1.4/tailwind.css"
    />
    <link
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"
    />
    <style>
      .im {
        font-family: 'Material Icons';
        font-weight: normal;
        font-style: normal;
        font-size: inherit;
        display: inline-block;
        line-height: inherit;
        vertical-align: top;
        text-transform: none;
        letter-spacing: normal;
        word-wrap: normal;
        white-space: nowrap;
        direction: ltr;
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
        -moz-osx-font-smoothing: grayscale;
        font-feature-settings: 'liga';
      }
    </style>
  </head>
  <body>
    <div class="pt-10 shadow relative px-2">
      <div class="max-w-xl mx-auto">
        <span class="text-orange-600">${name}</span>
        <h1 class="text-3xl font-bold mb-3">Deployments</h1>
        <div class="py-3 flex -mx-2">
          <div class="w-1/3 px-2">
            <a
              target="__blank"
              href="${`https://github.com/atados/${repository}/tree/${branch}`}"
              class="text-center block px-3 py-2 rounded font-medium bg-gray-200 hover:bg-gray-300"
            >
              <div class="relative block truncate pl-6">
                <img
                  src="https://cdn.brandicons.org/icons/github.svg"
                  class="inline-block h-4 align-middle absolute left-0 top-0 bottom-0 my-auto"
                  alt="GitHub"
                />
                ${branch}
              </div>
            </a>
          </div>
          <div class="w-1/3 px-2">
            <a
              target="__blank"
              href="${`https://zeit.co/atados/${name.toLowerCase()}`}"
              class="text-center block px-3 py-2 rounded font-medium bg-gray-200 hover:bg-gray-300"
            >
              <div class="relative block truncate pl-6">
                <svg
                  viewBox="0 0 226 200"
                  aria-label="zeit"
                  class="inline-block h-4 align-middle absolute left-0 top-0 bottom-0 my-auto"
                >
                  <defs>
                    <linearGradient
                      x1="196.572%"
                      y1="228.815%"
                      x2="50%"
                      y2="50%"
                      id="logo-1"
                    >
                      <stop
                        offset="0%"
                        stop-color="var(--geist-background)"
                      ></stop>
                      <stop
                        offset="100%"
                        stop-color="var(--geist-foreground)"
                      ></stop>
                    </linearGradient>
                  </defs>
                  <path
                    fill="url(#logo-1)"
                    d="M254 156.46L367 356H141z"
                    transform="translate(-141 -156)"
                  ></path>
                </svg>
                Default
              </div>
            </a>
          </div>
          <div class="w-1/3 px-2">
            <a
              target="__blank"
              href="${urls[urls.length - 1]}"
              class="text-center block px-3 py-2 rounded font-medium bg-blue-500 hover:bg-blue-600 text-white"
            >
              Visit
              <span class="im">open_in_new</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="max-w-xl mx-auto py-5 px-2">
      <h2 class="text-gray-700 font-medium text-sm mb-3">DEPLOYMENT URLs</h2>
      <ul>${urls
        .map(
          url => `
        <li>
          <a
            target="__blank"
            href="${url}"
            class="py-1 px-2 bg-gray-200 text-blue-700 mb-2 text-lg block hover:bg-blue-300 hover:text-blue-800"
          >
            ${url}
          </a>
        </li>
      `,
        )
        .join('\n')}</ul>
    </div>
  </body>
</html>
`
  return fs.writeFileSync(path.resolve('DEPLOYMENT.html'), html, 'utf8')
}

const json = JSON.parse(process.argv[process.argv.length - 1])
run(json)
