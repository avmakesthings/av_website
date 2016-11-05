//Global
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
//Data
var assets = require('./assets2json.js');
var rename = require('gulp-rename');
//Server
var connect = require('gulp-connect');
var serve = require('gulp-serve');
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

// gulp.task('server', function(){
//   return connect.server({
//     root: 'dist',
//     port: 3000,
//     livereload: true
//   });
// });

gulp.task('server', serve('dist'));

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


function mustache2html(inputFile, outputFile, jsonData){
  return gulp.src(inputFile)
    .pipe( mustache(jsonData) )
    .pipe( rename(outputFile) )
    .pipe( gulp.dest('./dist') );
}




gulp.task('mustache', function(){

  var myAssets = assets('assets');
  mustache2html('./src/index.html', 'index.html', assets);
  mustache2html('./src/browse.html', 'projects.html', assets);
  myAssets.categories.forEach(function(category){
    category.projects.forEach(function(project){
      mustache2html('./src/project.html', project.slug +'.html', project);
    })
  })
});


// gulp.task('mustache', function(){
//   return gulp.src('./src/*.html')
//     .pipe( mustache(assets('assets')) )
//     .pipe( gulp.dest('./dist') );
// });


gulp.task('watch', function(){
  gulp.watch('./src/scss/**/*.scss', ['sass']);
  gulp.watch('./src/js/*.js', ['js']);
  gulp.watch(['./src/**/*.html', './src/**/*.mustache'], ['mustache']);
});

gulp.task('build', ['copy-assets','copy-vendor','sass', 'js', 'mustache']);
gulp.task('default', ['server', 'copy-assets','copy-vendor','sass', 'js', 'mustache', 'watch']);
