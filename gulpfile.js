//Global
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
//Data
var assets = require('./assets2json.js');
var rename = require('gulp-rename');
//Server
var connect = require('gulp-connect');
//Flatten folder
var flatten = require('gulp-flatten');
//Template Engine
var mustache = require('gulp-mustache');
//Stylesheet
var sass = require('gulp-sass');
var cleancss = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
//javascript
var uglify = require('gulp-uglify');

gulp.task('server', function(){
  return connect.server({
    root: 'dist',
    port: 3000
  });
});

gulp.task('copy-assets', function() {
    gulp.src('./assets/**/*.{png,jpg,gif,svg}')
    // Perform minification tasks, etc here
    .pipe(flatten())
    .pipe(gulp.dest('./dist/img'));
});

gulp.task('copy-vendor', function() {
    gulp.src('./node_modules/bootstrap/dist/js/bootstrap.min.js')
    // Perform minification tasks, etc here
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('sass', function(){
  return gulp.src('./src/scss/style.scss')
    .pipe( sourcemaps.init() )
      .pipe( sass().on('error', sass.logError) )
      .pipe( autoprefixer() )
      .pipe( gulp.dest('./dist/css') )
      .pipe( cleancss() )
      .pipe( rename({ suffix: '.min' }) )
    .pipe( sourcemaps.write('./') )
    .pipe( gulp.dest('./dist/css') );
});

gulp.task('js', function(){
  return gulp.src('./src/js/*.js')
    .pipe( sourcemaps.init() )
      .pipe( gulp.dest('./dist/js') )
      .pipe( uglify() )
      .pipe( rename({ suffix: '.min' }) )
    .pipe( sourcemaps.write('./') )
    .pipe( gulp.dest('./dist/js') );
});

gulp.task('mustache', function(){
  return gulp.src('./src/*.html')
    .pipe( mustache(assets('assets')) )
    .pipe( gulp.dest('./dist') );
});


gulp.task('watch', function(){
  gulp.watch('./src/scss/**/*.scss', ['sass']);
  gulp.watch('./src/js/*.js', ['js']);
  gulp.watch(['./src/**/*.html', './src/**/*.mustache'], ['mustache']);
});

gulp.task('build', ['copy-assets','copy-vendor','sass', 'js', 'mustache']);
gulp.task('default', ['server', 'copy-assets','copy-vendor','sass', 'js', 'mustache', 'watch']);
