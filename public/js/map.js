mapboxgl.accessToken = mapToken;

if (listing.geometry && listing.geometry.coordinates) {
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: listing.geometry.coordinates,
    zoom: 9
  });

  const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 })
    .setHTML(`<h4>${listing.geometry?.name}</h4><p>Exact location provided after booking</p>`)

    )
    .addTo(map);
} else {
  console.error("Map coordinates missing in listing.");
}

