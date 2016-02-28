$(document).ready(function() {
    var notiTabOpened = false;
    var socket = io();
    var unreadCount = 0;

    var addNotiItem = function(noti) {
        var childItem = $('<li>').attr({
                            'data-notiId': noti.notiId,
                            'class': 'noti-text'
                        }).append("Shekhar commented on " + noti.notiData);
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
            method      : 'GET',
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
        unreadCount--;
        $.ajax({
            url     : "http://localhost:4000/updateNotificationCount",
            method  : 'PUT',
            data    : currentTarget.data('notiId'),
            success : function() {
                unreadCount--;
                if(unreadCount == 0) {
                    $('.noti-title').hide();
                } else {
                    $('.noti-count').html(unreadCount);
                }
                $currentTarget.addClass('has-read');
            }
        });
    }

    getNotifications();

    socket.on('newNotificationAdded', function(noti) {
        addNotiItem(noti);
        unreadCount++;
        setUnreadCount();
    });

    $('#noti-tab').click(function() {
        notiTabOpened = true;
        if(unreadCount) {
            $('#nav-noti-count').fadeOut('slow');
            $('.noti-title').css('display', 'inline-block');
        }
        $('.noti-container').slideToggle(300);
    });

    $('#box-container').click(function() {
        $('.noti-container').hide();
        notiTabOpened = false;
    });

    $('.noti-container').click(function(evt) {
        evt.stopPropagation();
        return false;
    });

    $('.noti-body .noti-text').on('click', function(evt) {
        evt.stopPropagation();
        if(!$(evt.currentTarget).hasClass('has-read')) {
            updateNotificationCount($(evt.currentTarget));
        }
    });

    // $('.noti-footer').click(function() {
    //     unreadCount = 0;
    //     window.localStorage.setItem('unreadCount', unreadCount);
    //     $('.noti-title').hide();
    //     $('.noti-text').addClass('has-read');
    // });

});
