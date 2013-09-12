(function(fontString, document) {
	"use strict";
	var timer = 0,
		link = null,
		head = document.getElementsByTagName("head")[0],
		html = head.parentNode,
		attachEvent = 'attachEvent',
		addEventListener = 'addEventListener',
		removeEventListener = 'removeEventListener',
		readyEvent = 'DOMContentLoaded',
		injectCss = function(ev){
			link = document.createElement("link");
			link.type = "text/css";
			link.rel = "stylesheet";
			link.href = fontString;
			if( ev ) link[addEventListener]('load', callback, false);
			head.appendChild(link);
			
			timer = setTimeout(callback, 500); // fail-safe in case font provider is slow
			if( ev )
				document[removeEventListener](readyEvent, injectCss, false);
		},
		callback = function(ev) {
			if( ev ) clearTimeout(timer); // css loaded like it should, clear the timeout
			else head.removeChild(link); // the fail-safe timer finished, remove css
			
			// A little delay is needed for font files to load
			// This can sometimes result in FOUC if the font files are slow
			// Either increase the timeout or use window.onload (with a fail-safe).
			timer = setTimeout(function(){
				html.setAttribute('class', html.getAttribute('class') + ' fonts-loaded');
			}, 100);
			
			link = null;
		};
	
	if( !document[addEventListener] )
		addEventListener = document[attachEvent] ?
			(readyEvent = 'onreadystatechange') 
			&& (removeEventListener = 'detachEvent')
			&& attachEvent : '';
	
	html.setAttribute('class', html.getAttribute('class') + ' fonts-loading');
	if( addEventListener ) document[addEventListener](readyEvent, injectCss, false);
	else setTimeout(injectCss, 300);
}('http://fonts.googleapis.com/css?family=Noto Sans:400,700,400italic,700italic|Montserrat:400,700', document));