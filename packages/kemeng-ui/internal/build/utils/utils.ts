import path from 'node:path'
import url from 'node:url'

// 基础前置函数
export function log(msg: string, ...args: string[]) {
	const time = new Date().toLocaleTimeString('en-US', { hour12: false })
	console.log(`  [${time}] ${msg}`, ...args)
}

export const baseSource = path.resolve(
	path.dirname(url.fileURLToPath(import.meta.url)),
	'../../..'
)
export const resolve = (p: string, ...args: string[]) =>
	path.resolve(baseSource, p, ...args)

export const appRootPath = process.cwd()

export const targetName = 'dist'

export const excludeFiles = (files: string[]) => {
	const excludes = ['node_modules', 'test', 'mock', 'gulpfile', 'dist']
	return files.filter(path => !excludes.some(exclude => path.includes(exclude)))
}
