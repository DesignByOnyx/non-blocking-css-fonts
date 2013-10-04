(function(document, fontString) {
	"use strict";
	var timer = 0,
		link = null,
		head = document.getElementsByTagName("head")[0],
		html = head.parentNode,
		attachEvent = 'attachEvent',
		addEventListener = 'addEventListener',
		removeEventListener = 'removeEventListener',
		readyEvent = 'DOMContentLoaded',
		//loadEvent = 'load',
		injectCss = function(){
			link = document.createElement("link");
			link.type = "text/css";
			link.rel = "stylesheet";
			link.href = fontString;
			
			// unbind DOM ready event, bind CSS load event
			if( addEventListener ) {
				document[removeEventListener](readyEvent, injectCss, false);
				link[addEventListener]('load', cssLoaded, false);
			}
			
			head.appendChild(link);
			
			// fail-safe timer in case the font provider is slow
			timer = setTimeout(cssLoaded, 500);
		},
		cssLoaded = function(ev) {
			// if there is NO event object, the fail-safe timer fired, remove css
			if( !ev ) head.removeChild(link); // 
			clearTimeout(timer);
			
			// We need to give time for the actual font files to load
			//if(addEventListener) window[addEventListener](loadEvent, showText, false);
			timer = setTimeout(showText, 100);
		},
		showText = function(ev) {
			clearTimeout(timer);
			
			//if(addEventListener) window[removeEventListener](loadEvent, showText, false);
			// Set a class on the HTML tag to show the text.
			html.setAttribute('class', html.getAttribute('class').replace('fonts-loading', 'fonts-loaded'));
			link = head = html = null;
		};
	
	// Set a class on the HTML tag while fonts are loading 
	// Use CSS to hide the text on the page
	html.setAttribute('class', html.getAttribute('class') + ' fonts-loader fonts-loading');
	
	// Mini DOM ready
	if( !document[addEventListener] )
		addEventListener = document[attachEvent] ?
			(readyEvent = 'onreadystatechange') 
			// && (loadEvent = 'onload')
			&& (removeEventListener = 'detachEvent')
			&& attachEvent : '';
	
	// use the following if you want this globally available
	//(window.domReady = function(f) {
	(function domReady(f) { 
		/in/.test(document.readyState) ? 
			!addEventListener ? 
				setTimeout(function() { domReady(f); }, 9) 
				: document[addEventListener](readyEvent, f, false)
			: f(); 
	}(injectCss));
}(document, 'http://fonts.googleapis.com/css?family=Parisienne'));