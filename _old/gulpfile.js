const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const scss = require('gulp-sass');
const rename = require('gulp-rename');

// set variables
const maps = 'maps';
const dir_assets = 'assets';


// build
async function build_scss()
{
	await gulp.src(`${dir_assets}/css/app.scss`)
		.pipe(scss({
			//outputStyle : 'compact'
			outputStyle: 'compressed'
		}).on('error', scss.logError))
		.pipe(gulp.dest(`${dir_assets}/css`));
}

// watch
async function watch()
{
	gulp.watch(`${dir_assets}/css/**/*.scss`, build_scss);
}


// tasks
gulp.task('build', async function() {
	await build_scss();
});
gulp.task('watch', watch);