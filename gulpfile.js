var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var fs = require('fs');
var assets = require('./assets2json.js');
var rename = require('gulp-rename');
var serve = require('gulp-serve');
var flatten = require('gulp-flatten');
var handlebars = require('gulp-compile-handlebars');
var sass = require('gulp-sass');
var cleancss = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');


gulp.task('server', serve('dist'));


gulp.task('copy-assets', function() {
    gulp.src('./assets/**/*.{png,jpg,gif,svg,mp4}')
    // Perform minification tasks, etc here
    .pipe(flatten())
    .pipe(gulp.dest('./dist/img'));
});


gulp.task('copy-vendor', function() {
    gulp.src('./node_modules/bootstrap/dist/js/bootstrap.min.js')
    // Perform minification tasks, etc here
    .pipe(gulp.dest('./dist/js'));

    gulp.src('./node_modules/blazy/blazy.min.js')
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


function handlebars2html(inputFile, outputFile, jsonData, options){
  return gulp.src(inputFile)
    .pipe( handlebars(jsonData, options) )
    .pipe( rename(outputFile) )
    .pipe( gulp.dest('./dist') );
}


function getPartials(partialPath){
  var partials = {}
  var partialFolders = fs.readdirSync(partialPath)

  partialFolders.forEach(function(partialName) {
    var partial = fs.readFileSync(partialPath+'/'+partialName, {encoding: 'utf8'})
    partials[partialName.split('.')[0]] = partial
  });
  return partials
}

function createPrevNextProject(assets){
  
  var flatProjects = []
  
  assets.categories.forEach(function(category){
    category.projects.forEach(function(project){
      if(!project.wip){
        flatProjects.push(project)
      }
    })
  })

  flatProjects.forEach(function(project, i){    
    var nextIndex = i+1
    var prevIndex = i-1
    
    if(i==0){
      prevIndex=flatProjects.length-1

    }else if(i==flatProjects.length-1){
      nextIndex = 0
    }
    project.prevURL = getProjectURL(flatProjects[prevIndex])
    project.nextURL = getProjectURL(flatProjects[nextIndex])
    
  })
}

function getProjectURL(project){
  return project.slug +'.html'
}


gulp.task('handlebars', function(){

  var myAssets = assets('assets');
  createPrevNextProject(myAssets)

  var options = {}
  options.partials = getPartials('./src/partials')

  handlebars2html('./src/index.html', 'index.html', myAssets, options);
  handlebars2html('./src/projects.html', 'projects.html', myAssets, options);
  handlebars2html('./src/contact.html', 'contact.html', myAssets, options);
  myAssets.categories.forEach(function(category){
    category.projects.forEach(function(project){
      // console.log(JSON.stringify(myAssets, undefined, 2));
      handlebars2html('./src/project.html', getProjectURL(project), project, options);
    })
  })
});


gulp.task('watch', function(){
  gulp.watch('./src/scss/**/*.scss', gulp.series('sass'));
  gulp.watch('./src/js/*.js', gulp.series('js'));
  gulp.watch(['./src/**/*.html', './src/**/*.hbs'], gulp.series('handlebars'));
});


gulp.task('build', gulp.series(gulp.parallel('copy-assets','copy-vendor','sass', 'js', 'handlebars')));
gulp.task('default', gulp.series(gulp.parallel('server', 'copy-assets','copy-vendor','sass', 'js', 'handlebars', 'watch')));