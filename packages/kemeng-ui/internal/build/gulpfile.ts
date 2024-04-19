import { series, parallel, TaskFunction } from 'gulp'
import colors from 'picocolors'
import { removeSync } from 'fs-extra/esm'
import { log, targetName } from './utils/utils'
import { bundleWatch, runRollupBuildBundle } from './task/moduleBuild'

// 搞P task定义

const dev: TaskFunction = async cb => {
	bundleWatch()
	cb()
}

const clean: TaskFunction = cb => {
	log(`clean '${colors.cyan(targetName)}' ...`)
	removeSync(targetName)
	cb()
}

const build = series(clean, runRollupBuildBundle)

export { build }

export { dev }

export default build
