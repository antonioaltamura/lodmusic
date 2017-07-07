/**
 * Created by Antonio Altamura on 08/07/2017.
 */
"use strict";

$.fn.LodTags = function(resource) {
	var b = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.obj.whitespace('text'),
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		remote: {
			url: '/api/autocomplete/'+resource+'?name=%QUERY',
			wildcard: '%QUERY'
		}
	});
	b.initialize();
	this.tagsinput({
		itemValue: 'uri',
		itemText: 'name',
		typeaheadjs: {
			name: resource,
			displayKey: 'name',
			source: b.ttAdapter()
		}
	});
	return this;
}