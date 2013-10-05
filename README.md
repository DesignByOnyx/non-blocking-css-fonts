#Non-Blocking CSS Fonts#

**NOTE: This branch includes some extra code to determine when the font files have finished loading.  The code was inspired by [this Stack Overflow answer](http://stackoverflow.com/questions/4383226/using-jquery-to-know-when-font-face-fonts-are-loaded#answer-11689060).**

This plugin was created to allow for quicker loading webpages while still enjoying all of the benefits of web fonts.  For example, the [Google font loader](http://ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js) is 17K (7K gzip) while this is less than 1K.

**You can read about it soon on my upcoming blog.**

##Setup

- Your `@font-face` styles should be separate from all other styles (this is just general good practice).
- Remove any existing `<link>` tags which are currently loading your font stylesheets.
- Place this javascript in the `<head>` of your document - **it MUST go in the `<head>`**
- Replace the long string at the bottom of this code with the URL to your CSS fonts file

##How does it work?

We wait until the DOM is ready before loading the CSS fonts.  

###But doesn't that cause FOUT?

In order to prevent any flashing of unstyled text, we hide our text until the fonts have loaded.  I highly recommend **showing as much as you can** while hiding the text (show any backgrounds, borders, logos, structural styles, etc).  This gives the *feeling* of a faster loading page - much better than a blank white page.  

##Some handy information

1. If the fonts take longer than ~500ms to load, we cancel the font loading (by removing the `<link>` tag we inserted) which causes the page to render without any custom fonts.  This seeks to keep the user from waiting for content.  Feel free to adjust this "fail-safe" timeout to suit your needs.  I recommend not going much over 1000ms.  Remember, we are trying to stay fast.  
**NOTE:** The CSS file should continue to load in the background.  If your caching is right, then all subsequent page views will load the CSS from cache.