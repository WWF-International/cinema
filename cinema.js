function cinema(){

	// Catch any console.log for older browsers without a debugger.
	// -------------------------------------------------------------------------
	if ( typeof console === 'undefined' ) {
    	console = {
    		log: function() {
    		}
    	};

    	// alert('No console');
	}


	// Check to see if an object is empty
	// -------------------------------------------------------------------------
    function isObjectEmpty(object) {
        for ( var prop in object ) {
            if ( object.hasOwnProperty(prop) ) {
                return false;
            }
        }
        return true;
    }


    // Cross browser getElementsByClassName - gEBCN to avoid name clashes.
	// -------------------------------------------------------------------------
	// First up, native getElementByClassName
    if ( document.getElementsByClassName ) {
    	console.log('getElementsByClassName');

    	function gEBCN(classname) {
    		return document.getElementsByClassName(classname);
    	}
    }

	// Then querySelector
    else if ( document.querySelector ) {
    	console.log('querySelector');

    	function gEBCN(classname) {
    		return document.querySelector('.' + classname);
    	}
    }

	// Then everything else
    else {
    	console.log('urgh');

    	function gEBCN(classname) {
		    var elements = [],
		        getEverything = document.getElementsByTagName('*'),
		        classnameRegex = new RegExp('(^|\\s)' + classname + '(\\s|$)');

		    for (var i = getEverything.length - 1; i >= 0; i--) {

		        if ( classnameRegex.test(getEverything[i].className) ) {
		            elements.push(getEverything[i]);
		        }
		    }

		    return elements;
		}
	};


	// Setting up static, non-changable variables.
	// -------------------------------------------------------------------------
    var youtubeParameters = {
			autoplay : 1,
			controls : 0,
            disablekb: 1, // disable keyboard controls
            iv_load_policy: 3,
            loop: 1,
            // modestbranding: 0,
            rel : 0, // related videos at the end of the video
            showinfo: 0,
			wmode : 'transparent' // forces z-index
		};


	// Gather everything with a class of cinema
	// -------------------------------------------------------------------------
	var screens = gEBCN('cinema');

	// Check for the existance of any .cinema classes - if not, then stop
	// cinema.js from going any further.
	// -------------------------------------------------------------------------
	if ( screens == 0 || screens === null ) {
		return false;
	};

	// Check for the presence of modernizr; then detect for touch. If viewed on
	// a touchscreen, the video won't automatically play.
	// -------------------------------------------------------------------------
	if ( typeof Modernizr !== 'undefined' ) {
		console.log('modernizr present');

		if ( Modernizr.touch ) {
			wndw = {
				width : window.screen.width,
				height : window.screen.height
			}

			if ( wndw.width < 1025 && wndw.height < 768 ) {
				console.log('touch is true; screen is small');
				return false;
			};
		};

	}
	else {

		// Add in thumbnail image
		// ---------------------------------------------------------------------
		for (var i = screens.length - 1; i >= 0; i--) {
			screens[i].innerHTML = createInnards(screens[i].id);
		};
	};

	console.log('screen width - ' + window.screen.width);


	// Set up the YouTube JS script - place after check to avoid needless
	// downloads.
	// -------------------------------------------------------------------------
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


	// Set up the containers (thumbnail, overlay, div to be replaced with
	// iframe)
	// -------------------------------------------------------------------------
    function createInnards(ytID) {
			console.log('createInnards');
		var overlay = '<div id="' + ytID + '-overlay" class="cinema-overlay"></div>',
			iframe = '<div id="' + ytID + '-iframe" class="cinema-iframe"></div>',
			thumbnail = '<img src="//i1.ytimg.com/vi/' + ytID + '/mqdefault.jpg" id="' + ytID + '-thumbnail" class="cinema-thumbnail" />'
		return overlay + thumbnail + iframe;
    };


	// This function is fired after the YouTube JavaScript/iFrame API has
	// downloaded.
	// -------------------------------------------------------------------------
	var player;
	window.onYouTubeIframeAPIReady = function() {


		for (var i = screens.length - 1; i >= 0; i--) {
			var ytID = screens[i].id;
			screens[i].innerHTML = createInnards(ytID); // making doubly sure that the elements are there
			var target = document.getElementById(ytID + '-iframe');

			youtubeParameters['playlist'] = ytID;

			console.log('YouTube Parameters: ' + youtubeParameters);

			function onPlayerReady(event) {
				player.mute()
			};
			function onPlayerStateChange(event) {

				var iframeId = event.target.a.id,
					thumbnailId = iframeId.match( ('(\^\.\*)(\?\:-iframe\$)') )[1],
					thumbnail = document.getElementById(thumbnailId + '-thumbnail');

				if ( event.data == 1 ) {
					thumbnail.style.opacity = 0;
					//thumbnail.style.display = 'none';
				}
				else if ( event.data == 0 ) {
					thumbnail.style.display = 'block';
					//thumbnail.style.opacity = 1;
				};

			};

			player = new YT.Player(target, {
				'autoplay' : 0,
				videoId: ytID,
				playerVars : youtubeParameters,
				events: {
					'onReady': onPlayerReady,
					'onStateChange': onPlayerStateChange
				}
			});
		};

	}

};