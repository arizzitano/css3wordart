(function () {
	function Gallery (p) {
		this.el = document.querySelector('.gallery');
		this.parentObject = p;
		this.wordArtObj = null;
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

	Gallery.prototype.open = function (w) {
		this.selectedStyle = this.classes[0];
		this.wordArtObj = w;
		this.el.style.display = 'block';
	};

	Gallery.prototype.close = function () {
		this.el.style.display = 'none';
	};

	Gallery.prototype.bindHandlers = function () {
		var self = this;
		self.el.querySelector('button.ok').addEventListener('click', function () {
			self.close();
			self.wordArtObj.setStyle(self.selectedStyle);
			self.parentObject.launchEditor();
			//self.parentObject.launchEditor(self.selectedStyle);
		});
		self.el.querySelector('button.cancel').addEventListener('click', function () {
			self.close();
		});
	};

	Gallery.prototype.init = function () {
		this.render();
		this.bindHandlers();
	};




	function Editor (p) {
		this.parentObject = p;
		this.wordArtObj = null;
		this.el = document.querySelector('.editor');
		this.defaultTxt = 'Your Text Here';
	}

	Editor.prototype.init = function () {
		this.bindHandlers();
	};

	Editor.prototype.open = function (w) {
		this.wordArtObj = w;
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
			self.wordArtObj.setText(txt);
			self.parentObject.displayWordArt();
		});
		self.el.querySelector('button.cancel').addEventListener('click', function () {
			self.close();
		});
	};

	function WordArt (p, s, t) {
		this.verticalStyles = ['basic-stack','brown-stack','green-stack','texture-stack','stack-3d'];
		this.parentObject = p;
		this.el = document.querySelector('.resize');
		this.scr = this.el.querySelector('.stage').getBoundingClientRect();

		this.selectedStyle, this.txt;

		this.resizable = null;
		this.rcr = null;
		this.wordArtObj = null;
		this.wcr = null;
		this.handles = null;

		this.isDragging = false;
		this.isResizing = false;
		this.resizeHandle = null;

		this.position = {
			left: 0,
			top: 0,
			width: null,
			height: null
		};

		this.rescale = {
			scale: {
				scaleX: 1,
				scaleY: 1
			},
			size: {
				height: null,
				width: null
			}
		};
	}

	WordArt.prototype.setStyle = function (style) {
		this.selectedStyle = style;
	};

	WordArt.prototype.setText = function (txt) {
		this.txt = txt;
	};

	WordArt.prototype.init = function () {
		this.genDeltas();
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
		self.handles = self.resizable.querySelectorAll('.h');

		self.el.querySelector('.stage').appendChild(clone);
		setTimeout(function () {
			self.initSize();
		}, 5);
	};

	WordArt.prototype.initSize = function () {
		this.wcr = this.wordArtObj.getBoundingClientRect();
		this.rcr = this.resizable.getBoundingClientRect();
		this.position.width = (this.wcr.left - this.rcr.left) +
								this.wcr.width + 2;
		this.position.height = this.wcr.height + 2;
		this.rescale.size.height = this.position.height;
		this.rescale.size.width = this.position.width;
		this.rcr = this.resizable.getBoundingClientRect();
		this.scr = this.el.querySelector('.stage').getBoundingClientRect();
	};

	WordArt.prototype.move = function (e) {
		var newY = parseFloat(this.position.top) + e.movementY;
		if (newY > -1 && (newY + this.rcr.height) < this.scr.height) {
			this.position.top = newY;
		}
		var newX = parseFloat(this.position.left) + e.movementX;
		if (newX > -1 && (newX + this.rcr.width) < this.scr.width) {
			this.position.left = newX;
		}
	};

	WordArt.prototype.genDeltas = function () {
		var self = this;
		[{
			sizeProp: 'width',
			posProp: 'left',
			axis: 'x',
			edgeClass: 'w'
		}, {
			sizeProp: 'height',
			posProp: 'top',
			axis: 'y',
			edgeClass: 'n'
		}].forEach(function (args) {
			self['scale' + args.axis] = function (change) {
				var self = this;
				var classes = self.resizeHandle.className;
				var delta = change;
				var posDelta = 0;
				if (classes.indexOf((args.axis + 'c')) > -1) {
					delta = 0;
				} else if (classes.indexOf(args.edgeClass) > -1) {
					posDelta = delta;
					delta = -delta;
				}
				var newSize = self.rescale.size[args.sizeProp] + delta;
				var newPos = self.position[args.posProp] + posDelta;
				if ((newPos + newSize) < self.scr[args.sizeProp] && newPos > -1) {
					self.position[args.posProp] = newPos;
					self.rescale.size[args.sizeProp] = newSize;
				}
			};
		});
	};

	WordArt.prototype.resize = function (e) {
		this.scalex(e.movementX);
		this.scaley(e.movementY);
		this.rcr = this.resizable.getBoundingClientRect();
	}

	WordArt.prototype.open = function () {
		this.el.style.display = 'block';
	};

	WordArt.prototype.bindHandlers = function () {
		var self = this;

		// dragging
		self.wordArtObj.addEventListener('mousedown', function (e) {
			self.isDragging = true;
		});
		document.addEventListener('mouseup', function (e) {
			self.isDragging = false;
			self.isResizing = false;
			self.resizeHandle = null;
		});
		self.el.addEventListener('mousemove', function (e) {
			if (self.isDragging) {
				self.move(e);
			} else if (self.isResizing) {
				self.resize(e);
			}
		});

		// resizing
		[].forEach.call(self.handles, function (el) {
			el.addEventListener('mousedown', function (e) {
				self.isResizing = true;
				self.resizeHandle = e.target;
			});
		});

		// data change handlers
		Object.observe(self.position, function (changes) {
			changes.forEach(function (c) {
				self.resizable.style[c.name] = c.object[c.name] + 'px';
			});
		});
		Object.observe(self.rescale.size, function (changes) {
			changes.forEach(function (c) {
				self.rescale.scale.scaleY = c.object.height / self.position.height;
				self.rescale.scale.scaleX = c.object.width / self.position.width;
			});
		});
		Object.observe(self.rescale.scale, function (changes) {
			changes.forEach(function (c) {
				['transform','-webkit-transform','-moz-transform',
				'-o-transform','-ms-transform'].forEach(function (prop) {
					self.resizable.style[prop] = 'scaleX(' +
											c.object.scaleX + ') ' +
											'scaleY(' + c.object.scaleY + ')';
				});
			});
		});
	};

	WordArt.prototype.close = function () {
		this.el.style.display = 'none';
		// destroy existing wordart objects
	};


	function WordArtMaker () {
		this.gallery = new Gallery(this);
		this.editor = new Editor(this);
		this.selectedStyle = null;
		this.txt = null;
		this.wordArt = null;
		this.wordArts = [];
	}

	WordArtMaker.prototype.init = function () {
		this.gallery.init(this);
		this.editor.init(this);
		//this.stage.init();
	};

	WordArtMaker.prototype.makeNewWordArt = function () {
		var w = new WordArt(this);
		this.wordArts.push(w);
		this.gallery.open(w);
	};

	WordArtMaker.prototype.launchEditor = function () {
		this.editor.open(this.wordArts[this.wordArts.length - 1]);
	};

	WordArtMaker.prototype.displayWordArt = function () {
		this.wordArts[this.wordArts.length - 1].init();
	};

	document.addEventListener('DOMContentLoaded', function () {
		var w = new WordArtMaker();
		w.init();
		w.makeNewWordArt();
	});
}());
