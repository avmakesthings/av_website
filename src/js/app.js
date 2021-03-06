/************************************
            APP.JS CORE
************************************/

// Hides the loader bar, then the loader wrapper
function hideLoader(){
	// Remove loader
	var loaderWrapper = document.getElementsByClassName('loader-wrapper')[0];
	setTimeout(function(){

		var loader = loaderWrapper.getElementsByClassName('loader')[0];
		loader.outerHTML = "";
		delete loader;

		loaderWrapper.classList.add('hidden')
			setTimeout(function(){
			loaderWrapper.outerHTML = "";
			delete loader;
		}, 500)

	}, 500)

}

// Typically, clicking the category menu takes you to the 'projects' page
function initMenu(){
	var links = document.getElementsByClassName('category-link')
	for( var i = 0; i < links.length; i ++){
		var navCategory = links[i];
		navCategory.addEventListener("click", function(e){
			var target = $(this).data('target');
			window.location.href = '/projects.html#'+target;
		})
	}	
}

// On the 'projects' page itself, the menu doesn't reload the page.
// It merely changes which category is visible.
function initCategoryMenu(){
	var links = document.getElementsByClassName('category-link')
	for( var i = 0; i < links.length; i ++){
		var navCategory = links[i];
		navCategory.addEventListener("click", function(e){
			var target = $(this).data('target');
			initCategories(target)
			window.location.href = '/projects.html#'+target;
		})
	}	
}

function initMasonry(){
	// Assumes masonry has been included
	var $grid = $('.grid').masonry({
		itemSelector: '.grid-item',
	});
	// layout Masonry after each image loads // TO-DO - this still isn't working correctly
	$grid.imagesLoaded().progress( function() {
		$grid.masonry('layout');
  	});

}


// Open the category in the URL hash. 
// If no category is in the hash, open the first category
function initCategories(target){
	var categories = document.getElementsByClassName('category')

	for( var i = 0; i < categories.length; i ++){
		var category = categories[i];
		category.classList.remove('active');
	}

	if (target == ''){
		var categories = document.getElementsByClassName('category')
		target = categories[0].className.split(' ')[1];
		window.location.hash = "#"+target
	}
		
	var active = document.getElementsByClassName(target)

	for( var i = 0; i < active.length; i ++){
		active[i].classList.add('active');
	}

	initMasonry()
}

/*
  After the page loads, lazy load any img tags 
  that have a 'data-src' attribute.
*/

function loadImage (el, attribute) {
    var img = new Image()
      , src = el.getAttribute(attribute);

    img.onload = function() {
      if (!! el.parent){
        el.parent.replaceChild(img, el)
      } else{
        el.src = src;
      }
    }
    img.src = src;
}

function loadImagesFromAttribute(attribute){
  var images = document.querySelectorAll('img['+attribute+']');
  for(var i = 0; i < images.length; i++){
    var image = images[i];
    loadImage(image, attribute)
  }  
}


function sortFeaturedProjects(){

	var featured = $('.project-preview').sort(function(a, b) {
		return +a.getAttribute('data-id') - +b.getAttribute('data-id');
	})
	$('.project-preview').remove()
	$('.featured').append(featured)
}


// function changeToNextProject(){
// 	var nextProjButton = document.getElementById('next-project')
// 	nextProjButton.onclick() = function() {(
// 		console.log('i am clicked')
// 	)}
// }

$(window).on('load', function(){
	hideLoader()
	loadImagesFromAttribute('data-lazy-src')
	
	// Adjust carousel interval
	$('.carousel').carousel({
		interval: 6000
	})


	if(window.location.pathname === "/projects.html"){
		// On the projects page, open the menu to the category in the url hash
		var target = window.location.hash.replace("#",'')
		initCategories(target)
		initCategoryMenu()
	} else if (window.location.pathname === "/"){
		sortFeaturedProjects()
		initMasonry()
		initMenu()
	}
	else {
		initMenu()
	}
});



