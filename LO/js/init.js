// JavaScript Document



$(window).load(function(){
	
	
	
	})



var canvasId;
var jsFile;
var soundFile;


var canvas, stage, exportRoot, currentSound;

    

    var lastFrame;

    var currentPos;
    var soundExist;
    var soundsArray;
    var soundId;
    var loop;
    

    var value = 0;
	
	var audioElement;
	var duration;


    var soundVolume = 1;

    if (typeof (Storage) !== "undefined") {
        // Code for localStorage/sessionStorage. 
       // soundVolume = localStorage.getItem("soundVolume");

    }

    if (soundVolume == null) {
        soundVolume = 1;
    }


	var interval;
	var soundLoadedInterval;

	var playing = false;



    var oldSoundVolume;
	
	
	$(document).ready(function () {
		
		canvasId = $("#myContin").find($("canvas") ).attr("id");
		jsFile = $("#myContin").find($("canvas") ).attr("mysrc");
		soundFile = $("#myContin").find($("canvas") ).attr("mysrc").replace(".js", ".mp3");;
		
		
		
		$("#soundBtn0").css("display", "none");
        $("#soundBtn1").css("display", "none");
        $("#soundBtn2").css("display", "none");
		$("#soundBtn3").css("display", "none");
        $("#soundBtn4").css("display", "none");
		$("#soundBtn5").css("display", "inline");
		$("#coursePlayer").css("display", "none");
		
		include(jsFile);
	
		$("#playerSlider").val(0);
		
		
		audioElement = document.getElementById("audioObject");
	
		audioElement.src = soundFile;
		$("#audioObject").bind("load",function(){
			alert("Audio Loaded succesfully");
		});
		
		audioElement = document.getElementById("audioObject");
	
		
		audioElement.addEventListener("loadedmetadata", function(_event) {
			duration = audioElement.duration;
			//alert ("SS "+duration);
		});
		
		audioElement.onloadeddata = function() {

			$("#soundSlider").val(soundVolume * 100);
			
			canvas = document.getElementById(canvasId);
	
			var loader = new createjs.LoadQueue(false);
			//loader.installPlugin(createjs.Sound);
			loader.addEventListener("complete", handleComplete);
			loader.loadManifest(lib.properties.manifest);
			loader.addEventListener("progress", handleProgress);
			//loader.onProgress = handleProgress;
	
			//createjs.Ticker.on("tick", tick);
	
	
			//stage.update();
		
			
		
		};
		
	
	 
	});
	
	function include(file)
	{
	
	  var script  = document.createElement('script');
	  script.src  = file;
	  script.type = 'text/javascript';
	  script.defer = true;
	
	  document.getElementsByTagName('head').item(0).appendChild(script);
	
	}





    function handleProgress(event) {
       // $("#loaderProgress").val(event.loaded * 100 / event.total);

    }





    function handleComplete() {
		
		
		
				
		$("#loaderProgress").css("display","none");		
		
		var jsName = jsFile.replace(".js", "");;

		
		for (var i = jsName.length; i >= 0; i--){
			if (jsName.charAt(i) == "/"){
				jsName = jsName.substring(i + 1,jsName.length);
				break;
			}
		}
		
		exportRoot = eval("new lib." + jsName);
			
		lastFrame = exportRoot.timeline.duration - 1;
			
		stage = new createjs.Stage(canvas);
		stage.addChild(exportRoot);
			
			
			
		stage.update();
		createjs.Ticker.setFPS(lib.properties.fps);
			
			
					
		$("#coursePlayer").css("display", "block");
			
			
		exportRoot.gotoAndStop(0);
		createjs.Ticker.addEventListener("tick", stage);
					
					
		
		stoping();

				
				
		
		

    }


    function stoping() {
		if (audioElement.duration > 0){
			playing = false;
		  
			clearInterval(interval);
			
			exportRoot.gotoAndStop(0);
				
			$("#audioObject").trigger('pause');
			$("#audioObject").prop("currentTime",0);
		
			$("#playerSlider").val(0);
			
			$("#pauseBtn").css("display", "none");
			$("#playBtn").css("display", "inline");
		}
    }

    function Pause() {
		playing = false;	
		clearInterval(interval);
		exportRoot.stop();
	
		$("#audioObject").trigger('pause');
	
		$("#pauseBtn").css("display", "none");
		$("#playBtn").css("display", "inline");

    }
    function Play() {
		var x = document.getElementById("audioObject"); 
		x.play();
		
		if (audioElement.duration > 0){
			playMovie ();
		}else{
			$("#loaderProgress").css("display","block");
			$("#playerSlider").attr("disabled", "disabled");
				
			soundLoadedInterval = setInterval(function(){
				if (audioElement.duration > 0){
					clearInterval(soundLoadedInterval);
					$("#loaderProgress").css("display","none");
					$("#playerSlider").removeAttr('disabled');
					playMovie ();
				}
				
			}, 22);
			
		}
    }
	
	function playMovie (){
		playing = true;
	//alert (exportRoot)
		interval = setInterval(function(){
					
			var currentTime = $("#audioObject").prop("currentTime");
			$("#playerSlider").val( currentTime/ audioElement.duration * 100);
		
			currentPos = ($("#playerSlider").val() / 100) * lastFrame;
				
			exportRoot.gotoAndStop(currentPos);
					
			if (currentTime >= audioElement.duration) {
				playing = false;
					
				$("#audioObject").trigger('pause');
					
				$("#pauseBtn").css("display", "none");
				$("#playBtn").css("display", "inline");
				clearInterval(interval);
						
			}
				
				
		}, 33);
		
		$("#pauseBtn").css("display", "inline");
		$("#playBtn").css("display", "none");

	}
	
	function playerSliderMouseDown() {
		if (audioElement.duration > 0){
       		clearInterval(interval);
			$("#audioObject").trigger('pause');  
		}
    }

    function playerUpdateSlider(val) {
		if (audioElement.duration > 0){
			value = val;
				
			
			var thisTime=(val / 100) * audioElement.duration;
			console.log(val,thisTime);
			$("#audioObject").prop("currentTime",thisTime);
			
			currentPos = (val / 100) * lastFrame;
			exportRoot.gotoAndStop(currentPos);
		}

	}


	
	function playerSliderMouseUP() {
		if (audioElement.duration > 0){
			if (playing){
				Play();
			}
		}
	}




    function muteVolume() {
        oldSoundVolume = soundVolume;
        soundVolume = 0;

        $("#audioObject").prop("muted",true);
		
		
        $("#soundSlider").val(0);

        $("#soundBtn0").css("display", "inline");
        $("#soundBtn1").css("display", "none");
        $("#soundBtn2").css("display", "none");
		$("#soundBtn3").css("display", "none");
        $("#soundBtn4").css("display", "none");
		$("#soundBtn5").css("display", "none");
    }


    function unMuteVolume() {
        soundVolume = oldSoundVolume;

        localStorage.setItem("soundVolume", soundVolume);

       
		$("#audioObject").prop("muted",false);
		
        $("#soundSlider").val(soundVolume * 100);


        
		$("#soundBtn0").css("display", "none");
        $("#soundBtn1").css("display", "none");
        $("#soundBtn2").css("display", "none");
		$("#soundBtn3").css("display", "none");
        $("#soundBtn4").css("display", "none");
		$("#soundBtn5").css("display", "none");


        if (soundVolume == 1) {
            $("#soundBtn5").css("display", "inline")
        } else if (soundVolume >= 0.75){
            $("#soundBtn4").css("display", "inline")
        } else if (soundVolume >= 0.5){
            $("#soundBtn3").css("display", "inline")
		 } else if (soundVolume >= 0.25){
            $("#soundBtn2").css("display", "inline")
	    } else if (soundVolume > 0){
            $("#soundBtn1").css("display", "inline")
	    }

    }

    function soundSliderMouseDown() {
        if (soundVolume == 1) {
            oldSoundVolume = 0;
        } else {
            oldSoundVolume = soundVolume;
        }

    }

    function soundUpdateSlider(val) {
        soundVolume = val / 100;
		
		$("#audioObject").prop("muted",false);
		$("#audioObject").prop("volume",soundVolume);


        $("#soundBtn0").css("display", "none");
        $("#soundBtn1").css("display", "none");
        $("#soundBtn2").css("display", "none");
		$("#soundBtn3").css("display", "none");
        $("#soundBtn4").css("display", "none");
		$("#soundBtn5").css("display", "none");


        if (soundVolume == 1) {
            $("#soundBtn5").css("display", "inline")
        } else if (soundVolume >= 0.75){
            $("#soundBtn4").css("display", "inline")
        } else if (soundVolume >= 0.5){
            $("#soundBtn3").css("display", "inline")
		 } else if (soundVolume >= 0.25){
            $("#soundBtn2").css("display", "inline")
	    } else if (soundVolume > 0){
            $("#soundBtn1").css("display", "inline")
		} else if (soundVolume == 0){
            $("#soundBtn0").css("display", "inline")	
	    }

    }
