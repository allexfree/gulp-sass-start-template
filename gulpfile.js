'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var minify = require('gulp-csso');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var svgstore = require('gulp-svgstore');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify-es').default;
var webp = require('gulp-webp');
var pump = require('pump');
var run = require('run-sequence');
var del = require('del');
var autoprefixer = require('autoprefixer');
var server = require('browser-sync').create();

gulp.task('html', function () {
  return gulp.src('source/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build'));
});

gulp.task('style', function () {
  gulp.src('source/sass/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest('build/css'))
    .pipe(minify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream());
});

gulp.task('sprite', function () {
  return gulp.src([
    'source/img/icons/*.svg',
  ])
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/img/sprite'));
});

gulp.task('images', function () {
  return gulp.src('source/img/**/*.{png,jpg,gif}')
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.jpegtran({progressive: true})
  ]))
  .pipe(gulp.dest('source/img'));
});

gulp.task('webp', function () {
  return gulp.src('source/img/**/*.{png,jpg}')
      .pipe(webp({quality: 90}))
      .pipe(gulp.dest('build/img'));
});

gulp.task('vendor', function () {
  return gulp.src('source/libs/**/*.{js,css}')
  .pipe(gulp.dest('build/vendor'))
  .pipe(server.stream());
});

gulp.task('js', function (cd) {
  pump([
    gulp.src('source/js/**/*.js'),
    uglify(),
    rename({suffix: '.min'}),
    gulp.dest('build/js'),
    server.stream()
  ], cd);
});

gulp.task('copy', function () {
  return gulp.src([
    'source/fonts/**/*.{woff,woff2}',
    'source/img/**',
    'source/js/**'
  ], {
    base: 'source'
  })
    .pipe(gulp.dest('build'));
});

gulp.task('clean', function () {
  return del('build');
});

gulp.task('build', function (done) {
  run(
      'clean',
      'copy',
      'webp',
      'vendor',
      'sprite',
      'style',
      'html',
      'js',
      done
  );
});

gulp.task('serve', function () {
  server.init({
    server: ['build/', './']
  });

  gulp.watch('source/*.html', ['html']).on('change', server.reload);
  gulp.watch('source/js/**/*.js', ['js']).on('change', server.reload);
  gulp.watch('src/img/*', ['images:update']);
  gulp.watch('source/sass/**/*.scss', ['style']);
  gulp.watch('source/img/icons/*.svg', ['sprite']);
});
