/**
 * Created by Antonio Altamura on 29/06/2017.
 */
"use strict";


let Core = {
		restRequest : function(params){
			$.get( "/api", {q:params}, function(res) {

				console.log(res);
			})
			.fail(function() {
			});
		}
};
Core.restRequest("metallica");