(function () {
	function Gallery (p) {
		this.el = document.querySelector('.gallery');
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
		var target = self.el.querySelector('#galleryThumbs');
		var template = self.el.querySelector('#galleryTemplate');
		var stacked = self.el.querySelector('#galleryStackedTemplate');
		self.classes.forEach(function (c, i) {
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

	Gallery.prototype.open = function () {
		this.el.style.display = 'block';
	};

	Gallery.prototype.close = function () {
		this.el.style.display = 'none';
		this.selectedStyle = this.classes[0];
	};

	Gallery.prototype.bindHandlers = function () {
		var self = this;
		self.el.querySelector('button.ok').addEventListener('click', function () {
			self.close();
			self.parentObject.launchEditor(self.selectedStyle);
		});
		self.el.querySelector('button.cancel').addEventListener('click', function () {
			self.close();
		});
	};

	Gallery.prototype.init = function () {
		this.render();
		this.open();
		this.bindHandlers();
	};




	function Editor (p) {
		this.parentObject = p;
		this.el = document.querySelector('.editor');
		this.defaultTxt = 'Your Text Here';
	}

	Editor.prototype.init = function () {
		this.open();
		this.bindHandlers();
	};

	Editor.prototype.open = function () {
		this.el.style.display = 'block';
	};

	Editor.prototype.close = function () {
		this.el.style.display = 'none';
	};

	Editor.prototype.bindHandlers = function () {
		var self = this;
		self.el.querySelector('button.ok').addEventListener('click', function () {
			self.close();
			var txt = self.el.querySelector('textarea').value.trim() || this.defaultText();
			self.parentObject.displayWordArt(txt);
		});
		self.el.querySelector('button.cancel').addEventListener('click', function () {
			self.close();
		});
	};



	function WordArtMaker () {
		this.gallery = new Gallery(this);
		this.selectedStyle = null;
		this.editor = null;
		this.txt = null;
	}

	WordArtMaker.prototype.init = function () {
		this.gallery.init();
	};

	WordArtMaker.prototype.launchEditor = function (selectedStyle) {
		this.editor = new Editor(this);
		this.selectedStyle = selectedStyle;
		this.editor.init();
	};

	WordArtMaker.prototype.displayWordArt = function (txt) {
		this.txt = txt;
		console.log(this.txt);
		console.log(this.selectedStyle);
	};

	document.addEventListener('DOMContentLoaded', function () {
		var w = new WordArtMaker();
		w.init();
	});
}());
