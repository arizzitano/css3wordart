(function () {
	function Gallery (p) {
		this.parentObject = p;
		this.classes = [
			'outline','up','arc','squeeze','inverted-arc','basic-stack',
			'italic-outline','slate','mauve','graydient','red-blue','brown-stack',
			'radial','purple','green-marble','rainbow','aqua','texture-stack',
			'paper-bag','sunset','tilt','blues','yellow-dash','green-stack',
			'chrome','marble-slab','gray-block','superhero','horizon','stack-3d'
		];
		this.selectedStyle = this.classes[0];
	}

	Gallery.prototype.render = function () {
		var self = this;
		var target = document.querySelector('#galleryThumbs');
		var template = document.querySelector('#galleryTemplate');
		var stacked = document.querySelector('#galleryStackedTemplate');
		this.classes.forEach(function (c, i) {
			var tmpl = ((i+1) % 6 === 0) ? stacked : template;
			var clone = tmpl.content.cloneNode(true);
			var li = clone.querySelector('li');
			li.setAttribute('data-style', c);
			[].forEach.call(li.querySelectorAll('.wordart'), function (n) {
				n.className = n.className + ' ' + c;
			});
			li.addEventListener('click', function (e) {
				self.selectStyle(c, this);
			});
			target.appendChild(clone);
		});
	};

	Gallery.prototype.selectStyle = function (style, el) {
		this.selectedStyle = style;
		var currSelected = el.parentNode.querySelector('.selected');
		if (currSelected != null) {
			currSelected.className = currSelected.className.replace('selected', '');
		}
		el.className = el.className + ' selected';
	};

	Gallery.prototype.bindHandlers = function () {

	};

	Gallery.prototype.init = function () {
		this.render();
		this.bindHandlers();
	};

	function Editor (s) {
		this.selectedStyle = s;
	}

	function WordArtMaker () {
		this.gallery = new Gallery();
		this.editor = null;
		this.text = null;
	}

	WordArtMaker.prototype.init = function () {
		this.gallery.init();
	};

	WordArtMaker.prototype.launchEditor = function (selectedStyle) {
		this.editor = new Editor(selectedStyle);
	};

	document.addEventListener('DOMContentLoaded', function () {
		var w = new WordArtMaker();
		w.init();
	});
}());
