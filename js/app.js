'use strict';

// Global variables that all functions will have access to.
var markersArray = [];
var infowindow;
var map;

// View model that contains the variables that Knockout will bind to the DOM
var ViewModel = function() {
    // Creates an observable array using the objected defined in markers.js
    this.schools = ko.observableArray(markers),
    
    // Oberservable variable that will hold the contents of the search input
    this.searchTerm = ko.observable(''),
   
    // This search function is run every time the user 'keyups'
    this.search = function() {
        // Fetches the search input and clears the visible list of schools
        this.clearSchools();

        // Loops through the searchTerm and determines whether any of the school
        // titles contain it.  If so, it will be visible on the list and its marker
        // wil remain on the map.  If it is not contained in the school titles, it will
        // remain cleared form the list and the associated marker will be removed
        for (i = 0, j < this.schools().length; i < j; i++) {
            var searchTitle = this.schools()[i].title.toLowerCase();
            var searchInput = this.searchTerm().toLowerCase()
            if (searchTitle.indexOf(searchInput) >= 0) {
                this.schools()[i].onMap(true);
                markersArray[i].setVisible(true);
            } else {
                markersArray[i].setVisible(false);
            }
        }
    }

    // Function used by the search, which removes all schools from the visible list
    // at the start of each search
    this.clearSchools = function() {
        for (i = 0, j < this.schools().length; i < j; i++) {
            this.schools()[i].onMap(false);
        }
    }

	// Animates the marker when the mouse hovers over the listing
	this.animateMarker = function() {
   		var animatedMark = findMarkerById(this.id);
    	markersArray[animatedMark].setAnimation(google.maps.Animation.BOUNCE);
	}

	// Removes the animation when the mouse leaves the listing
	this.deanimateMarker = function() {
	    var animatedMark = findMarkerById(this.id);
	    markersArray[animatedMark].setAnimation(null);
	}

	// Opens in the infowindow associated with each marker when the listing is clicked
	this.openMarker = function() {
	    google.maps.event.trigger(markersArray[findMarkerById(this.id)], 'click');
	}

}

// Applies the Knockout bindings defined in the ViewModel
ko.applyBindings(new ViewModel);

// Initiates the google map and its components.  Called in the API request in index.html
function initMap() {

	// Creates a new map and centers it in Boston
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 42.351803,
            lng: -71.090289
        },
        zoom: 2,
        mapTypeControl: true,
        mapTypeControlOptions: {
            position: google.maps.ControlPosition.BOTTOM_CENTER
        }
    });

    // Creates a single infowindow that will be shared amongst all the markers
    infowindow = new google.maps.InfoWindow({
        content: '',
        maxWidth: 500
    });

    // Functions that create the markers and add associated event listeners
    makeMarkers(map);
    addListeners(map);

};

// Creates the Google Maps markers using the information hard-coded in markers.js
function makeMarkers() {

	// Loops through the marker objects in markers.js and creates a new marker
	// using the latlng, title and id provided.  The map then resets the bounds
	// after all the markers have been created so that all are visible
    var bounds = new google.maps.LatLngBounds();
    for (i = 0, j = markers.length; i < j; i++) {
        var marker = new google.maps.Marker({
            position: {
                lat: markers[i].lat,
                lng: markers[i].lng
            },
            title: markers[i].title,
            id: markers[i].id,
            icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
        });
        marker.setMap(map);
        bounds.extend(marker.position);
        markersArray.push(marker);
    }
    map.fitBounds(bounds);
}

// Adds the infowindow and even listeners for each marker object
function addListeners() {

	// Loops through each of the marker objects
    for (i = 0, j = markersArray.length; i < j; i++) {

    	// Adds the a click listener
        markersArray[i].addListener('click', function() {
        	// Resets marker color and animation before they are changed in the new marker
        	resetMarkers();
        	this.setAnimation(google.maps.Animation.BOUNCE);
        	// Changes the icon color to green when clicked
            this.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')

            // Open an infowindow and loading wheel while information is being loaded
            infowindow.setContent('<img src="img/ajax-loader.gif">');
            infowindow.open(map, this);

            // Determines index of markerthat has been clicked and pans the map
            // to center on the location
            var index = findMarkerById(this.id);
            map.panTo({
                lat: (markers[index].lat),
                lng: markers[index].lng 
            });

            // Builds the string that will be used to request information from Wikipedia.
            // For each marker, the school title is added and json format is requested.
            var wikiURL = "http://en.wikipedia.org/w/api.php?action=opensearch&search=" + markers[index].title.replace(/ /gi, "%20") + "&format=json";

            // Creates a timeout that will run after 3 seconds if not response is received from
            // the wikipedia requet
            var requestTimeout = setTimeout(function() {
                infowindow.setContent("Information currently unavailable");
                infowindow.open(map, this)
            }, 3000);

            // Ajax call that requests information using the wikiURL constructed using
            // the marker information
            $.ajax({
                url: wikiURL,
                dataType: "jsonp",

                // Is the request is successful, the article blurb and website will use those
                // to construct the content of each marker's infowindow
                success: function(response) {
                    var wikiOutput = response[2][0] + '<br><a href="' + response[3][0] + '">Wikipedia</a><br>';
                    var contentStr = '<img class="window_image" src="' + markers[index].image + '"><div class="school_info">' + wikiOutput + '</div><hr>' + '<div class="school_numbers">Average Incoming Scores<p>GPA - ' + markers[index].GPA + '<br>SAT Math - ' + markers[index].satMath + '<br>SAT Reading - ' + markers[index].satReading + '<br>SAT Writing - ' + markers[index].satWriting + '</div>';

                    // Sets the content of the window to the newly created content
                    infowindow.setContent(contentStr);

                    // Clears the timeout request so that the backup message is not displayed
                    clearTimeout(requestTimeout);
                }
            });
        });
    }

    
}

// Function that returns the index of the marker in the markers array using its unique ID
function findMarkerById(id) {
    for (var i = 0, j = markersArray.length; i < j; i++) {
        if (markersArray[i].id == id) {
            return i;
        }
    }
}


function resetMarkers() {
	for(i=0, j=markersArray.length; i<j; i++) {
		markersArray[i].setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
		markersArray[i].setAnimation(null);
	}
}

// Alerts error if google maps cannot be loaded
function errorAlert() {
	alert("Google Maps cannot be loaded at this time.")

}
