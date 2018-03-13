document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady(isNotCordova_ = false) {
	var orchestrator = 'milankragujevic.com:3000';
    $('body').css({
	    width: $(window).width(),
	    height: $(window).height()
    });
    var wallpaper = 1;
    var wallpapers = 10;
    setWallpaper();
    var android_id = device.uuid;
    if(!android_id) {
	    android_id = '0123456789';
    } else {
        android_id = android_id.slice(-10);
    }
    var socket = io.connect('http://' + orchestrator, { query: { uid: android_id }, transports: ['websocket'], upgrade: false });
    $('.device-name').text(android_id);
    function setTime() {
	    var date = (new Date());
	    $('.time').text(("00" + (date.getHours())).slice(-2) + ':' + ("00" + (date.getMinutes())).slice(-2));
    }
    function setWallpaper() {
	    wallpaper = Math.floor(Math.random() * wallpapers) + 1;
	    $('body').css({ 
		    backgroundImage: 'url(wallpapers/' + wallpaper + '.jpg)'
	    });
    }
    setTime();
    setInterval(function() {
	    setTime();
    }, 5000);
    setInterval(function() {
	    setWallpaper();
    }, 150000);
    socket.on('query', function() {
	    var isPlaying = ($('video').length > 0 ? true : false)
	    var duration = -1
	    var currentTime = 0
	    var isPaused = false
	    if(isPlaying) {
		    duration = $('video')[0].duration
		    currentTime = $('video')[0].currentTime
		    isPaused = ($('video')[0].paused ? true : false)
	    }
	    socket.emit('queryResponse', {
		    isPlaying: isPlaying,
		    duration: duration,
		    currentTime: currentTime,
		    isPaused: isPaused
	    });
    });
    socket.on('play', function(data) {
	    if(!data.url || !data.type) { return; }
	    var url = data.url;
	    var type = data.type;
	    $('.player').html('').hide();
	    $('.loading').show();
	    $('<video></video>').attr('src', url).attr('type', type).attr('autoplay', 1).attr('preload', 'auto').appendTo($('.player'));
	    $('video').on('loadedmetadata', function() {
		    $('.player').show();
		    $('.loading').hide();
	    });
	    $('video').on('pause', function() {
		    $('.paused').show();
	    });
	    $('video').on('play', function() {
		    $('.paused').hide();
	    });
    });
}
