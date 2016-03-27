'use strict';

var gulp = require('gulp');

var compass = require('gulp-compass');

var jade = require('gulp-jade');

var browserSync = require('browser-sync');

var plumber = require('gulp-plumber');

var concat = require('gulp-concat');

var reload = browserSync.reload;

var uglify = require('gulp-uglify');


var src = {
	compass: 	"src/sass/**/*.{scss,sass}",
	js: 		["src/js/general.js","src/js/modernizr.js"],
	js_vendor: 	"src/js/vendor/**/*.js",
	jade: 		"src/templates/**/*.jade",
};

var output = {
	css: 		"build/development/css",
	js: 		"build/development/js",
	js_vendor: 	"build/development/js/vendor",
	html: 		"build/development",
};

var onError = function(err) {
	console.log(err);
	this.emit('end');
};

// Tasks

gulp.task('compass', function() {
  gulp.src(src.compass)
  	.pipe(
		plumber({
			errorHandler: onError
		}))
    .pipe(compass({
    	//style: 'compressed',
    	sass: 'src/scss',
    	css: output.css,
    	comments:  true,
      	require: ['susy', 'breakpoint']
    }))
    .pipe(gulp.dest(output.css))
    .pipe(reload({stream:true}));
});

gulp.task('scripts', function(){
	gulp.src(src.js)
		.pipe(
			plumber({
				errorHandler: onError
		}))
		.pipe(uglify())
		.pipe(gulp.dest(output.js))
		.pipe(reload({stream:true}));
});

gulp.task('scripts-vendor', function(){
	gulp.src(src.js_vendor)
		.pipe(
			plumber({
				errorHandler: onError
		}))
		.pipe(concat('all.js'))
		.pipe(uglify())
		.pipe(gulp.dest(output.js_vendor))
		.pipe(reload({stream:true}));
});

gulp.task('jade-compile', function(){
	return gulp.src(src.jade)
		.pipe(
			plumber({
				errorHandler: onError
		}))
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest(output.html))
		.pipe(reload({stream:true}));
});

gulp.task('jade-watch', ['jade-compile']);

gulp.task('watch', function(){
	browserSync.init({
		server: 'build/development/'
	});
	gulp.watch('src/js/**/*.js', ['scripts','scripts-vendor']);
	gulp.watch('src/sass/**/*.{scss,sass}', ['compass']);
	gulp.watch(src.jade, ['jade-watch']);

	gulp.watch('build/development/*.html').on('change', function () {
	    browserSync.reload();
	});
});


gulp.task('default', ['scripts','scripts-vendor','compass','jade-compile','watch']);