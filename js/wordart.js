(function () {
	function Gallery () {
		this.classes = [
			'outline','up','arc','squeeze','inverted-arc','basic-stack',
			'italic-outline','slate','mauve','graydient','red-blue','brown-stack',
			'radial','purple','green-marble','rainbow','aqua','texture-stack',
			'paper-bag','sunset','tilt','blues','yellow-dash','green-stack',
			'chrome','marble-slab','gray-block','superhero','horizon','stack-3d'
		];
	}

	Gallery.prototype.render = function () {
		var target = document.querySelector('#galleryThumbs');
		var template = document.querySelector('#galleryTemplate');
		var stacked = document.querySelector('#galleryStackedTemplate');
		this.classes.forEach(function (c, i) {
			var tmpl = template;
			if ((i+1) % 6 === 0) {
				tmpl = stacked;
			}
			var clone = document.importNode(tmpl.content, true);
			[].forEach.call(clone.querySelectorAll('.wordart'), function (n) {
				n.className = n.className + ' ' + c;
			});
			target.appendChild(clone);
		});
	};

	Gallery.prototype.init = function () {
		this.render();
		// this.bindHandlers();
	};

	document.addEventListener('DOMContentLoaded', function () {
		var g = new Gallery();
		g.init();
	});
}());
