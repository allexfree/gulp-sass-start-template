'use strict';

const gulp = require('gulp'),
      sass = require('gulp-sass'),
      minify = require('gulp-csso'),
      htmlmin = require('gulp-htmlmin'),
      imagemin = require('gulp-imagemin'),
      plumber = require('gulp-plumber'),
      postcss = require('gulp-postcss'),
      svgstore = require('gulp-svgstore'),
      rename = require('gulp-rename'),
      uglify = require('gulp-uglify-es').default,
      webp = require('gulp-webp'),
      pump = require('pump'),
      run = require('run-sequence'),
      del = require('del'),
      autoprefixer = require('autoprefixer'),
      gulpWebpack = require('webpack-stream'),
      babel = require('gulp-babel'),
      server = require('browser-sync').create();

let webpackConfig = {
  output: {
    filename: 'all.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: '/node-modules/'
      }
    ]
  },
  mode: 'none'
};

gulp.task('html', function () {
  return gulp.src('source/*.html')
    // .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build'));
});

gulp.task('style', function () {
  return gulp.src('source/sass/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({
        grid: 'autoplace'
      })
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
    // uglify(),
    // rename({suffix: '.min'}),
    // gulp.dest('build/js'),
    server.stream()
  ], cd);
});

gulp.task('webpack', function () {
  return gulp.src('source/js/index.js')
  .pipe(babel({
    presets: ['@babel/preset-env']
  }))
  .pipe(gulpWebpack(webpackConfig))
  .pipe(uglify())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('build/js'))
  .pipe(server.stream());
});

gulp.task('copy', function () {
  return gulp.src([
    'source/fonts/**/*.{woff,woff2}',
    'source/img/**',
    // 'source/js/**'
  ], {
    base: 'source'
  })
    .pipe(gulp.dest('build'));
});

gulp.task('clean', function () {
  return del('build');
});

const build = gulp.series('clean', 'copy', 'webp', 'vendor', 'sprite', 'style', 'html', 'js', 'webpack');

gulp.task('build', build);

// gulp.task('build', function (done) {
//   run(
//       'clean',
//       'copy',
//       'webp',
//       'vendor',
//       'sprite',
//       'style',
//       'html',
//       'js',
//       done
//   );
// });

gulp.task('serve', function () {
  server.init({
    server: ['build/', './']
  });

  gulp.watch('source/*.html', gulp.series('html')).on('change', server.reload);
  gulp.watch('source/js/**/*.js', gulp.series('js')).on('change', server.reload);
  gulp.watch('source/js/**/*.js', gulp.series('webpack')).on('change', server.reload);
  gulp.watch('src/img/*', gulp.series('images'));
  gulp.watch('source/sass/**/*.scss', gulp.series('style'));
  gulp.watch('source/img/icons/*.svg', gulp.series('sprite'));
});
