import vueJsx from '@vitejs/plugin-vue-jsx'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import esbuild, { minify as minifyPlugin } from 'rollup-plugin-esbuild'
import commonjs from '@rollup/plugin-commonjs'
import { rollup } from 'rollup'
import path from 'path'
import VueMacros from 'unplugin-vue-macros/vite'
import vue from '@vitejs/plugin-vue'

function writeBundles(bundle, options) {
  return Promise.all(options.map((option) => bundle.write(option)))
}

function formatBundleFilename(
  name,
  minify,
  ext
) {
  return `${name}${minify ? '.min' : ''}.${ext}`
}
const fyvueRoot = './src/'
const fyvueOutput = './dist/'
const banner = `/*! fyvue */\n`
const target = 'es6'

const generateExternal = (dependencies) => {
  return (id) => {
    return [...new Set(dependencies)].some(
      (pkg) => id === pkg || id.startsWith(`${pkg}/`)
    )
  }
}
async function buildFullEntry(minify) {
  const plugins = [
    VueMacros({
      setupComponent: false,
      setupSFC: false,
      plugins: {
        vue: vue({
          isProduction: true,
        }),
        vueJsx: vueJsx(),
      },
    }),
    nodeResolve({
      extensions: ['.mjs', '.js', '.json', '.ts'],
    }),
    commonjs(),
    esbuild({
      exclude: [],
      sourceMap: minify,
      target,
      loaders: {
        '.vue': 'ts',
      },
      define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
      },
      treeShaking: true,
      legalComments: 'eof',
    }),
  ]
  if (minify) {
    plugins.push(
      minifyPlugin({
        target,
        sourceMap: true,
      })
    )
  }
  const bundle = await rollup({
    input: path.resolve(fyvueRoot, 'index.js'),
    plugins,
    external: generateExternal(["karpeleslab/klbfw", "@vuelidate/core", "@vuelidate/validators", "@vueuse/head", "i18next", "i18next-vue", "mitt", "notiwind", "vue", "vue3-clipboard", "vuex"]),
    treeshake: true,
  })
  await writeBundles(bundle, [
    {
      format: 'umd',
      file: path.resolve(
        fyvueOutput,
        'dist',
        formatBundleFilename('index', minify, 'js')
      ),
      exports: 'named',
      name: "fyvue",
      globals: {
        vue: 'Vue',
      },
      sourcemap: minify,
      banner,
    },
    {
      format: 'esm',
      file: path.resolve(
        fyvueOutput,
        'dist',
        formatBundleFilename('index', minify, 'mjs')
      ),
      sourcemap: minify,
      banner,
    },
  ])
}

Promise.all([buildFullEntry(false)])
