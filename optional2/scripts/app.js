
(function() {
  'use strict';

  var initialWeatherForecast = {
    key: 'newyork',
    label: 'New York, NY AARSHIA',
    currently: {
      time: 1453489481,
      summary: 'Clear chinnppan ',
      icon: 'partly-cloudy-day',
      temperature: 52.74,
      apparentTemperature: 74.34,
      precipProbability: 0.20,
      humidity: 0.77,
      windBearing: 125,
      windSpeed: 1.52
    },
    daily: {
      data: [
        {icon: 'clear-day', temperatureMax: 55, temperatureMin: 34},
        {icon: 'rain', temperatureMax: 55, temperatureMin: 34},
        {icon: 'snow', temperatureMax: 55, temperatureMin: 34},
        {icon: 'sleet', temperatureMax: 55, temperatureMin: 34},
        {icon: 'fog', temperatureMax: 55, temperatureMin: 34},
        {icon: 'wind', temperatureMax: 55, temperatureMin: 34},
        {icon: 'partly-cloudy-day', temperatureMax: 55, temperatureMin: 34}
      ]
    }
  };

  var app = {
    hasRequestPending: false,
    isLoading: true,
    visibleCards: {},
    loadinitiate: [],
    spinner: document.querySelector('.loader'),
    cardTemplate: document.querySelector('.cardTemplate'),
    container: document.querySelector('.main'),
    addDialog: document.querySelector('.dialog-container'),
    daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  };


  /*****************************************************************************
   *
   * Event listeners for UI elements
   *
   ****************************************************************************/

  document.getElementById('butRefresh').addEventListener('click', function() {
    // Refresh all of the forecasts
    app.updateForecasts();
  });

  document.getElementById('butAdd').addEventListener('click', function() {
    // Open/show the add new city dialog
    app.toggleAddDialog(true);
  });

  document.getElementById('butAddCity').addEventListener('click', function() {
    // Add the newly selected city
    var select = document.getElementById('selectCityToAdd');
    var selected = select.options[select.selectedIndex];
    var key = selected.value;
    var label = selected.textContent;
    app.getForecast(key, label);
    app.loadinitiate.push({key: key, label: label});
    app.saveSelectedCities();
    app.toggleAddDialog(false);
  });

  document.getElementById('butAddCancel').addEventListener('click', function() {
    // Close the add new city dialog
    app.toggleAddDialog(false);
  });


  /*****************************************************************************
   *
   * Methods to update/refresh the UI
   *
   ****************************************************************************/

  // Toggles the visibility of the add new city dialog.
  app.toggleAddDialog = function(visible) {
    if (visible) {
      app.addDialog.classList.add('dialog-container--visible');
    } else {
      app.addDialog.classList.remove('dialog-container--visible');
    }
  };

  // Updates a weather card with the latest weather forecast. If the card
  // doesn't already exist, it's cloned from the template.
  app.updateForecastCard = function(data) {
	  
    


	///var obj = JSON.parse(text);
	//alert(obj.employees.length);
	//alert(obj.employees[1].firstName);
	var j =0;
	for (var i=0 ; i < data.optional.length ; i++) {
		j = j+1;
		var card = app.visibleCards[i];
		//alert(data.optional[i].label);
		if (!card) {
		 //alert('muthu clita'+data.currently.summary);
		  
		  card = app.cardTemplate.cloneNode(true);
		  card.classList.remove('cardTemplate');
		  card.querySelector('.label').textContent = data.optional[i].label;
		  card.removeAttribute('hidden');
		  app.container.appendChild(card);
		  app.visibleCards[data.key] = card;
		}
		card.querySelector('.description').textContent = data.optional[i].description;
		card.querySelector('.duration').textContent = data.optional[i].duration;
		card.querySelector('.timing').textContent = data.optional[i].timing;
		card.querySelector('.price').textContent = data.optional[i].price;
		card.querySelector('.image').innerHTML = '<a href=""><img border="0" alt="" src="'+j+'.jpg" width="150" height="100"></a>';
	}
    if (app.isLoading) {
      app.spinner.setAttribute('hidden', true);
      app.container.removeAttribute('hidden');
      app.isLoading = false;
    }


  };


  // Gets a forecast for a specific city and update the card with the data
  app.getForecast = function(key, label) {
	//  alert(key);
	//  alert(label);
	  
    var url = 'https://chinnappan.github.io/pwa/optional2/json.html';
    if ('caches' in window) {
      caches.match(url).then(function(response) {
        if (response) {
          response.json().then(function(json) {
            // Only update if the XHR is still pending, otherwise the XHR
            // has already returned and provided the latest data.
            if (app.hasRequestPending) {
              console.log('[App] Forecast Updated From Cache');
              json.key = key;
              json.label = label;
              app.updateForecastCard(json);
            }
          });
        }
      });
    }
    app.hasRequestPending = true;
    // Make the XHR to get the data, then update the card
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          var response = JSON.parse(request.response);
          response.key = key;
          response.label = label;
          app.hasRequestPending = false;
          console.log('[App] Forecast Updated From Network');
          app.updateForecastCard(response);
        }
      }
    };
    request.open('GET', url);
    request.send();
  };
  
  
  
  
  /*****************************************************************************
   *
   * Methods for dealing with the model
   *
   ****************************************************************************/

  // Gets a forecast for a specific city and update the card with the data
  app.getForecast_old= function(key, label) {
    var url = 'https://publicdata-weather.firebaseio.com/';
    url += key + '.json';
	// var url = 'http://cmuthu.cnkdev.com/json/app.json';
	var url = 'https://pwapp-c2136.firebaseapp.com/';
	//alert(url);
    if ('caches' in window) {
      caches.match(url).then(function(response) {
        if (response) {
          response.json().then(function(json) {
            // Only update if the XHR is still pending, otherwise the XHR
            // has already returned and provided the latest data.
            if (app.hasRequestPending) {
              console.log('updated from cache');
              json.key = key;
              json.label = label;
              app.updateForecastCard(json);
            }
          });
        }
      });
    }
    // Make the XHR to get the data, then update the card
    app.hasRequestPending = true;
	// alert('muthu201');
   // var request = new XMLHttpRequest();
      //alert('muthu201201');
     // alert('muthu201202');
	  var response1;

		//response1='{"currently":{"summary":"Clear india ZcZc"},"timezone":"America/Chicago","label":"AARSHIA LABEL"}';
		var response1 = '{ "optional" : [' +
		'{ "label":"HERITAGE TOUR & CITY TOUR OF SOUTH MUMBAI" , "description":"Heritage tour you visit the Gateway of India, Kala Ghoda, Horniman Circle, Fort Area and Dhobi Ghat (an open air laundry)","duration":"Duration: 04 hrs","timing":"Timing: 0830-1330 hrs","price":"$ 18" },' +
		'{ "label":"DHARAVI TOUR" , "description":"Known to many as one of the largest slums in Asia","duration":"Duration: 3.5 hrs","timing":"Timing: 1430-1800 hrs","price":"$ 25" },' +
		'{ "label":"MUMBAI STREET FOOD TOUR" , "description":"Mumbai is famous across India for its outstanding street food but discovering good eateries in a big city is not always easy. Not to worry, as Reality Tours & Travel has one of the most sought after tours in Mumbai","duration":"Duration: 04 hrs","timing":"Timing: 1830-2230 hrs","price":"$ 50" },' +
		'{ "label":"OFF THE BEATEN TRACK : BANGANGA + MANI BHAVAN + DABBAWALLA + KHOTACHI WADI" , "description":"The Banganga water tank is supposed to be more than 5000 years old and is also supposed to be one of the oldest structures available on the west coast of India","duration":"Duration: 04 hrs","timing":"Timing: 0900-1330 hrs","price":"$ 20" },' +		
		'{ "label":"ELEPHANTA EXCURSION" , "description":"Amazing rock sculpture and insight into the Hindu religion. Fantastic view of the city and the Gateway of India from the boat is an added value to the tour….be prepared to see monkeys up close once on the island!","duration":"Duration: 05 hrs","timing":"Timing: 0800-1300 hrs","price":"$ 40" },' +		
		'{ "label":"MUMBAI STREET FOOD TOUR" , "description":"Adding another dimension to the Mumbai experience: flavoring Mumbai! Reality Tours & Travel offers a well-organized and safe culinary journey to explore the multicultural food experiences of the city, eating as a local and surrounded by locals from classic street food on Chowpatty Beach to the Mohammed Ali culinary lanes","duration":"Duration: 04 hrs","timing":"Timing: 1830-2230 hrs","price":"$ 60" },' +		
		'{ "label":"FLOWER & SPICE MARKET TOUR" , "description":"Phool Gully (Flower lane ): located at Dadar (West). What’s so exciting about this place is the intoxicating & the intense fragrance of jasmine and rose blossoms that welcome you. Popular for all kinds of flowers starting from a common flower like Mogra (Jasmine) to Roses to Gerberas to Carnations to Orchids to Laxmi Kamal (Lotus) viz. white, pink, red, yellow, etc.. ","duration":"Duration: 05 hrs","timing":"Timing: 0830-1330 hrs","price":"$ 50" },' +		
		'{ "label":"SHOPPING TOUR" , "description":"Meet at the Trident Nariman Point Lobby & board your coach","duration":"Duration: 04 hrs","timing":"Timing: 1400-1730 hrs","price":"$ 30" } ]}';




          var response = JSON.parse(response1);
		  //alert(response1);
          response.key = key;
          //response.label = label;
          app.hasRequestPending = false;
          app.updateForecastCard(response);

  
   // request.open('GET', url);
    //request.send();
  };

  // Iterate all of the cards and attempt to get the latest forecast data
  app.updateForecasts = function() {
    var keys = Object.keys(app.visibleCards);
    keys.forEach(function(key) {
      app.getForecast(key);
    });
  };

  // Save list of cities to localStorage, see note below about localStorage.
  app.saveSelectedCities = function() {
    var loadinitiate = '[{"key":"blank","label":"initialize"}]';
    // IMPORTANT: See notes about use of localStorage.
    localStorage.loadinitiate = loadinitiate;
  };

  /************************************************************************
   *
   * Code required to start the app
   *
   * NOTE: To simplify this codelab, we've used localStorage.
   *   localStorage is a synchronous API and has serious performance
   *   implications. It should not be used in production applications!
   *   Instead, check out IDB (https://www.npmjs.com/package/idb) or
   *   SimpleDB (https://gist.github.com/inexorabletash/c8069c042b734519680c)
   ************************************************************************/

  app.loadinitiate = localStorage.loadinitiate;
  if (app.loadinitiate) {

	 console.log('Second time');
     app.getForecast('blank', 'initialize');
   
  } else {
	 console.log('First time');
	  app.getForecast('blank', 'initialize');
     var loadinitiate = '[{"key":"blank","label":"initialize"}]';
    // IMPORTANT: See notes about use of localStorage.
    localStorage.loadinitiate = loadinitiate;
	/*app.updateForecastCard(initialWeatherForecast);
    app.loadinitiate = [
      {key: initialWeatherForecast.key, label: initialWeatherForecast.label}
    ];
    app.saveloadinitiate();*/
  }

  if('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
  }
})();
