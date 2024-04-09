import { defineConfig } from 'rollup'
import path from 'node:path'
import url from 'node:url'
import typescript from '@rollup/plugin-typescript'
import babel from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
// import { terser } from 'rollup-plugin-terser'

const baseSource = path.resolve(
	path.dirname(url.fileURLToPath(import.meta.url))
)
const resolve = p => path.resolve(baseSource, p)

const packageNameArr = (process.env.npm_package_name || '').split('/')
const packageName = packageNameArr[packageNameArr.length - 1]
console.log('process.env', process.cwd())
const appRootPath = process.cwd()

export default defineConfig({
	input: path.join(process.cwd(), 'index.ts'),
	// external: ['react', 'react-dom', 'react-dom/client', '**/node_modules/**'],
	external: [/node_modules/],

	output: [
		{
			file: `dist/${packageName}.mjs`,
			format: 'esm'
		},
		{
			file: `dist/${packageName}.cjs`,
			format: 'cjs'
		},
		{
			file: `dist/${packageName}.js`,
			name: packageName,
			format: 'umd'
		}
	],
	plugins: [
		nodeResolve(),
		babel({
			babelHelpers: 'bundled',
			extensions: ['.js', '.jsx', '.ts', '.tsx'],
			exclude: '**/node_modules/**',
			presets: ['@babel/preset-env']
		}),
		commonjs(),
		typescript({
			tsconfig: resolve('../../tsconfig.json'),
			outDir: './dist/types',
			tsBuildInfoFile: path.join(appRootPath, './dist/tsconfig.tsbuildinfo'),
			cacheDir: './node_modules/.rollup.tscache',
			rootDir: appRootPath,
			outputToFilesystem: true
		})
		// terser()
	]
})
