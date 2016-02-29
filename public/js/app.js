$(document).ready(function() {
    var notiTabOpened = false;
    var socket = io();
    var unreadCount = 0;

    var addNotiItem = function(noti) {
        var childItem = $('<li>').attr({
                            'data-notiid': noti.notiId,
                            'class': 'noti-text'
                        }).append("Shekhar commented on " + noti.notiData);
        if(!noti.unread) {
            $(childItem).addClass('has-read');
        }
        childItem = Array.prototype.slice.call(childItem);
        $('.noti-body').prepend(childItem);
    }

    var setUnreadCount = function() {
        $('.noti-count').html(unreadCount);
        if(notiTabOpened) {
            $('.noti-title').css('display', 'inline-block');
        } else {
            $('#nav-noti-count').css('display', 'inline-block');
        }
    }

    var getNotifications = function() {
        $.ajax({
            url         : "http://localhost:4000/getNotifications",
            type        : 'GET',
            dataType    : 'json',
            success     : function(notiList) {
                for(var i=0; i<notiList.length; i++) {
                    addNotiItem(notiList[i]);
                }

                unreadCount = (_.filter(notiList, function(noti) {
                    return noti.unread == 1;
                })).length;
                setUnreadCount(unreadCount);
            }
        });
    }

    var updateNotificationCount = function(currentTarget) {
        var notiId = $(currentTarget).data('notiid');
        $.ajax({
            url         : "http://localhost:4000/updateNotificationCount",
            type        : 'PUT',
            data        : JSON.stringify({notiId: notiId}),
            contentType : 'application/json',
            success : function() {
                unreadCount--;
                if(unreadCount == 0) {
                    $('.noti-title').hide();
                } else {
                    $('.noti-count').html(unreadCount);
                }
                $(currentTarget).addClass('has-read');
            }
        });
    }

    getNotifications();

    socket.on('newNotificationAdded', function(noti) {
        addNotiItem(noti);
        unreadCount++;
        setUnreadCount();
    });

    $('#noti-tab').click(function(evt) {
        evt.stopPropagation();
        notiTabOpened = notiTabOpened ? false : true;
        if(unreadCount) {
            $('#nav-noti-count').fadeOut('slow');
            $('.noti-title').css('display', 'inline-block');
        }
        $('.noti-container').slideToggle(400);
    });

    $('#box-container').click(function() {
        $('.noti-container').hide();
        notiTabOpened = false;
    });

    $('.noti-container').click(function(evt) {
        evt.stopPropagation();
        return false;
    });

    $('.noti-body').on('click', 'li.noti-text', function(evt) {
        evt.stopPropagation();
        if(! ($(evt.currentTarget).hasClass('has-read')) ) {
            updateNotificationCount(evt.currentTarget);
        }
    });

});
