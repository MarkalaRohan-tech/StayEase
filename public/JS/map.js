async function initMap() {
  try {
    if (!locationData || typeof locationData !== "string") {
      throw new Error("Invalid location input");
    }

    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      locationData
    )}&count=1&format=json`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Geocoding API error: ${res.status}`);
    }

    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      throw new Error("Location not found");
    }

    const { latitude: lat, longitude: lng } = data.results[0];

    const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat, lng },
      zoom: 10,
      mapTypeId: "terrain",
    });

    const marker = new google.maps.Marker({
      position: { lat, lng },
      map,
      title: `${placeName}`,
      animation: google.maps.Animation.BOUNCE,
      icon: {
        url: "/images/marker.png",
        scaledSize: new google.maps.Size(40, 40),
      },
    });

    const infowindow = new google.maps.InfoWindow({
      content: `<p>${placeName}</p>`,
    });

    infowindow.open(map, marker);

  } catch (error) {
    console.error("Failed to initialize map:", error.message);
    alert("Map loading failed: " + error.message); 
  }

}
