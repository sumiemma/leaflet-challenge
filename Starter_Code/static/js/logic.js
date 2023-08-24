// URL for json data
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

// Fetch the JSON data and console log it
d3.json(url).then(function(data){
    console.log(data.features);


// Creating our initial map object:
    // We set the longitude, latitude, and starting zoom level.
    // This gets inserted into the div with an id of "map".
    let myMap = L.map("map", {
        center: [45.52, -122.67],
        zoom: 5
    });


// Create the tile layer that will be the background of our map, add to map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(myMap);



    for (let i = 0; i < data.features.length; i++) {

        let mag = data.features[i].properties.mag;
        let time = data.features[i].properties.time;
        let lat = data.features[i].geometry.coordinates[1];
        let long = data.features[i].geometry.coordinates[0];
        let depth = data.features[i].geometry.coordinates[2];

        L.circleMarker([lat, long],{
            radius: mag*10,
            fill: true,
            fillColor: getColor(depth),
            fillOpacity: 0.75,
            weight: 0.5})
        
        .bindPopup(`<h3>Magnitude: ${mag},
                        Time: ${time},
                        Latitude: ${lat},
                        Longitude: ${long},
                        Depth: ${depth}km</h3>`)
        .addTo(myMap);

    };



// Legend

// colour gradient
    function getColor(d) {
    return d > 90 ? '#d73027':
            d > 70 ?'#fc8d59':
            d > 50 ?'#fee08b':
            d > 30 ?"#ffffbf":
            d > 10 ?'#d9ef8b':
            d > 0 ?'#91cf60':
                '#1a9850';
    };

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [-10, 10, 30, 50, 70, 90],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
             grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);

// // colour gradient
//     function colourGradient(c) {
//         c > 90 ? '#d73027':
//         c > 70 ?'#fc8d59':
//         c > 50 ?'#fee08b':
//         c > 30 ?'#d9ef8b':
//         c > 10 ?'#91cf60':
//         '#1a9850';
//     }


});
