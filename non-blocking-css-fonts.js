(function(document, fontCSS, fontNames) {
	"use strict";
	var timer = 0,
		link = null,
		head = document.getElementsByTagName("head")[0],
		html = head.parentNode,
		attachEvent = 'attachEvent',
		addEventListener = 'addEventListener',
		removeEventListener = 'removeEventListener',
		readyEvent = 'DOMContentLoaded';
		//loadEvent = 'load';
		
	function injectCss(){
		link = document.createElement("link");
		link.type = "text/css";
		link.rel = "stylesheet";
		link.href = fontCSS;
		
		// unbind DOM ready event, bind CSS load event
		if( addEventListener ) {
			document[removeEventListener](readyEvent, injectCss, false);
			link[addEventListener]('load', cssLoaded, false);
		}
		
		head.appendChild(link);
		
		// fail-safe timer in case the font provider is slow
		timer = setTimeout(cssLoaded, 500);
	}
	
	function cssLoaded(ev) {
		// if there is NO event object, the fail-safe timer fired, remove css
		if( !ev ) head.removeChild(link); // 
		clearTimeout(timer);
		
		// We need to give time for the actual font files to load
		timer = setTimeout(showText, 500);
		waitForWebfonts();
	}
	
	// Borrowed and modified from http://stackoverflow.com/questions/4383226/using-jquery-to-know-when-font-face-fonts-are-loaded#answer-11689060
	function waitForWebfonts() {
	    var nodes = {},
	    	length = "length",
	    	style = "style",
	    	normal = "normal";
	    	
	    for(var i = 0, l = fontNames[length]; i < l; ++i) {
	    	var node = document.createElement('span');
	    	
	    	// Characters that vary significantly among different fonts
	        node.innerHTML = 'giItT1WQy@!-/#';
	        
	        // Visible - so we can measure it - but not on the screen
	        node[style].position      = 'absolute';
	        node[style].top           = '-1000em';
	        
	        // Large font size makes even subtle changes obvious
	        node[style].fontSize      = '300px';
	        
	        // Reset any font properties
	        node[style].fontFamily    = 'serif';
	        node[style].fontVariant   = normal;
	        node[style].fontStyle     = normal;
	        node[style].fontWeight    = normal;
	        node[style].letterSpacing = 0;
	        document.body.appendChild(node);
	        
	        // Remember width with no applied web font
	        nodes[node.offsetWidth] = node;
	        
	        // Now apply the font family to the node
	        node[style].fontFamily = fontNames[i];
	    }
	    
	    (function checkNodes() {
	    	var width;
		    for(width in nodes) {
			    if( width == nodes[width].offsetWidth ) {
			    	// one of the fonts has not loaded.  Wait a little longer
				    setTimeout(checkNodes, 50);
				    return;
			    } else {
			    	// The font has loaded.  Clean things up.
				    nodes[width].parentNode.removeChild(nodes[width]);
				    delete nodes[width];
			    }
		    }
		    // Pass "true" so that we know the fail-safe timer didn't fire.
		    showText(true);
	    }());
	}
	
	function showText(ev) {
		// if no ev, the the fail-safe timer fired.  Remove the fonts
		if( !ev ) head.removeChild(link);
		clearTimeout(timer);
		
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
	
	(function domReady(f) { 
		/in/.test(document.readyState) ? 
			!addEventListener ? 
				setTimeout(function() { domReady(f); }, 9) 
				: document[addEventListener](readyEvent, f, false)
			: f(); 
	}(injectCss));
}(document, 'http://fonts.googleapis.com/css?family=Parisienne', ['Parisienne']));