$(function() {	
	var elementWrapper = $('#element-wrapper');
	var elementId = elementWrapper.data('element-id');
	var elementName = $('#element-name');
	var actionButton = $('#action-button');
	var unauthorizedMsg = $('#unauthorized-msg');

	if (elementId && elementId != '') {
		updatePageLoad();
	}
	else {
		createPageLoad();
	}

	function createPageLoad() {
		actionButton.on('click', function() {
			$.ajax({
				method: 'POST',
				url: '/modena-authentication-template/api/ying',
				contentType: 'application/json',
				data: JSON.stringify({
					name: elementName.val()
				})
			})
			.then(function (element) {
				document.location.href = '/modena-authentication-template/ying/details?id=' + element.id;
			})
			.fail(window.application.ajaxFailHandler);
		});

		window.application.authentication.subscribe(function(user) {
			elementWrapper.addClass('hidden');
			actionButton.addClass('hidden');
			unauthorizedMsg.addClass('hidden');

			if (user && window.application.userHasPermission(user, 'ying:create')) {
				elementWrapper.removeClass('hidden');
				actionButton.removeClass('hidden');
			}
			else {
				unauthorizedMsg.removeClass('hidden');
			}
		});
		window.application.authentication.pageLoad(['ying:create']);
	}

	function updatePageLoad() {
		actionButton.on('click', function() {
			$.ajax({
				method: 'PUT',
				url: '/modena-authentication-template/api/ying',
				contentType: 'application/json',
				data: JSON.stringify({
					id: elementId,
					name: elementName.val()
				})
			})
			.then(function (element) {
				document.location.href = '/modena-authentication-template/ying/details?id=' + element.id;
			})
			.fail(window.application.ajaxFailHandler);
		});

		window.application.authentication.subscribe(function(user) {
			elementWrapper.addClass('hidden');
			actionButton.addClass('hidden');
			unauthorizedMsg.addClass('hidden');

			if (user && window.application.userHasPermission(user, 'ying:edit')) {
				return $.ajax({
					method: 'GET',
					url: '/modena-authentication-template/api/ying/getById',
					dataType: 'json',
					data: {
						id: elementId
					}
				})
				.then(function (element) {
					elementName.val(element.name);
					elementWrapper.removeClass('hidden');
					actionButton.removeClass('hidden');
				})
				.fail(window.application.ajaxFailHandler);
			}
			else {
				unauthorizedMsg.removeClass('hidden');
			}
		});
		window.application.authentication.pageLoad(['ying:edit']);
	}
});