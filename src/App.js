import React, { useState, useEffect } from 'react';
import './App.css';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import AsyncSelect from 'react-select/async';
import { debounce } from "lodash";
import { loadOptions, fetchImage } from "./services/requests";

const wait = 0;
const zoom = 9;
const scrollWheelZoom = true;
const startLocation = {
  value: {
    lat: 29.78,
    lon: -95.33
  },
  label: ""
};

function App() {
  const [location, setLocation] = useState(startLocation);
  const [map, setMap] = useState(null);
  const [imageStatus, setImageStatus] = useState(false);
  const { value } = location;

  useEffect(() => {
    loadImage()
    map && map.panTo([location.value.lat, location.value.lon]);
  });

  // tried to use lodash debounce, but seems it don't work with react-select/async
  // const debounceLoadOptions = debounce(loadOptions, wait);

  async function loadImage() {
    try {
      const src = await fetchImage(value.lat, value.lon);
      setImageStatus(true);
      document.getElementById('js-satellite-image').src = src;
    } catch (error) {
      setImageStatus(false);
      console.error(error);
    }
  }

  return (
    <div className="app-container">
      <div className="map-container">
        <MapContainer whenCreated={setMap} className="map" center={[value.lat, value.lon]} zoom={zoom} scrollWheelZoom={scrollWheelZoom}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </div>
      <div className="search-container">
        <div className="search-input">
          <AsyncSelect
            onChange={setLocation} loadOptions={loadOptions} placeholder="Search..." />
        </div></div>
      <div className="image-container">
        {imageStatus ? <img id='js-satellite-image' className='satellite-image'></img> : <p>No image :(</p>}
      </div>
    </div>
  );
}

export default App;
