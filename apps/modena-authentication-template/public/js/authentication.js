$(function() {
	var authenticationListeners = [];
	window.application = window.application || {};
	window.application.authentication = window.application.authentication || {};
	window.application.authentication.subscribe = function(listener) {
		if (typeof listener === "function") {
			authenticationListeners.push(listener);
		}
	};
	window.application.authentication.pageLoad = pageLoad;

	function authenticationHandler(user) {
		$('#error-msg').addClass('hidden');
		if (user) {
			$('#logged-username').html(user.username);
			$('#login-form').addClass('hidden');
			$('#user-wrapper').removeClass('hidden');
		}
		else {
			$('#logged-username').html('-');
			$('#login-form').removeClass('hidden');
			$('#user-wrapper').addClass('hidden');
		}

		for(var key in authenticationListeners) {
			var listener = authenticationListeners[key];
			listener(user);
		}
	}

	function bindLoginForm(permissions) {
		$('#log-in').on('click', function() {
			$.ajax({
				method: 'POST',
				url: '/modena-authentication-template/log-in',
				contentType: 'application/json',
				data: JSON.stringify({
					username: $('#username').val(),
					password: $('#password').val(),
					permissions: permissions
				})
			})
			.then(authenticationHandler)
			.fail(window.application.ajaxFailHandler);
		});

		$('#log-out').on('click', function() {
			$.ajax({
				method: 'POST',
				url: '/modena-authentication-template/log-out'
			})
			.then(function() {
				authenticationHandler(null);
			})
			.fail(window.application.ajaxFailHandler);
		});
	}

	function pageLoad(permissions) {
		permissions = permissions || [];
		bindLoginForm(permissions);
		return $.ajax({
			method: 'GET',
			url: '/modena-authentication-template/client-side',
			dataType: 'json',
			data: {
				permissions: permissions
			}
		})
		.then(function (clientData) {
			window.application.clientData = clientData;
			authenticationHandler(clientData.user);
		});
	}
});