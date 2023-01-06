chrome.storage.local.get(['coordinates'], function(result) {
     // Comment out negation on line 3 to run again
     if (!result.coordinates) {
          // Interval to click 'Show More' so all past trips are on document
          var intervalId = setInterval(() => {
               var showMoreButton = document.querySelectorAll("div[data-plugin-in-point-id='PAST_TRIPS'] button")[0];
               if (showMoreButton) {
                    showMoreButton.click();
               } else {
                    clearInterval(intervalId);
                    getCoordinates();
               }
          }, 500);

          /**
           * Returns a promise with the coordinate [lat, long] grabbed from result.
           */
          function getCoordinate(cityLinkElement) {
               return fetch(cityLinkElement.href).then(function (response) {
                         return response.text();
                    }).then(function (html) {
                         // parse response text for lat/lng (mix of html and json)
                         var coordinate = [];
                         var latIndex = html.indexOf('\"lat\":');
                         html = html.substring(latIndex, latIndex + 75);
                         var latLngText = html.split(",");
                         coordinate.push(latLngText[0].substring(6));
                         coordinate.push(latLngText[1].substring(6));
                         return coordinate;
                    }).catch(function (err) {
                         console.warn('Something went wrong.', err);
               });
          }

          /**
           * Returns an array of promises each with a coordinate.
           * */
          function parseCoordinates(reservationLinks) {
               var coordinates = [];
               for (cityLinkElement of reservationLinks) {
                    const coordinate = getCoordinate(cityLinkElement);      
                    coordinates.push(coordinate);
               }
               return coordinates;
          }

          function getCoordinates() {
               var pastTripsDiv = document.querySelectorAll("div[data-section-id='PAST_TRIPS']")[0];
               var reservationLinks = pastTripsDiv.querySelectorAll("li a");
               var coordinates = parseCoordinates(reservationLinks);
               // Waits until all promises resolve, then applies callback 
               Promise.all(coordinates).then((values) => {
                    chrome.storage.local.set({'coordinates': values}, function() {
                         alert('Click on the extension icon to view the map!');
                    });
               });
          }
     }
});