var log = function(o) { console.log(o); }

// load modules
var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var scss = require('gulp-sass');
var rename = require('gulp-rename');

// set variables
var maps = 'maps';
var dir_src = './src';
var dir_dist = './dist';

// set vendor files
var vendors = {
	js : [
		'./node_modules/jquery/dist/jquery.min.js'
	],
	fonts : dir_src + '/scss/fonts.scss'
};


// build vendor files
gulp.task('vendor', function(){
	// javascript vendors
	gulp.src(vendors.js)
		.pipe(concat('vendor.pkgd.js', { newLine: '\n\n' }))
		.pipe(gulp.dest(dir_dist + '/js'));

	// fonts
	gulp.src(vendors.fonts)
		.pipe(scss({
			outputStyle: 'compressed'
		}).on('error', scss.logError))
		.pipe(rename({ suffix: '.pkgd' }))
		.pipe(gulp.dest(dir_dist + '/fonts'));
});


// build scss
gulp.task('scss', function(){
	gulp.src(dir_src + '/scss/layout.scss')
		.pipe(sourcemaps.init())
		.pipe(scss({
			//outputStyle : 'compact'
			outputStyle: 'compressed'
		}).on('error', scss.logError))
		.pipe(rename({ suffix: '.pkgd' }))
		.pipe(sourcemaps.write(maps))
		.pipe(gulp.dest(dir_dist + '/css'));
});
gulp.task('scss:watch', function(){
	gulp.watch(dir_src + '/scss/*.scss', ['scss']);
});

// build javascript
gulp.task('javascript', function(){
	gulp.src([ dir_src + '/js/*.js', dir_src + '/js/!(layout)*.js', dir_src + '/js/layout.js' ])
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(uglify())
		.pipe(concat('app.pkgd.js', { newLine: '\n\n' }))
		.pipe(sourcemaps.write(maps))
		.pipe(gulp.dest(dir_dist + '/js'));
});
gulp.task('javascript:watch', function(){
	gulp.watch(dir_src + '/js/*.js', ['javascript']);
});