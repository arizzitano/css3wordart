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
		this.selectedStyle = this.classes[0];
		this.el.style.display = 'block';
	};

	Gallery.prototype.close = function () {
		this.el.style.display = 'none';
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
		this.el.querySelector('textarea').value = this.defaultTxt;
		this.el.querySelector('textarea').select();
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

	function WordArt (p, s, t) {
		this.verticalStyles = ['basic-stack','brown-stack','green-stack','texture-stack','stack-3d'];
		this.parentObject = p;
		this.selectedStyle = s;
		this.txt = t;
		this.el = document.querySelector('.resize');
		this.bcr = this.el.querySelector('.stage').getBoundingClientRect();

		this.resizable = null;
		this.rcr = null;
		this.wordArtObj = null;
		this.wcr = null;

		this.position = {
			left: 0,
			top: 0
		};
		this.startPosition = {};

		this.size = {};
	}

	WordArt.prototype.init = function () {
		this.render();
		this.open();
		this.bindHandlers();
	};

	WordArt.prototype.render = function () {
		var self = this;
		var tmpl = self.el.querySelector('#finalWordart');
		var clone = tmpl.content.cloneNode(true);
		var wa = clone.querySelector('.wordart');
		var span = wa.querySelector('span');
		wa.className = wa.className + ' ' + self.selectedStyle;
		span.setAttribute('data-text', self.txt);
		span.innerHTML = self.txt;

		self.resizable = clone.querySelector('.resizable');
		self.wordArtObj = self.resizable.querySelector('.wordart');

		self.el.querySelector('.stage').appendChild(clone);
		setTimeout(function () {
			self.resize();
		}, 5);
	};

	WordArt.prototype.resize = function () {
		this.wcr = this.wordArtObj.getBoundingClientRect();
		this.rcr = this.resizable.getBoundingClientRect();
		this.size.width = (this.wcr.left - this.rcr.left) +
								this.wcr.width + 2;
		this.size.height = this.wcr.height + 2;
		this.rcr = this.resizable.getBoundingClientRect();
		this.bcr = this.el.querySelector('.stage').getBoundingClientRect();
	};

	WordArt.prototype.move = function (e) {
		var newY = parseFloat(this.position.top) + e.movementY;
		if (newY > -1 && (newY + this.rcr.height) < this.bcr.height) {
			this.position.top = newY;
		}
		this.position.left = parseFloat(this.position.left) + e.movementX;
	};

	WordArt.prototype.open = function () {
		this.el.style.display = 'block';
	};

	WordArt.prototype.bindHandlers = function () {
		var self = this;

		// event handlers
		self.wordArtObj.addEventListener('mousedown', function (e) {
			self.isDragging = true;
		});
		document.addEventListener('mouseup', function (e) {
			self.isDragging = false;
		});
		self.el.addEventListener('mousemove', function (e) {
			if (self.isDragging) {
				self.move(e);
			}
		});

		// size handlers
		Object.observe(self.size, function (changes) {
			changes.forEach(function (c) {
				self.resizable.style[c.name] = c.object[c.name] + 'px';
			});
		});
		Object.observe(self.position, function (changes) {
			changes.forEach(function (c) {
				self.resizable.style[c.name] = c.object[c.name] + 'px';
			});
		});
	};

	WordArt.prototype.close = function () {
		this.el.style.display = 'none';
		// destroy existing wordart objects
	};


	function WordArtMaker () {
		this.gallery = new Gallery(this);
		this.selectedStyle = null;
		this.editor = null;
		this.txt = null;
		this.wordArt = null;
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
		this.wordArt = new WordArt(this, this.selectedStyle, this.txt);
		this.wordArt.init();
	};

	document.addEventListener('DOMContentLoaded', function () {
		var w = new WordArtMaker();
		w.init();
	});
}());
