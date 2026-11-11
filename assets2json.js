/*
Compiles nested YAML assets to JSON
*/


var fs = require('fs'),
    path = require('path'),
    YAML = require('yamljs');


//Functions

function isFolder(filepath) {

    var stats = fs.lstatSync(filepath);
    if (stats.isDirectory()) {
        return true
        };
    return false;
}


//read Category
function readCategory(categoryPath, categoryName){
    var category = YAML.load(categoryPath+'/category.yaml');




    //Read projects
    var projectFolders = fs.readdirSync(categoryPath)

    //Read through everthing in projects folder
    var projects = []
    projectFolders.forEach(function readProjects(projectName) {

        var projectPath = categoryPath + '/' + projectName;

        if (isFolder(projectPath)){
            try{
                // return readAssets(filename + '/' + child);
                var project = readProject(projectPath);
                // Nov 2026 portfolio update: projects with `hidden: true` in
                // project.yaml are commented out of the site (not deleted).
                // Their files stay in the repo; remove the flag to restore.
                if (project && project.hidden) {
                    return;
                }
                project.slug = projectName;
                project.category = categoryName;
                projects.push(project);                
            }
            catch(e){
                console.error('Failed to read Project ' + projectName, e)
            }

        }
    });


    category.projects = projects ;






    return category;
}


//read project
function readProject(projectPath){
    var project = YAML.load(projectPath+'/project.yaml');
    return project;
}



function readAssets(rootPath) {

    // Load yaml file using YAML.load & convert to JSON
    var assets = YAML.load(rootPath+'/main.yaml');

    //Read categories
    var categoryFolders = fs.readdirSync(rootPath + '/projects')

    //Read through everthing in projects folder
    var categories = []
    categoryFolders.forEach(function readCategories(categoryName) {

        var categoryPath = rootPath + '/projects/' + categoryName;

        if (isFolder(categoryPath)){
            // return readAssets(filename + '/' + child);
            var category = readCategory(categoryPath, categoryName);
            // Nov 2026: drop categories left with no visible projects
            // (e.g. Architecture, once its projects were commented out),
            // so the projects page and nav do not show an empty section.
            if (!category.projects || category.projects.length === 0) {
                return;
            }
            category.slug = categoryName;
            categories.push(category);
        }
    });


    assets.categories = categories ;

    return assets;
}

module.exports = readAssets;

// This runs when you execute this script from command line
if (module.parent == undefined) {
    // node readAssets.js ~/foo/bar
    var util = require('util');
    var filepath = process.argv[2]; //gets filepath from command line
    var json = readAssets(filepath);
    console.log(util.inspect(json, false, null));
}