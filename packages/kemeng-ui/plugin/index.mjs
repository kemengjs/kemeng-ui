import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const baseSource = path.resolve(
	path.dirname(url.fileURLToPath(import.meta.url))
)
const root = `${baseSource}/..`
const resolve = p => path.resolve(root, p)
const componentsDirPath = 'components'
const entry = 'index.ts'
const componentsNameArr = fs.readdirSync(resolve(componentsDirPath))
const componentsEntryMap = componentsNameArr.reduce((prev, cur) => {
	prev[`${cur}/${cur}`] = resolve(
		path.join(componentsDirPath, cur, `${cur}.tsx`)
	)

	return prev
}, {})

export const componentsPlugin = () => {
	return {
		name: 'componentsPlugin',
		options: {
			handler(options) {
				const entryObj = {
					index: resolve(entry),
					...componentsEntryMap
				}
				console.log('entryObj', entryObj)
				options.input = entryObj
			}
		},
		outputOptions(options) {
			console.log('out', options)
		},

		generateBundle(options) {
			console.log('ii', options)
		}
	}
}
