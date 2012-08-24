/* Author: Innocenty Enikeew <enikesha@gmail.com> */
(function($) {
    $.ajaxSetup({  
	dataType: "json"
    });

    var $main = $('.main'),
    $alert = $('#alert-template').removeAttr('id'),
    $item = $('#todo-template').removeAttr('id'),
    $list = $('#list-template').removeAttr('id'),
    $items = $('#items'),
    $lists = $('#lists'),
    $loader = $('#loader');

    $loader.ajaxStart(function() {$loader.show(); }).ajaxStop(function() {$loader.hide(); });	
    $alert.ajaxError(function(data) {
	addAlert('<strong>Error</strong> ' + data.statusText);
    });


    var getList = function(data) {
	var item = $list.clone(true).attr('data-pk', data.pk);
	item.find('a').text(data.fields.name).attr('href', data.url);
	return item;
    };
    var getItem = function(data) {
	var item = $item.clone(true).attr('data-pk', data.pk);
	item.find('label > span').text(data.fields.text);
	item.find('a').attr('href', data.url);
	if (data.fields.complete) {
	    item.find(':checkbox').attr('checked', 'true');
	    item.addClass('complete');
	}
	return item;
    };
    var addAlert = function(text) {
	$alert.clone(true).append(text).prependTo($main).show();
    }
    
    // Bind actions
    $('#items :checkbox').click(function(e){
	var pk = $(this).parents('li').attr('data-pk');
	$.ajax($(this).parent().siblings('a').attr('href'), {
	    type:'PUT',
	    data:{complete: this.checked},
	    success: function(data) {
		$("#items li[data-pk='" + pk + "']").replaceWith(getItem(data[0]).show());
	    }
	});
    });
    $('#items .todo-remove').click(function(e){
	e.preventDefault();
	var pk = $(this).parent().attr('data-pk');

	$.ajax($(this).attr('href'), {
	    type:'DELETE',
	    success: function(data) {
		$("#items li[data-pk='" + pk + "']").remove();
	    }
	});
    });
    $('#lists a').click(function(e) {
	e.preventDefault();
	load_items($(this).parent().attr('data-pk'), this.href);
    });
    
    $('#items-form').submit(function(e){
	e.preventDefault();
	$this = $(this);
	data = $this.serializeArray();
	if (data[0].value === "")
	    return;
	$.ajax(this.action, {
	    type:'POST',
	    data: data,
	    success: function(data) {
		$items.find('.empty').remove();
		getItem(data[0]).appendTo($items).show();
		$this.find("input[type='text']").val("");
	    }
	});
    });
    $('#lists-form').submit(function(e){
	e.preventDefault();
	$this = $(this);
	data = $this.serializeArray();
	if (data[0].value === "")
	    return;
	$.ajax(this.action, {
	    type:'POST',
	    data: data,
	    success: function(data) {
		getList(data[0]).appendTo($lists).show();
		load_items(data[0].pk, data[0].url);
		$this.find("input[type='text']").val("");
	    }
	});
    });

    var load_items = function(list_id, list_url) {
	$.ajax(list_url, {
            success: function(data) {
		if (data.length > 0) {
		    $.each(data, function(i, item) {
			getItem(item).appendTo($items).show();
		    });
		} else {	
		    $items.append("<li class='empty'><i>No todos added yet!</i></li>");
		}
		$('#items-form').attr('action', list_url);
		$lists.find("li").removeClass('active');
		$lists.find("li[data-pk='"+list_id+"']").addClass('active');
            }  
	});
	$items.children("li[data-pk]").remove();
    }

    $(function(){
	// Load lists
	$.ajax($('#lists-form').attr('action'), {
            success: function(data) {
		$.each(data, function(i, item) {
		    getList(item).appendTo($lists).show();
		});
		load_items(data[0].pk, data[0].url);
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