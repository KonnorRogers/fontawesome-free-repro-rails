const esbuild = require('esbuild')
const process = require("process")
const path = require("path")
/** @type Record<string, string> */
const entryPoints = { "application": path.join("app", "javascript", "application.js")}

const watchMode = Boolean(process.argv.includes('--watch'))


/** @type {() => import("esbuild").Plugin} */
const FontAwesomeFontLoader = () => {
  return {
    name: "font-awesome-font-loader",
    setup: (build) => {
      // Uncomment for proper loading
      // build.onResolve({ filter: /@fortawesome\/fontawesome-free\/(webfonts|css)/ }, async (args) => {
      //   return {
      //     path: args.path,
      //     // Mark external and make sure to add node_modules to AssetPipeline.
      //     external: true,
      //   }
      // })
    }
  }
}

esbuild
  .build({
    entryPoints,
    format: 'iife',
    metafile: true,
    bundle: true,
    sourcemap: true,
    outdir: path.join(process.cwd(), 'app', 'assets', 'builds'),
    outbase: 'app/javascript',
    plugins: [FontAwesomeFontLoader()],
    watch: watchMode
      ? {
          onRebuild(error, result) {
            if (error) console.error('watch build failed:', error)
            else {
              const report = buildReport(result)
              console.log('watch build succeeded => \n', report)
            }
          },
        }
      : false,
    publicPath: "/assets",
    entryNames: '[dir]/[name]',
    chunkNames: 'chunks/[dir]/[name]',
    assetNames: 'media/[dir]/[name]',
    loader: {
      '.jpg': 'file',
      '.jpeg': 'file',
      '.png': 'file',
      '.gif': 'file',
      '.svg': 'file',
      '.tiff': 'file',
      '.ico': 'file',
      '.eot': 'file',
      '.otf': 'file',
      '.ttf': 'file',
      '.woff': 'file',
      '.woff2': 'file',
    },
    resolveExtensions: [
      '.jsx',
      '.erb',
      '.mjs',
      '.js',
      '.sass',
      '.scss',
      '.css',
      '.module.sass',
      '.module.scss',
      '.module.css',
    ],
    target: 'es6',
  })
  .then((result) => {
    console.log('Finished Compilation => \n')
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
