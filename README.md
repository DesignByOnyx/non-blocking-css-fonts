#Non-Blocking CSS Fonts#

This plugin was created to allow for quicker loading webpages while still enjoying all of the benefits of web fonts.  You will need the CSS styles in order for this to work properly.

**You can read about it soon on my upcoming blog.**

##Initial setup

- Your `@font-face` styles should be separate from all other styles (this is just general good practice)
- Remove any existing `<link>` tags which are currently loading your font stylesheets... but save the URL!
- Replace the long string at the bottom of this code with the URL to your CSS fonts file
- Place this code in the `<head>` of your document - **it MUST go in the `<head>`**
    - you can paste it right in 
    - ...or you can load it via a `<script>` tag.  I personally load Modernizr in the `<head>`, so I just include this inside my Modernizr file.
- This code MUST go in the `<head>` of your document!

##How does it work?

We wait until the DOM is ready before loading our CSS fonts.  

###But doesn't that cause FOUT?

In order to prevent any flashing of unstyled content, we hide our text until the fonts have loaded.  I **highly recommend** showing as **much** as you can while hiding the text (show any backgrounds, borders, logos, structural styles).  This gives the *feeling* of a faster loading page - much better than a blank white page.  

##Some handy information

1. If the fonts take longer than ~500ms to load, we cancel the font loading (by removing the `<link>` tag we inserted) and display the page without any custom fonts.  This seeks to keep the user from waiting for content.  Feel free to adjust this "fail-safe" timeout to suit your needs.  I recommend not going much over 1000ms.  Remember, we are trying to stay fast.  
**NOTE:** The CSS file should continue to load in the background.  If your caching is right, then all subsequent page views will load the CSS from cache.

2. Once the CSS file has loaded, the browser still needs to download the actual font files (.woff, .ttf, etc).  The only *accurate* way to know when these files have truly finished loading is to wait for the `window.load` event to fire, but this means we are also waiting for every `object`, `img`, and `script` tag to finish loading before we show any text - this is BAD UX.  Instead, we estimate the time it should take for the font files to load (in my tests, ~100ms for google fonts) and then show the text.  HOWEVER, this ***can*** result in FOUT when the internet is slow.  Feel free to adjust this timeout to suit your needs.  You should also check out [this really cool solution on Stack Overflow](http://stackoverflow.com/questions/4383226/using-jquery-to-know-when-font-face-fonts-are-loaded#answer-11689060), which may eventually make it's way into this library.
