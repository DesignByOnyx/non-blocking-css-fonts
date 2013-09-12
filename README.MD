#Non-Blocking CSS Fonts#

This plugin was created to allow for quicker loading webpages while still enjoying all of the benefits of web fonts.  You will need the following CSS styles in order for this to work properly.

```
/* 
Replace these with your own selectors.  Be sure to keep the .fonts-loading and .fonts-loaded at the front. The goal here is to hide the text but show any structural elements, backgrounds, borders, etc.
*/

html.fonts-loading .header nav,
html.fonts-loading .main .content,
html.fonts-loading .footer .content {
	-webkit-backface-visibility: hidden;
	opacity: 1;
	
  -webkit-transition: all 0.3s ease-out .2s; 
     -moz-transition: all 0.3s ease-out .2s; 
       -o-transition: all 0.3s ease-out .2s; 
          transition: all 0.3s ease-out .2s; 

}

html.fonts-loading .header nav,
html.fonts-loading .main .content,
html.fonts-loading .footer .content {
	opacity: 1;
}
```

**Only a few things you need to know**

- Your `@font-face` styles should be separate from all other styles (this is just general good practice)
- Remove any existing `<link>` tags which are currently loading your font stylesheets... but save the URL!
- Replace the long string at the bottom of this code with the URL to your CSS fonts file
- Place this code in the `<head>` of your document - **it MUST go in the `<head>`**
    - you can paste it right in 
    - ...or you can load it via a `<script>` tag.  I personally load Modernizr in the `<head>`, so I just include this inside my Modernizr file.
- This code MUST go in the `<head>` of your document!

##Why did I build this?##

I was developing a site on my local machine and became frustrated when my spotty internet connection prevented my site from loading - I just had a blank page for about 10 seconds and then the site came up without any fonts.  The culprit was the fact that I was using remotely hosted fonts with no fallback.  I was even inserting the `<link>` tags with javascript... which I thought was "asynchronous".

I set out to solve this problem once and for all - I should be able to develop locally without an internet connection and without having to go comment out any references to remote files.  I know I can host my own fonts as a fallback... but that's a pain! 

So I began delaying the CSS fonts little by little until my page came back up.  What I discovered was that any `<link>` tags which are inserted ***before*** DOMContentLoaded will block the critical rendering path (DOMContentLoaded = document.ready for you jQuery people).

This blocking is not so bad when there is absolutely no internet connection - it just fails immediately and the page moves on. But when the interwebs is slow, it's extremely bad - 10s page load times even on a local server.

##So how does it work?##

Well, we just wait until the DOM is ready before loading our CSS fonts.

##But isn't that <abbr title="Flash Of Unstyled Content">FOUC'd</abbr> up?##

In order to prevent any flashing of unstyled content, we hide our text until the fonts have loaded.  If the fonts haven't loaded after a certain amount of time (~600ms), we cancel the font loading and display the text as is... without any custom fonts.  Feel free to adjust this time to suit your needs.  I highly recommend not going over 1000ms.

###The possibility of no fonts just caused my designer's head to explode###

Well, you can explain to him how a fast-loading not-as-pretty-as-you-want page is way better than a very-slow-but-pretty page.  You can show him [real data](http://www.youtube.com/watch?v=Il4swGfTOSM&feature=player_detailpage#t=212) to support your cause.  Tissues are handy for these types of conversations.  Alos, try increasing the  fail-safe timeout until he's happy.

##Some handy information##

So sometimes we will start loading the CSS file but our fail-safe timer will fire before it's done.  At this point, we will REMOVE the injected `<link>` tag and display a page without any custom fonts.  However, the CSS file should still finish loading in the background.  If your caching is right, then every subsequent page view should have the nice and pretty fonts.