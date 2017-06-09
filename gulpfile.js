const gulp = require('gulp');
const babel = require('gulp-babel');
const browserSync = require('browser-sync');
const webpack = require('gulp-webpack');
const del = require('del');
const runSequence = require('run-sequence');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const gulpsass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const autoprefixer = require('gulp-autoprefixer');

const reload = browserSync.reload;
 
gulp.task('scripts', ()=>{
	return gulp.src('src/**/*.js')
	.pipe(babel({
		presets: ['es2015']
	}))
	.pipe(gulp.dest('build'));
});
gulp.task('scripts-prod', ()=>{
	return gulp.src('src/**/*.js')
	.pipe(babel({
		presets: ['es2015']
	}))
	.pipe(uglify())
	.pipe(gulp.dest('dist'));
});

gulp.task('webpack', ()=>{
	return gulp.src('src/js/main.js')
	.pipe(webpack(require('./webpack.config.js')))
	.pipe(gulp.dest('build/js/'));
});
gulp.task('webpack-prod', ()=>{
	return gulp.src('src/js/main.js')
	.pipe(webpack(require('./webpack.config.js')))
	.pipe(uglify())
	.pipe(gulp.dest('dist/js/'));
});

gulp.task('html', ()=>{
	return gulp.src('src/**/*.html')
	.pipe(gulp.dest('build'));
});
gulp.task('html-prod', ()=>{
	return gulp.src('src/**/*.html')
	.pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeOptionalTags: true
    }))
	.pipe(gulp.dest('dist'));
});

gulp.task('styles', ()=>{
	const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  	];

	return gulp.src([
		'src/**/*.scss',
		'src/**/*.css'
	])
	.pipe(gulpsass({
		precision: 10
	}))
	.pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
	.pipe(gulp.dest('build'));
});
gulp.task('styles-prod',()=>{
	const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  	];

	return gulp.src([
		'src/**/*.scss',
		'src/**/*.css'
	])
	.pipe(gulpsass({
		precision: 10
	}))
	.pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
	.pipe(cssnano())
	.pipe(gulp.dest('dist'));
});

gulp.task('clean', ()=>{
	del(['dist/*', '!dist/.git'], {dot: true})
});

gulp.task('copy', ()=>{
	gulp.src([
		'src/*',
		'!src/*.html'
	])
	.pipe(gulp.dest('build'))
	.pipe(gulp.dest('dist'));
});
gulp.task('copy-fonts', ()=>{
	gulp.src([
		'src/fonts/**'
	])
	.pipe(gulp.dest('build/fonts/'))
	.pipe(gulp.dest('dist/fonts/'));
});
gulp.task('copy-images', ()=>{
	gulp.src([
		'src/img/**'
	])
	.pipe(gulp.dest('build/img/'))
	.pipe(gulp.dest('dist/img/'));
});

gulp.task('serve', ['html','webpack','styles','copy','copy-images','copy-fonts'], ()=>{
	browserSync({
		notify: false,
		server: ['build'],
		port: 3000 
	});
	gulp.watch(['src/**/*.html'],['html', reload]);
	gulp.watch(['src/**/*.js'], ['webpack', reload]);
	gulp.watch(['src/**/*.scss','src/**/*.css'], ['styles', reload]);
	// gulp.watch(['src/**/*.js'], ['scripts', reload]);
});
gulp.task('serve:dist', ['default'], ()=>{
	browserSync({
		notify: false,
		server: ['dist'],
		port: 3002 
	});
});

gulp.task('default', cb =>{
	runSequence(
		['clean','html-prod','webpack-prod','styles-prod','copy','copy-images','copy-fonts'],
		cb
	)
});