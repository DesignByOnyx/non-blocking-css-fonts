(function (document, fontCSS) {
    "use strict";
    var timer = 0,
        link = null,
        head = document.getElementsByTagName("head")[0],
        html = head.parentNode,
        attachEvent = 'attachEvent',
        addEventListener = 'addEventListener',
        removeEventListener = 'removeEventListener',
        readyEvent = 'DOMContentLoaded',
        style = "style",
        normal = "normal",
        fontNames = fontCSS.replace(/.+[?&]family=([^&]+).*/, '$1').split('|'),
		fontProfiles = [];

    function injectCss() {
        link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = fontCSS;

        // unbind DOM ready event, bind CSS load event
        if (addEventListener) {
            document[removeEventListener](readyEvent, injectCss, false);
            link[addEventListener]('load', cssLoaded, false);
        }

        head.appendChild(link);

        // fail-safe timer in case the font provider is slow
        timer = setTimeout(cssLoaded, 500);
    }

    function cssLoaded(ev) {
        // if there is NO event object, the fail-safe timer fired, remove css
        clearTimeout(timer);
        
        if (ev)
	        waitForWebfonts() && (timer = setTimeout(showText, 500));
        else
        	head.removeChild(link) && showText();
    }

    // Borrowed and modified from http://stackoverflow.com/questions/4383226/using-jquery-to-know-when-font-face-fonts-are-loaded#answer-11689060
    function waitForWebfonts() {
		for(var i = 0, l = fontNames.length; i < l; i++) {
			var profile = fontNames[i].split(':');
			for(var n = 0, weights = profile[1].split(','); n < weights.length; n++) {
				fontProfiles.push({
					fontName: profile[0].replace(/\+/g, ' '),
					fontWeight: weights[n],
					loaded: false
				});
			}
		}
		
        for (var i = 0, l = fontProfiles.length; i < l; ++i) {
            var node = document.createElement('span');

            // Characters that vary significantly among different fonts
            node.innerHTML = 'giItT1WQy@!-/#';

            // Visible - so we can measure it - but not on the screen
            node[style].position = 'absolute';
            node[style].top = '-1000em';

            // Large font size makes even subtle changes obvious
            node[style].fontSize = '300px';

            // Reset any font properties
            node[style].fontFamily = 'serif';
            node[style].fontVariant = normal;
            node[style].fontStyle = normal;
            node[style].fontWeight = fontProfiles[i].fontWeight;
            node[style].letterSpacing = 0;
            document.body.appendChild(node);

            // Remember the initial width so we can check later
            fontProfiles[i].node = node;
            fontProfiles[i].baseWidth = node.offsetWidth;
            
            // Setting a 'serif' fallback ensures we don't inherit the site's CSS font family
            // which would trigger a false positive checking the width later
            node[style].fontFamily = "'" + fontProfiles[i].fontName + "', serif";
        }
        
        (function checkNodes() {
        	var profile;
            for (var i = 0, l = fontProfiles.length; i < l; i++) {
            	profile = fontProfiles[i];
            	if( !profile.loaded ) {
	                if (profile.baseWidth == profile.node.offsetWidth) {
	                    // one of the fonts has not loaded.  Wait a little longer
	                    setTimeout(checkNodes, 50);
	                    return;
	                } else {
	                    // The font has loaded.  Clean things up and reset the timer
	                    profile.node.parentNode.removeChild(profile.node);
	                    profile.loaded = true;
	                    
	                    clearTimeout(timer);
	                    timer = setTimeout(showText, 500)
	                }
            	}
            }
            // Pass "true" so that we know the fail-safe timer didn't fire.'
            showText(true);
        }());
    }

    function showText(ev) {
        var loadedClass = '';
        // if no ev, the the fail-safe timer fired.  Remove the fonts
        clearTimeout(timer);
        
        if (!ev)
        	if( link.parentNode )
            	head.removeChild(link);
        else
        	loadedClass = 'fonts-loaded';

        // Set a class on the HTML tag to show the text.
        html.setAttribute('class', html.getAttribute('class').replace('fonts-loading', loadedClass));
        link = null;
    };

    // Set a class on the HTML tag while fonts are loading 
    // Use CSS to hide the text on the page
    html.setAttribute('class', html.getAttribute('class') + ' fonts-loader fonts-loading');

    // Mini DOM ready - https://github.com/DesignByOnyx/mini-domready
    if (!document[addEventListener])
        addEventListener = document[attachEvent] ?
            (readyEvent = 'onreadystatechange')
        // && (loadEvent = 'onload')
        && (removeEventListener = 'detachEvent') && attachEvent : '';

    (function domReady(f) {
        /in/.test(document.readyState) ? !addEventListener ?
            setTimeout(function () {
                domReady(f);
            }, 9) : document[addEventListener](readyEvent, f, false) : f();
    }(injectCss));
}(document, 'http://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700|Exo+2:400,500,700'));