import {
	OutputOptions,
	Plugin,
	RollupBuild,
	RollupOptions,
	RollupWatcherEvent,
	rollup,
	watch
} from 'rollup'
import path from 'node:path'
import fs from 'node:fs'
import colors from 'picocolors'
import { appRootPath, log, resolve, targetName } from '../utils/utils'
import typescript from '@rollup/plugin-typescript'
import babel from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import dts from 'rollup-plugin-dts'
import alias from '@rollup/plugin-alias'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

// rollup 相关参数
const componentsDirPath = 'components'
const entry = 'index.ts'
const componentsNameArr = fs.readdirSync(resolve(componentsDirPath))
const componentsEntryMap = componentsNameArr.reduce((prev, cur) => {
	prev[`components/${cur}/index`] = resolve(
		path.join(componentsDirPath, cur, `index.ts`)
	)
	return prev
}, {})

const commonPlugins = [
	peerDepsExternal() as unknown as Plugin,
	alias({
		entries: [
			{
				find: '@ui',
				replacement: appRootPath
			}
		]
	}),
	nodeResolve(),
	commonjs(),
	typescript({
		tsconfig: resolve('../../tsconfig.json')
		// rootDir: appRootPath,
		// outputToFilesystem: true,
		// declaration: true,
		// include: ['components/**/*.ts', 'components/**/*.tsx'],
		// exclude: ['**/dist/**', '**/internal/**'],
		// outDir: './dist'
	}),
	babel({
		babelHelpers: 'bundled',
		extensions: ['.js', '.jsx', '.ts', '.tsx'],
		exclude: '**/node_modules/**'
	})
]

export const baseConfig: RollupOptions = {
	input: {
		index: entry,
		...componentsEntryMap
	},
	external: [/node_modules/]
}

const inputOption = {
	...baseConfig,
	plugins: commonPlugins
}

const outputMap: Record<string, OutputOptions | OutputOptions[]> = {
	dts: {
		dir: targetName,
		format: 'esm',
		entryFileNames: '[name].d.ts',
		preserveModules: true,
		preserveModulesRoot: appRootPath
	},
	bundle: [
		{
			dir: targetName,
			format: 'esm',
			entryFileNames: '[name].mjs',
			preserveModules: true,
			preserveModulesRoot: appRootPath
		},
		{
			dir: targetName,
			format: 'cjs',
			entryFileNames: '[name].cjs',
			exports: 'named',
			preserveModules: true,
			preserveModulesRoot: appRootPath
		}
	]
}

export const runRollupBuildBundle = async () => {
	Object.keys(baseConfig.input).forEach(name => {
		log(`Compiling '${colors.cyan(name)}' with rollup ...`)
	})

	const bundle = await rollup(inputOption)
	await Promise.all(
		(outputMap.bundle as OutputOptions[]).map(item => {
			return bundle.write(item)
		})
	)
	bundle.close()
}

// --watch
export const bundleWatch = () => {
	const watcher = watch({
		...inputOption,
		output: outputMap.bundle
	})

	watcher.on('event', (event: RollupWatcherEvent) => {
		const { result } = event as { result: RollupBuild }

		if (result) {
			result.close()
			log('watching bundle complete~')
		}
	})

	// const watcherDts = watch({
	// 	...inputOption,
	// 	plugins: [
	// 		...inputOption.plugins,
	// 		dts({
	// 			tsconfig: resolve('../../tsconfig.json')
	// 		})
	// 	],
	// 	output: outputMap.dts
	// })

	// watcherDts.on('event', (event: RollupWatcherEvent) => {
	// 	const { result } = event as { result: RollupBuild }

	// 	if (result) {
	// 		result.close()
	// 		log('watching dts complete~')
	// 	}
	// })
}

export const runRollupBuildDts = async () => {
	log(`dtsBuild '${colors.cyan(`声明文件 生成中`)}' ...`)

	const bundle = await rollup({
		...inputOption,
		plugins: [
			...inputOption.plugins,
			dts({
				tsconfig: resolve('../../tsconfig.json')
			})
		]
	})
	await bundle.write(outputMap.dts as OutputOptions)
	bundle.close()
}
