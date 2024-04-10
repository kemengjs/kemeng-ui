import { defineConfig } from 'rollup'
import path from 'node:path'
import url from 'node:url'
import typescript from '@rollup/plugin-typescript'
import babel from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { componentsPlugin } from './plugin/index.mjs'
// import { terser } from 'rollup-plugin-terser'
import dts from 'rollup-plugin-dts'

const baseSource = path.resolve(
	path.dirname(url.fileURLToPath(import.meta.url))
)
const resolve = p => path.resolve(baseSource, p)

const packageNameArr = (process.env.npm_package_name || '').split('/')
const packageName = packageNameArr[packageNameArr.length - 1]
console.log('process.env', process.cwd())
const appRootPath = process.cwd()

const commonPlugins = [
	componentsPlugin(),
	nodeResolve(),
	commonjs(),
	typescript({
		tsconfig: resolve('../../tsconfig.json'),
		// tsBuildInfoFile: path.join(appRootPath, './dist/tsconfig.tsbuildinfo'),
		cacheDir: './node_modules/.rollup.tscache',
		rootDir: appRootPath,
		outputToFilesystem: true
		// declaration: true
	}),
	babel({
		babelHelpers: 'bundled',
		extensions: ['.js', '.jsx', '.ts', '.tsx'],
		exclude: '**/node_modules/**'
	})
]

const baseConfig = {
	external: [/react/]
}

export default defineConfig([
	{
		...baseConfig,
		output: [
			{
				// file: `dist/${packageName}.mjs`,
				dir: 'dist',
				format: 'esm',
				entryFileNames: '[name].mjs'
			},
			{
				// file: `dist/${packageName}.cjs`,
				dir: 'dist',
				format: 'cjs',
				entryFileNames: '[name].cjs'
			}
		],
		plugins: [
			...commonPlugins
			// terser()
		]
	},
	{
		...baseConfig,
		output: [
			{
				// file: `dist/${packageName}.mjs`,
				dir: 'dist',
				format: 'esm',
				entryFileNames: '[name].d.ts'
			}
		],
		plugins: [
			...commonPlugins,
			dts({
				tsconfig: resolve('../../tsconfig.json')
			})
			// terser()
		]
	}
])
