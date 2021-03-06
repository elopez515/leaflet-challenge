// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(response) { 
  // console.log("response: ",response)

  // Once we get a response, send the data.features object to the createFeatures function
  features = response.features

  function onEachFeature(featureData, layer) {
      layer.bindPopup("<h3>" + featureData.properties.place +
        "</h3><hr><p>" + new Date(featureData.properties.time) + "</p>"); 
  }

  var earthquakes = L.geoJSON(features, {
    onEachFeature: onEachFeature,

    pointToLayer: (featureData, latlng) => 
    {
      // console.log("featureData: ", featureData)
      // console.log("latlng: ", latlng)

      
      return L.circle(latlng,
        {radius: featureData.properties.mag*10000,
        fillColor: cirleColor(featureData.geometry.coordinates[2]),
        fillOpacity: 1,
        opacity: 1
      }
        )
  }
  });
  
    function cirleColor(depth) {
      console.log("depth:",depth)

     
        if (depth > 90){
            color = "#E62817";
        }
        else if (depth > 70){
            color = "#E66317";
        }
        else if (depth > 50){
            color = "#E6CA17";
        }
        else if (depth > 30){
            color = "#D4EE00";
        }
        else if (depth > 10){
            color = "#78E617";
        }
        else {
            color = "#17E6DF";
        }
      return color
   }

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes : earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // legend at bottom right corner
  var legend = L.control({
    position: "bottomright"
  });

  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");
    var altitude = [-10, 10, 30, 50, 70, 90];
    var colors = [
        "#17E6DF",
        "#78E617",
        "#D4EE00",
        "#E6CA17",
        "#E66317",
        "#E62817"
    ];
    // generate a legend with a colored square for each interval.
    for (var i = 0; i < altitude.length; i++) {
        div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
            + altitude[i] + (altitude[i + 1] ? "&ndash;" + altitude[i + 1] + "<br>" : "+");
    }
    return div;
  };
  // legend to the map.
  legend.addTo(myMap);
});
