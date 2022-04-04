chrome.storage.local.get(['coordinates'], function(result) {
   if (result.coordinates) {
      // Creating map options
      var mapOptions = {
       center: [51.958, 9.141],
       zoom: 10
      }
       
      // Creating a map object
      var map = new L.map('map', mapOptions);

      // Creating a Layer object
      var layer = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
      // Adding layer to the map
      map.addLayer(layer);

      var bounds = new L.LatLngBounds(result.coordinates);
      map.fitBounds(bounds);
      result.coordinates.forEach(value => new L.Marker(value).addTo(map));
   } else {
      var mapElem = document.getElementById('map');
      //Create the element using the createElement method.
      var myDiv = document.createElement("div");

      //Set its unique ID.
      myDiv.id = 'div_id';

      //Add your content to the DIV
      myDiv.innerHTML = "<h1>Map data is loading...just a sec!</h1>";

      //Finally, append the element to the HTML body
      mapElem.appendChild(myDiv);
   }
});