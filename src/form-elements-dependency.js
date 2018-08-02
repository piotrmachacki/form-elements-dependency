import $ from 'jquery';

$.fn.formElementsDependency = function(userOptions) {

	let opt = {};
	let elementsObj = {};

	const defaultOptions = {
		dependencyName: 'dependency',
		elementSeparator: ';',
		dataSeparator: ':',
		valueSeparator: '|',
		inactiveClassName: 'inactive',
		activeClassName: 'active',
		disableElement: false
	};

	opt = $.extend({}, defaultOptions, userOptions);

	return this.each(function(index, el) {

		let self = $(this);

		self.addClass(opt.inactiveClassName);

		let dependentString = $(el).data(opt.dependencyName);
		let elementsData = dependentString.split(opt.elementSeparator);

		$(elementsData).each(function(index, el) {
				
			let elementData = el.split(opt.dataSeparator);
			let element = elementData[0];
			let data = elementData[1];
			let values = data.split(opt.valueSeparator);

			elementsObj[element] = values;

			$(element).on('change keyup', function() {
				checkDependency(self);
			});

		});

		checkDependency(self);

	});

	function checkDependency(self) {

		let active = checkActive();

		self.toggleClass(opt.inactiveClassName, !active);
		self.toggleClass(opt.activeClassName, active);

		if(opt.disableElement) self.prop('disabled', !active);

	}

	function checkActive() {
		let active = false;

		$.each(elementsObj, function(index, values) {
			let value = $(index).val();
			if(Array.isArray(value)) {
				$(value).each(function(index, val) {
					if(checkValues(values, val)) active = true;
				});
			} else {
				if(checkValues(values, value)) active = true;
			}
		});

		return active;
	}

	function checkValues(values, value) {
		if(value && values.includes('*')) {
			return true;
		} else if(values.includes(value)) {
			return true;
		}
		return false;
	}

};