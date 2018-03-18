const {resolve} = require('path')

const gulp = require('gulp')
const ts = require('gulp-typescript')
const sourcemaps = require('gulp-sourcemaps')
const del = require('del')

process.chdir(resolve(__dirname, '..'))

function typescriptTask(path, moduleKind) {
	const root = resolve(__dirname, '../packages', path)
	const projectPath = resolve(root, 'tsconfig.json')
	const project = ts.createProject(projectPath, {module: moduleKind})
	const buildPath = resolve(root, 'build', moduleKind)
	const moduleTask = `${path}:${moduleKind}`
	const cleanTask = `${moduleTask}:clean`
	const buildTask = `${moduleTask}:build`

	gulp.task(cleanTask, () => del(buildPath, {force: true}))
	gulp.task(buildTask, () => project
		.src()
		.pipe(sourcemaps.init())
		.pipe(project())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(buildPath))
	)

	gulp.task(moduleTask, gulp.series(cleanTask, buildTask))

	return moduleTask
}

/**
 * Create a package project with TypeScript compilation tasks for CommonJS and ES6.
 * An alternate task is defined with the relative path to the project root for convenience.
 * Eg :
 * 	 yarn build package/transform/typescript
 *  - or -
 *   yarn build transform/typescript
 */
function p(path) {
	const task = gulp.parallel(
		typescriptTask(path, 'es6'),
		typescriptTask(path, 'commonjs')
	)

	gulp.task(path, task)
	gulp.task(`packages/${path}`, task)

	return path
}

// Build the project tree
gulp.task(
	'default',
	gulp.parallel(
		gulp.series(
			p('core'),
			gulp.parallel(
				p('support/most'),
				p('support/rxjs')
			)
		),
		p('transform/typescript')
	)
)
