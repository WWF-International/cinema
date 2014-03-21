function cinema() {

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

	// All your variables are belong to us
	// -------------------------------------------------------------------------
	var screens = gEBCN('cinema'),
		youtubeParameters = {
			autoplay : 1,
			controls : 0,
            disablekb: 1,
            iv_load_policy: 3,
            // modestbranding: 0,
            rel : 0,
            showinfo: 0,
			wmode : 'transparent'
		},
		youtubeTag = document.createElement('script'),
        firstScriptTag = document.getElementsByTagName('script')[0];

	    // Setting the source of the youtubeTag <script>
	    youtubeTag.src = 'https://www.youtube.com/iframe_api';

	// Check for the existance of any .cinema classes - if not, then stop
	// cinema.js from going any further.
	// -------------------------------------------------------------------------
	if ( screens == 0 || screens === null ) {
		return false;
	}

    // Add the YouTube script tag before the first <script> tag
	// -------------------------------------------------------------------------
    firstScriptTag.parentNode.insertBefore(youtubeTag, firstScriptTag);


	// Loop through every screen, get the thumbnail of the video from YouTube.
	// Set that as an image in the cinema element - allows flexible width in IE7
	// -------------------------------------------------------------------------
	for (var i = screens.length - 1; i >= 0; i--) {

		var youtubeID = screens[i].id;

		console.log(screens[i]);

		addedHTML = '<img src="//i1.ytimg.com/vi/' + youtubeID + '/maxresdefault.jpg" id="' + youtubeID + '-thumbnail" class="cinema-thumbnail" />';
		addedHTML = '<div class="cinema-overlay"></div>' + addedHTML;

		screens[i].parentElement.innerHTML += addedHTML;

	};


	// We don't want to start loading the iframe or the video until the page has
	// fully loaded. This function will be triggered once the page has loaded.
	// -------------------------------------------------------------------------
	function iframePlease() {
		for (var i = screens.length - 1; i >= 0; i--) {
			console.log('iframePlease');
			youtubePlayer(screens[i].id);
	    }
	}

	function getSet(event) {
		event.target.setVolume(0);
	}

	function go(event) {
        var thumbnail = document.getElementById(event.target.a.id + '-thumbnail');
        thumbnail.parentNode.removeChild(thumbnail);
	}

	function youtubePlayer(youtubeID) {
        // console.log('youtubePlayer');

        player = new YT.Player(youtubeID, {
        	'autoplay' : 0,
            videoId: youtubeID,
            playerVars : youtubeParameters,
            events: {
            	'onReady' : getSet,
                'onStateChange': go // 	Needs to fade out. And put the thumbnail back at the end of the video?
            }
        });
    }

	window.onload = iframePlease;

	return true;

}