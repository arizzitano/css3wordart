CSS3 WordArt
============

1990s MS WordArt. In CSS3.

View a demo at http://arizzitano.github.io/css3wordart. Note: it's not completely done yet.

### WHAT

WordArt was a feature in older versions of Microsoft Office that generated stylized text. Its wide availability and user-friendliness led to broad use (and abuse) in signage, logos, and presentations. The unique presets are immediately recognizable typographic relics of the late 90s/early 00s. CSS3 WordArt allows users to generate and modify WordArt-like text styled with CSS3.

CSS3 WordArt is an experimental project developed entirely in Chrome. Any working functionality in other browsers is purely coincidental.

### HOW

I recreated as much of the original WordArt styles as possible using only CSS (LESS, to make things a little more DRY). I harvested source images (available for your perusal in /reference) from the actual WordArt creation interface in a copy of MS Word I ran in a Windows 95 VM. Both pieces of software came from completely legitimate sources, which is obviously why the screenshots are all in Italian. I used the original colors and background tiles, so it's as close as possible as you can get to real WordArt.

**CSS**

You might notice that my recreation isn't entirely true to the original. The one thing I couldn't quite reproduce (programmatically, at least) entirely with CSS were curved baselines and bounding boxes. Since CSS3 doesn't support bezier transforms on bounding box edges, I was not able to capture the arched, pinched, wavy, or swoosh shapes applied to some of the WordArt presets. I could probably have done it by applying individual classes to each letter and then applying specific transforms to each one, but that's janky, gross, and unsemantic, and besides, the point of the project was to just do it with CSS.

CSS3 WordArt will only work in webkit browsers. The primary thing that allows it to work properly is `-webkit-background-clip: text;` which enables the gradient and image backgrounds directly on text. FF doesn't support this property, so it's pretty broken there. Without the gradient and image backgrounds, the styles look a whole lot less like actual WordArt, so I just didn't bother. Apparently there's a way to get around this using SVG, which I'll look into eventually.

**JS**

I reproduced most of the WordArt creation interface in addition to the styles, so you can get the full experience. It uses fairly minimal JS that I wrote from scratch. No libraries. I'd call it vanilla, but there's a fair amount of kink involved. I used Gulp as a build tool, then Gulp became un-trendy. C'est la vie.

### WHY

WordArt is lovably tacky. Like [Comic Sans](http://www.comicsanscriminal.com/) or [Screen Beans](http://www.bitbetter.com/), unmodified WordArt presets are generally associated with technical and design ineptitude. What better way to exercise one's technical and design muscles than by paying tribute to this antithesis of modern trendiness?

tl;dr: 90s fever, baby. [It's so uncool it's cool again.](http://www.shopjeen.com/products/windows-95-backpack)

### WHO

My name is [Ari](http://twitter.com/arizzitano), I'm a [frontend engineer](http://arizzitano.com), and I'm currently looking for a job. [Get at me](mailto:arizzitano@gmail.com).
