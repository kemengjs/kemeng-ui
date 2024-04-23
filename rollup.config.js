import { defineConfig } from 'rollup'
import path from 'node:path'
import url from 'node:url'
import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
// import { terser } from 'rollup-plugin-terser'

const baseSource = path.resolve(
	path.dirname(url.fileURLToPath(import.meta.url))
)
const resolve = p => path.resolve(baseSource, p)

const packageNameArr = (process.env.npm_package_name || '').split('/')
const packageName = packageNameArr[packageNameArr.length - 1]
console.log('process.env', process.cwd())
console.log('packageNameArr', packageName, resolve('./tsconfig.json'))
const appRootPath = process.cwd()

export default defineConfig({
	input: path.join(appRootPath, 'index.ts'),
	external: [/node_modules/],

	output: [
		{
			file: `dist/${packageName}.mjs`,
			format: 'esm'
		},
		{
			file: `dist/${packageName}.cjs`,
			format: 'cjs'
		}
	],

	plugins: [
		nodeResolve(),
		typescript({
			tsconfig: resolve('./tsconfig.json'),
			outDir: './dist/types',
			// tsBuildInfoFile: path.join(appRootPath, './dist/tsconfig.tsbuildinfo'),
			cacheDir: './node_modules/.rollup.tscache',
			rootDir: appRootPath,
			outputToFilesystem: true,
			declaration: true
		})
		// terser()
	]
})
