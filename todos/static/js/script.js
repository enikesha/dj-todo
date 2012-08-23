/* Author: Innocenty Enikeew <enikesha@gmail.com> */
(function($) {
    $.ajaxSetup({  
	dataType: "json"
    });

    var $main = $('.main'),
    $item = $('#todo-template').removeAttr('id'),
    $alert = $('#alert-template').removeAttr('id'),
    $items = $('#items'),
    $loader = $('#loader'),
    $form = $('#items-form');

    var getItem = function(data) {
	var item = $item.clone(true).attr('data-pk', data.pk);
	item.find('label > span').text(data.fields.text);
	item.find('a').attr('href', function(idx, val){ return val + data.pk + '/'});
	return item;
    };
    var addAlert = function(text) {
	$alert.clone(true).append(text).prependTo($main).show();
    }
    
    // Bind actions
    $('.todo-remove').click(function(e){
	e.preventDefault();
	var pk = $(this).parent().attr('data-pk');

	$.ajax($(this).attr('href'), {
	    type:'DELETE',
	    success: function(data) {
		$("#items li[data-pk='" + pk + "']").remove();
	    },
	    error: function(data) {
		addAlert('<strong>Error</strong>' + data.statusText);
	    },
	    complete: function() { $loader.hide(); }
	});
	$loader.show();
    });
    
    $form.submit(function(e){
	e.preventDefault();
	data = $form.serializeArray();
	if (data.text === "")
	    return;
	$.ajax($form.attr('action'), {
	    type:'POST',
	    data: data,
	    success: function(data) {
		$items.find('.empty').remove();
		getItem(data[0]).appendTo($items).show();
		$form.find("input[type='text']").val("");
	    },
	    error: function(data) {
		addAlert('<strong>Error</strong> ' + data.statusText);
	    },
	    complete: function() {
		$loader.hide(); 
	    }
	});
	$loader.show();
    });

    $(function(){
	// Load data
	$.ajax($('#items-form').attr('action'), {  
            success: function(data) {
		if (data.length > 0) {
		    $.each(data, function(i, item) {
			getItem(item).appendTo($items).show();
		    });
		} else {	
		    $items.append("<li class='empty'><i>No todos added yet!</i></li>");
		}
		$loader.hide();
            }  
	});
    });
})(jQuery);

jQuery(document).ajaxSend(function(event, xhr, settings) {
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    function sameOrigin(url) {
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }
    function safeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }
});