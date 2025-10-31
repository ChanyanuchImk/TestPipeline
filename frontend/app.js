const map = L.map('map').setView([13.7563, 100.5018], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const baseUrl = window.location.origin; // จะได้ http://3.220.255.132:8081
const geoserverUrl = `${baseUrl}/geoserver/ne/ows`;

function loadHistoryByCoord(lon, lat, latlng) {
  const historyUrl = `${geoserverUrl}?service=WFS&version=1.0.0&request=GetFeature&typeName=ne:noise_spatial_table&outputFormat=application/json&CQL_FILTER=DWITHIN(coordinate,SRID=4326;POINT(${lon} ${lat}),0.0001,meters)`;

  console.log("Fetching history:", historyUrl);

  fetch(historyUrl)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      if (!data.features.length) {
        L.popup()
          .setLatLng(latlng)
          .setContent("No history data found.")
          .openOn(map);
        return;
      }

      const values = data.features.map(f => 
        `Noise: ${f.properties.noise_level}, Time: ${f.properties.time}`
      );

      const content = "<b>Noise data:</b><br>" + values.join("<br>");
      L.popup().setLatLng(latlng).setContent(content).openOn(map);
    })
    .catch(err => console.error("Error fetching history:", err));
}


const latestUrl = `${geoserverUrl}?service=WFS&version=1.0.0&request=GetFeature&typeName=ne:noise_spatial_table&outputFormat=application/json`;

console.log("Fetching latest features:", latestUrl);

fetch(latestUrl)
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then(data => {
    console.log(`Loaded ${data.features.length} features`);

    L.geoJSON(data, {
      pointToLayer: (feature, latlng) => {
        return L.circleMarker(latlng, {
          radius: 6,
          color: "#ff0000",
          fillColor: "#ff6666",
          fillOpacity: 0.8
        }).on('click', () => {
          loadHistoryByCoord(latlng.lng, latlng.lat, latlng);
        });
      }
    }).addTo(map);
  })
  .catch(err => console.error("Error loading GeoJSON:", err));
