chrome.storage.local.get(['coordinates'], function(result) {
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
           * */
          function getCoordinate(cityLinkElement) {
               return fetch(cityLinkElement.href).then(function (response) {
                         return response.text();
                    }).then(function (html) {
                         // Convert the HTML string into a document object
                         var parser = new DOMParser();
                         var doc = parser.parseFromString(html, 'text/html');
                         var addressElement = doc.querySelectorAll("a[data-testid='reservation-destination-link'][href^='https://www.google.com/maps']")[0];
                         var coordinateUrl = new URL(addressElement.href);
                         var searchParams = coordinateUrl.searchParams;
                         var coordinate = searchParams.get("query").split(",").map(Number);
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