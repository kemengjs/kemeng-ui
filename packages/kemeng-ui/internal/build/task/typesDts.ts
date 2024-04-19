import {
	appRootPath,
	excludeFiles,
	log,
	resolve,
	targetName
} from '../utils/utils'
import { Project, type CompilerOptions, type SourceFile } from 'ts-morph'
import { glob } from 'fast-glob'

const TSCONFIG_PATH = resolve('../../tsconfig.json')
const outDir = resolve(targetName, 'types')

export const generateTypesDefinitions = async () => {
	const compilerOptions: CompilerOptions = {
		emitDeclarationOnly: true,
		outDir,
		baseUrl: appRootPath,
		skipLibCheck: true,
		noImplicitAny: false
	}

	const project = new Project({
		compilerOptions,
		tsConfigFilePath: TSCONFIG_PATH,
		skipAddingFilesFromTsConfig: true
	})

	const sourceFiles = await addSourceFiles(project)
	log('Added source files')
}

async function addSourceFiles(project: Project) {
	project.addSourceFileAtPath(resolve('typings/env.d.ts'))

	const globSourceFile = '**/*.{js?(x),ts?(x),vue}'
	const filePaths = excludeFiles(
		await glob([globSourceFile, '!element-plus/**/*'], {
			cwd: pkgRoot,
			absolute: true,
			onlyFiles: true
		})
	)
	const epPaths = excludeFiles(
		await glob(globSourceFile, {
			cwd: epRoot,
			onlyFiles: true
		})
	)

	const sourceFiles: SourceFile[] = []
	await Promise.all([
		...filePaths.map(async file => {
			if (file.endsWith('.vue')) {
				const content = await readFile(file, 'utf-8')
				const hasTsNoCheck = content.includes('@ts-nocheck')

				const sfc = vueCompiler.parse(content)
				const { script, scriptSetup } = sfc.descriptor
				if (script || scriptSetup) {
					let content =
						(hasTsNoCheck ? '// @ts-nocheck\n' : '') + (script?.content ?? '')

					if (scriptSetup) {
						const compiled = vueCompiler.compileScript(sfc.descriptor, {
							id: 'xxx'
						})
						content += compiled.content
					}

					const lang = scriptSetup?.lang || script?.lang || 'js'
					const sourceFile = project.createSourceFile(
						`${path.relative(process.cwd(), file)}.${lang}`,
						content
					)
					sourceFiles.push(sourceFile)
				}
			} else {
				const sourceFile = project.addSourceFileAtPath(file)
				sourceFiles.push(sourceFile)
			}
		}),
		...epPaths.map(async file => {
			const content = await readFile(path.resolve(epRoot, file), 'utf-8')
			sourceFiles.push(
				project.createSourceFile(path.resolve(pkgRoot, file), content)
			)
		})
	])

	return sourceFiles
}

function typeCheck(project: Project) {
	const diagnostics = project.getPreEmitDiagnostics()
	if (diagnostics.length > 0) {
		consola.error(project.formatDiagnosticsWithColorAndContext(diagnostics))
		const err = new Error('Failed to generate dts.')
		consola.error(err)
		throw err
	}
}
