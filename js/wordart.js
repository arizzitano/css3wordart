(function () {
    var CLASSES = [
        'outline','up','arc','squeeze','inverted-arc','basic-stack',
        'italic-outline','slate','mauve','graydient','red-blue','brown-stack',
        'radial','purple','green-marble','rainbow','aqua','texture-stack',
        'paper-bag','sunset','tilt','blues','yellow-dash','green-stack',
        'chrome','marble-slab','gray-block','superhero','horizon','stack-3d'
    ];
    var BG_SPEED = 3;

    function Gallery (p) {
        this.el = document.querySelector('.gallery');
        this.parentObject = p;
        this.wordArtObj = null;
        this.selectedStyle = CLASSES[0];
    }

    Gallery.prototype.render = function () {
        var self = this;
        var target = self.el.querySelector('#galleryThumbs');
        var template = self.el.querySelector('#galleryTemplate');
        var stacked = self.el.querySelector('#galleryStackedTemplate');
        CLASSES.forEach(function (c, i) {
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
        this.selectedStyle = CLASSES[0];
        this.wordArtObj = w;
        this.el.style.display = 'block';
    };

    Gallery.prototype.close = function () {
        this.el.style.display = 'none';
        this.wordArtObj = null;
    };

    Gallery.prototype.bindHandlers = function () {
        var self = this;
        self.el.querySelector('button.ok').addEventListener('click', function () {
            self.wordArtObj.setStyle(self.selectedStyle);
            self.close();
            self.parentObject.launchEditor();
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
        this.wordArtObj = null;
    };

    Editor.prototype.bindHandlers = function () {
        var self = this;
        self.el.querySelector('button.ok').addEventListener('click', function () {
            var txt = self.el.querySelector('textarea').value.trim() || this.defaultText();
            self.wordArtObj.setText(txt);
            self.close();
            self.parentObject.displayWordArt();
        });
        self.el.querySelector('button.cancel').addEventListener('click', function () {
            self.close();
        });
    };




    function Stage (p) {
        this.parentObject = p;
        this.el = document.querySelector('.stage');
        this.scr = null;
    }

    Stage.prototype.init = function () {
        this.open();
        this.bindHandlers();
    };

    Stage.prototype.open = function () {
        this.el.style.display = 'block';
        this.scr = this.el.querySelector('.stage').getBoundingClientRect();
    };

    Stage.prototype.bindHandlers = function () {
        var self = this;
        self.el.querySelector('.create').addEventListener('click', function () {
            self.parentObject.makeNewWordArt();
        });
    };




    function Background (p) {
        this.parentObject = p;
        this.el = document.querySelector('.background');
        this.bcr = this.el.getBoundingClientRect();
    }

    Background.prototype.init = function () {
        this.bindHandlers();
        for (var i=0; i<CLASSES.length; i++) {
            var bgw = new BgWordArt(this, CLASSES[i]);
            bgw.init();
            this.el.appendChild(bgw.el);
            bgw.startAnimation();
        }
    };

    Background.prototype.bindHandlers = function () {
        var self = this;
        window.addEventListener('resize', function (event) {
            self.bcr = self.el.getBoundingClientRect();
        });
    };



    function BgWordArt (p, c) {
        this.parentObject = p;
        this.selectedClass = c;
        this.tmpl = document.querySelector('#bgWordart');
        this.el = null;
        this.bcr = null;
        this.position = {};
        this.speed = {
            x: 5 + Math.random() * 3,
            y: 5 + Math.random() * 3
        }
        this.dir = {};
        this.t = null;
    }

    BgWordArt.prototype.init = function () {
        this.render();
        this.bindHandlers();
    };

    BgWordArt.prototype.render = function () {
        var fontSize = 40 + (Math.random() * 30);
        var clone = this.tmpl.content.cloneNode(true);
        var wa = clone.querySelector('.wordart');
        wa.className = wa.className + ' ' + this.selectedClass;
        wa.style.fontSize = fontSize + 'px';
        this.el = wa;
    };

    BgWordArt.prototype.availSize = function (dimension) {
        return this.parentObject.bcr[dimension] - this.bcr[dimension];
    };

    BgWordArt.prototype.startAnimation = function () {
        var self = this;
        this.bcr = this.el.getBoundingClientRect();
        this.position.left = Math.random() * this.availSize('width');
        this.position.top = Math.random() * this.availSize('height');
        this.dir.x = (Math.random() * 2) - 1;
        this.dir.y = (Math.random() * 2) - 1;
        this.startTimer();
    };

    BgWordArt.prototype.startTimer = function () {
        var self = this;
        self.i = setTimeout(function () {
            self.animate();
        }, 50);
    };

    BgWordArt.prototype.animate = function () {
        var newLeft = this.position.left + (this.dir.x * this.speed.x);
        if (this.position.left > 0 && this.position.left < this.availSize('width')) {
            this.position.left = newLeft;
        } else {
            this.dir.x = -this.dir.x;
            this.position.left = this.position.left + (this.dir.x * this.speed.x);
        }
        var newTop = this.position.top + (this.dir.y * this.speed.y);
        if (this.position.top > 0 && this.position.top < this.availSize('height')) {
            this.position.top = newTop;
        } else {
            this.dir.y = -this.dir.y;
            this.position.top = this.position.top + (this.dir.y * this.speed.y);
        }
        this.startTimer();
    };

    BgWordArt.prototype.bindHandlers = function () {
        var self = this;
        Object.observe(self.position, function (changes) {
            changes.forEach(function (c) {
                self.el.style[c.name] = c.object[c.name] + 'px';
            });
        });
    };




    function WordArt (p, s) {
        this.verticalStyles = ['basic-stack','brown-stack','green-stack','texture-stack','stack-3d'];
        this.parentObject = p;
        this.el = document.querySelector('.stage');
        this.stage = s;

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
    };

    WordArt.prototype.move = function (e) {
        var newY = parseFloat(this.position.top) + e.movementY;
        if (newY > -1 && (newY + this.rcr.height) < this.stage.scr.height) {
            this.position.top = newY;
        }
        var newX = parseFloat(this.position.left) + e.movementX;
        if (newX > -1 && (newX + this.rcr.width) < this.stage.scr.width) {
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
                if ((newPos + newSize) < self.stage.scr[args.sizeProp] && newPos > -1) {
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
    };




    function WordArtMaker () {
        this.background = new Background(this);
        this.gallery = new Gallery(this);
        this.editor = new Editor(this);
        this.stage = new Stage(this);

        this.wordArt = null;
        this.wordArts = [];

        this.background.init(this);
        this.bindHandlers();
    }

    WordArtMaker.prototype.init = function () {
        this.gallery.init(this);
        this.editor.init(this);
        this.stage.init(this);
    };

    WordArtMaker.prototype.makeNewWordArt = function () {
        var w = new WordArt(this, this.stage);
        this.wordArts.push(w);
        this.gallery.open(w);
    };

    WordArtMaker.prototype.launchEditor = function () {
        this.editor.open(this.wordArts[this.wordArts.length - 1]);
    };

    WordArtMaker.prototype.displayWordArt = function () {
        this.stage.open();
        this.wordArts[this.wordArts.length - 1].init();
    };

    WordArtMaker.prototype.bindHandlers = function () {
        var self = this;
        document.querySelectorAll('.welcome button').forEach(button => button.addEventListener('click', function () {
            document.querySelector('.welcome').style.display = 'none';
            self.init();
            self.makeNewWordArt();
        }));
    };

    document.addEventListener('DOMContentLoaded', function () {
        var w = new WordArtMaker();
    });
}());
