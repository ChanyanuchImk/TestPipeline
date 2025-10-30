const map = L.map('map').setView([13.7563, 100.5018], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

function loadHistoryByCoord(lon, lat, latlng) {
  const historyUrl = `http://3.220.255.132:8080/geoserver/noisemap/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=noise_map:noise_spatial_table&outputFormat=application/json&CQL_FILTER=DWITHIN(coordinate,SRID=4326;POINT(${lon} ${lat}),0.0001,meters)`;

  fetch(historyUrl)
    .then(res => res.json())
    .then(data => {
      const values = data.features.map(f => 
        `Noise: ${f.properties.noise_level}, Time: ${f.properties.time}`
      );

      const content = "<b>Noise data:</b><br>" + values.join("<br>");
      L.popup()
        .setLatLng(latlng)
        .setContent(content)
        .openOn(map);
    })
    .catch(err => console.error(err));
}


const latestUrl = "http://3.220.255.132:8080/geoserver/noisemap/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=noise_map:noise_spatial_table_latest&outputFormat=application/json";
fetch(latestUrl)
  .then(res => res.json())
  .then(data => {
    L.geoJSON(data, {
      pointToLayer: (feature, latlng) => {
        return L.circleMarker(latlng).on('click', () => {
          const lon = latlng.lng;
      	  const lat = latlng.lat;
	  loadHistoryByCoord(latlng.lng, latlng.lat, latlng);
	  
        });
      }
    }).addTo(map);
  }) .catch(err => console.error("Error loading GeoJSON:", err));

