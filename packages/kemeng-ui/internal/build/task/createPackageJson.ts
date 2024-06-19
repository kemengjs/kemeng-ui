import fs from 'node:fs'
import path from 'node:path'
import { resolve } from '../utils/utils'

const componentsDirPath = './dist/components'
const utilsDirPath = './dist/utils'

const componentPackageJsonTemplate = `{
  "main": "./index.cjs",
  "module": "./index.mjs",
  "types": "./index.d.ts",
  "exports": {
    "import": "./index.mjs",
    "require": "./index.cjs",
    "types": "./index.d.ts"
  },
  "type": "module"
}`

export const runCreateComponentPackageJson = async () => {
	const componentsNameArr = fs.readdirSync(resolve(componentsDirPath))

	console.log('componentsNameArr', componentsNameArr)

	componentsNameArr.forEach(componentName => {
		// if (componentName === 'Button') {
		fs.writeFile(
			resolve(path.join(componentsDirPath, componentName, `package.json`)),
			componentPackageJsonTemplate,
			'utf-8',
			err => {
				if (err) {
					console.error(err)
				}
			}
		)
		// }
	})
}

export const runCreateUtilsPackageJson = async () => {
	fs.writeFile(
		resolve(path.join(utilsDirPath, `package.json`)),
		componentPackageJsonTemplate,
		'utf-8',
		err => {
			if (err) {
				console.error(err)
			}
		}
	)
}
