/*!
 * Form Elements Dependency (v1.0.0)
 * @copyright 2018 Piotr Machacki <piotr@machacki.pl>
 * @licence Apache License, Version 2.0
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('jquery')) :
	typeof define === 'function' && define.amd ? define(['jquery'], factory) :
	(factory(global.jQuery));
}(this, (function ($) { 'use strict';

	$ = $ && $.hasOwnProperty('default') ? $['default'] : $;

	$.fn.formElementsDependency = function (userOptions) {

		var opt = {};
		var elementsObj = {};

		var defaultOptions = {
			dependencyName: 'dependency',
			elementSeparator: ';',
			dataSeparator: ':',
			valueSeparator: '|',
			inactiveClassName: 'inactive',
			activeClassName: 'active',
			disableElement: false
		};

		opt = $.extend({}, defaultOptions, userOptions);

		return this.each(function (index, el) {

			var self = $(this);

			self.addClass(opt.inactiveClassName);

			var dependentString = $(el).data(opt.dependencyName);
			var elementsData = dependentString.split(opt.elementSeparator);

			$(elementsData).each(function (index, el) {

				var elementData = el.split(opt.dataSeparator);
				var element = elementData[0];
				var data = elementData[1];
				var values = data.split(opt.valueSeparator);

				elementsObj[element] = values;

				$(element).on('change keyup', function () {
					checkDependency(self);
				});
			});

			checkDependency(self);
		});

		function checkDependency(self) {

			var active = checkActive();

			self.toggleClass(opt.inactiveClassName, !active);
			self.toggleClass(opt.activeClassName, active);

			if (opt.disableElement) self.prop('disabled', !active);
		}

		function checkActive() {
			var active = false;

			$.each(elementsObj, function (index, values) {
				var value = $(index).val();
				if (Array.isArray(value)) {
					$(value).each(function (index, val) {
						if (checkValues(values, val)) active = true;
					});
				} else {
					if (checkValues(values, value)) active = true;
				}
			});

			return active;
		}

		function checkValues(values, value) {
			if (value && values.includes('*')) {
				return true;
			} else if (values.includes(value)) {
				return true;
			}
			return false;
		}
	};

})));
//# sourceMappingURL=form-elements-dependency.js.map
