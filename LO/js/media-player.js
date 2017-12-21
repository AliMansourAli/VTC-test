// Sample Media Player using HTML5's Media API
// 
// Ian Devlin (c) 2012
// http://iandevlin.com
// http://twitter.com/iandevlin
//
// This was written as part of an article for the February 2013 edition of .net magazine (http://netmagazine.com/)

// Wait for the DOM to be loaded before initialising the media player
//document.addEventListener("DOMContentLoaded", function() { initialiseMediaPlayer(); }, false);

// Variables to store handles to various required elements
var mediaPlayer;
var playPauseBtn;
var muteBtn;
var progressBar;
var volumeBar;
var oldVolume;
var videoSeekbar;
var volumeSeekbar;
var playing;

function initialiseMediaPlayer() {
   
	// Get a handle to the player
	mediaPlayer = document.getElementById('vid');
	
	
	// Get handles to each of the buttons and required elements
	playPauseBtn = document.getElementById('play-pause-button');
	fullscreenBtn = document.getElementById('fullscreen-button');
	muteBtn = document.getElementById('mute-button');
	progressBar = document.getElementById('progress-bar');
	volumeBar = document.getElementById('volume-bar');
	videoSeekbar = document.getElementById('videoSeekbar');
	volumeSeekbar = document.getElementById('volumeSeekbar');
	// Hide the browser's default controls
	mediaPlayer.controls = false;
	
	// Add a listener for the timeupdate event so we can update the progress bar
	mediaPlayer.addEventListener('timeupdate', updateProgressBar, false);
	
	
	// Add a listener for the play and pause events so the buttons state can be updated
	mediaPlayer.addEventListener('play', function() {
		// Change the button to be a pause button
		changeButtonType(playPauseBtn, 'pause');
	}, false);
	mediaPlayer.addEventListener('pause', function() {
		// Change the button to be a play button
		changeButtonType(playPauseBtn, 'play');
	}, false);
	mediaPlayer.addEventListener('click', function() {
		togglePlayPause();
	}, false);
	/*
	// need to work on this one more...how to know it's muted?
	mediaPlayer.addEventListener('volumechange', function(e) { 
		// Update the button to be mute/unmute
		if (mediaPlayer.muted) changeButtonType(muteBtn, 'unmute');
		else changeButtonType(muteBtn, 'mute');
	}, false);
	*/	
	mediaPlayer.addEventListener('ended', function() { this.pause(); }, false);	
	
	
	progressBar.addEventListener("click", seek);
	//volumeBar.addEventListener("click", changeVolume);


	//volumeBar.value = 100;
	//volumeSeekbar.value = 100;
	
	$("#videoSeekbar").change(function (e) {
		//var value = e.target.value;
	   
		//mediaPlayer.currentTime = value / 100 * mediaPlayer.duration;
	});


	$("#videoSeekbar").mousedown(function (e) {
		if (!mediaPlayer.paused && !mediaPlayer.ended) {
			playing = true;
		}else{
			playing = false;
		}
		mediaPlayer.pause();
	});
	
	$("#videoSeekbar").mouseup(function (e) {
		if (playing){
			mediaPlayer.play();
		}
	});
	
	
	videoSeekbar.addEventListener('input', videoSeekbarChanging, false);
	volumeSeekbar.addEventListener('input', volumeSeekbarChanging, false);
	
	$("#volumeSeekbar").mouseup(function (e) {
		//console.log (volumeBar.value);
		if (volumeBar.value > 0){
			oldVolume = volumeBar.value;
		}
	});
	
	$(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange', fn);


    $("#videoSeekbar").val(0);
    progressBar.value = 0;

    mediaPlayer.volume = volumeBar.value / 100;

}



function videoSeekbarChanging () {
	mediaPlayer.currentTime = $("#videoSeekbar").val() / 100 * mediaPlayer.duration;
	progressBar.value = Math.round($("#videoSeekbar").val());
	
}

function volumeSeekbarChanging () {
	var percent = Math.round($("#volumeSeekbar").val());
	//console.log (percent);
	volumeBar.value = percent;
	mediaPlayer.volume = parseFloat(percent).toFixed(1)/100;
	if (percent > 0){
		changeButtonType(muteBtn, 'mute');
		mediaPlayer.muted = false;
	}else{
		changeButtonType(muteBtn, 'unmute');
		mediaPlayer.muted = true;	
	}
	
	
	
}
 
/*
function changeVolume(e) {alert("SSSS");
	var percent = e.offsetX / this.offsetWidth;
	
    volumeBar.value = Math.round(percent * 100);
	mediaPlayer.volume = parseFloat(percent).toFixed(1);
	if (percent > 0){
		changeButtonType(muteBtn, 'mute');
	}else{
		changeButtonType(muteBtn, 'unmute');	
	}
	
	oldVolume = volumeBar.value;
	
}
*/


function fn (){
	if (!document.fullscreenElement &&    // alternative standard method
		!document.mozFullScreenElement && !document.webkitFullscreenElement) {
		changeButtonType(fullscreenBtn, 'fullscreen','fullscreen');
		$("#mediaControlsBar").css("width","100%");
	}else{
		changeButtonType(fullscreenBtn, 'normalscreen','exit fullscreen');	
		if($( window ).width() > 768){
			$("#mediaControlsBar").css("width","70%");
		}else if($( window ).width() > 500){
			$("#mediaControlsBar").css("width","70%");
		}else{
			$("#mediaControlsBar").css("width","40%");
		}
		
		
	}
}

function fullscreen() {

	if (!document.fullscreenElement &&    // alternative standard method
		!document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
		changeButtonType(fullscreenBtn, 'normalscreen','exit fullscreen');
		if (document.documentElement.requestFullscreen) {
			mediaPlayer.requestFullscreen();
		} else if (document.documentElement.mozRequestFullScreen) {
			mediaPlayer.mozRequestFullScreen();
		} else if (document.documentElement.webkitRequestFullscreen) {
			mediaPlayer.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
		}
	} else {
		changeButtonType(fullscreenBtn, 'fullscreen','fullscreen');
		if (document.cancelFullScreen) {
			document.cancelFullScreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitCancelFullScreen) {
			document.webkitCancelFullScreen();
		}
	}
	mediaPlayer.controls = false;
}

function seek(e) {
	
    var percent = e.offsetX / this.offsetWidth;
    mediaPlayer.currentTime = percent * mediaPlayer.duration;
    progressBar.value = Math.round(percent * 100);
	
}

function togglePlayPause() {
	// If the mediaPlayer is currently paused or has ended
	if (mediaPlayer.paused || mediaPlayer.ended) {
		// Change the button to be a pause button
		changeButtonType(playPauseBtn, 'pause');
		// Play the media
		mediaPlayer.play();
	}
	// Otherwise it must currently be playing
	else {
		// Change the button to be a play button
		changeButtonType(playPauseBtn, 'play');
		// Pause the media
		mediaPlayer.pause();
	}
}

// Stop the current media from playing, and return it to the start position
function stopPlayer() {
	mediaPlayer.pause();
	mediaPlayer.currentTime = 0;
}
/*
// Changes the volume on the media player
function changeVolume(direction) {
	if (direction === '+') mediaPlayer.volume += mediaPlayer.volume == 1 ? 0 : 0.1;
	else mediaPlayer.volume -= (mediaPlayer.volume == 0 ? 0 : 0.1);
	mediaPlayer.volume = parseFloat(mediaPlayer.volume).toFixed(1);
}
*/
// Toggles the media player's mute and unmute status
function toggleMute() {
	console.log (oldVolume);
	if (mediaPlayer.muted) {
		// Change the cutton to be a mute button
		changeButtonType(muteBtn, 'mute');
		// Unmute the media player
		mediaPlayer.muted = false;
		mediaPlayer.volume = oldVolume/100;
		volumeBar.value = oldVolume;
		$("#volumeSeekbar").val(oldVolume);
	}
	else {
		// Change the button to be an unmute button
		changeButtonType(muteBtn, 'unmute');
		// Mute the media player
		mediaPlayer.muted = true;
		mediaPlayer.volume = 0;
		oldVolume = volumeBar.value;
		volumeBar.value = 0;
		$("#volumeSeekbar").val(0);
	}
}

// Replays the media currently loaded in the player
function replayMedia() {
	resetPlayer();
	mediaPlayer.play();
}

// Update the progress bar
function updateProgressBar() {
	// Work out how much of the media has played via the duration and currentTime parameters
	var percentage = Math.round((100 / mediaPlayer.duration) * mediaPlayer.currentTime);
	// Update the progress bar's value
	$("#videoSeekbar").val(percentage);
	progressBar.value = percentage;
	// Update the progress bar's text (for browsers that don't support the progress element)
	progressBar.innerHTML = percentage + '% played';
}

// Updates a button's title, innerHTML and CSS class to a certain value
function changeButtonType(btn, _class , value) {
	btn.title = value;
	
	btn.className = _class;
	
	if (value == null){
		btn.innerHTML = _class;
	}else{
		btn.innerHTML = value;	
	}
	
}

// Loads a video item into the media player
function loadVideo() {
	for (var i = 0; i < arguments.length; i++) {
		var file = arguments[i].split('.');
		var ext = file[file.length - 1];
		// Check if this media can be played
		if (canPlayVideo(ext)) {
			// Reset the player, change the source file and load it
			resetPlayer();
			mediaPlayer.src = arguments[i];
			mediaPlayer.load();
			break;
		}
	}
}

// Checks if the browser can play this particular type of file or not
function canPlayVideo(ext) {
	var ableToPlay = mediaPlayer.canPlayType('video/' + ext);
	if (ableToPlay == '') return false;
	else return true;
}

// Resets the media player
function resetPlayer() {
	// Reset the progress bar to 0
	progressBar.value = 0;
	// Move the media back to the start
	mediaPlayer.currentTime = 0;
	// Ensure that the play pause button is set as 'play'
	changeButtonType(playPauseBtn, 'play');
}