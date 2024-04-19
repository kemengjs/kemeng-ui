import {
	OutputOptions,
	RollupBuild,
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

// rollup 相关参数
const componentsDirPath = 'components'
const entry = 'index.ts'
const componentsNameArr = fs.readdirSync(resolve(componentsDirPath))
const componentsEntryArr = componentsNameArr.map(item => {
	return resolve(path.join(componentsDirPath, item, `index.ts`))
})

const commonPlugins = [
	nodeResolve(),
	commonjs(),
	typescript({
		tsconfig: resolve('../../tsconfig.json'),
		rootDir: appRootPath,
		outputToFilesystem: true,
		declaration: true,
		include: ['components/**/*.ts', 'components/**/*.tsx'],
		exclude: ['**/dist/**', '**/internal/**'],
		outDir: './dist'
	}),
	babel({
		babelHelpers: 'bundled',
		extensions: ['.js', '.jsx', '.ts', '.tsx'],
		exclude: '**/node_modules/**'
	})
]

export const baseConfig = {
	input: [...componentsEntryArr],
	external: [/react/, '@linaria/core']
}

const inputOption = {
	...baseConfig,
	plugins: commonPlugins
}

const outputMap: Record<string, OutputOptions | OutputOptions[]> = {
	dts: {
		dir: targetName,
		format: 'esm',
		entryFileNames: '[name].d.ts'
	},
	bundle: [
		{
			dir: targetName,
			format: 'esm',
			entryFileNames: '[name].mjs',
			preserveModules: true,
			preserveModulesRoot: 'components'
		},
		{
			dir: targetName,
			format: 'cjs',
			entryFileNames: '[name].cjs',
			exports: 'named',
			preserveModules: true,
			preserveModulesRoot: 'components'
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
}

// 使用项目结构的形式 暂时不使用dts
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

	// watcherDts.on('event', ({ result }) => {
	// 	if (result) {
	// 		result.close()
	// 	}
	// })
}
