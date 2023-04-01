import { useEffect } from 'react';
import useStore from '../../store/store';
import 'leaflet/dist/leaflet.css';
import {
  MapContainer,
  TileLayer,
  Marker,
  ZoomControl,
  useMap,
} from 'react-leaflet';
import Leaflet from 'leaflet';
import useFormStore from '@/store/formStore';

const SetViewOnUserLocation = () => {
  const { setLocation } = useFormStore();
  const map = useMap();

  useEffect(() => {
    (async function init() {
      // delete Leaflet.Icon.Default.prototype._getIconUrl;
      Leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: 'leaflet/images/marker-icon-2x.png',
        iconUrl: 'leaflet/images/marker-icon.png',
        shadowUrl: 'leaflet/images/marker-shadow.png',
      });
    })();
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        map.setView(
          { lat: position.coords.latitude, lng: position.coords.longitude },
          12
        );
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error(error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: Infinity }
    );
  }, [map, setLocation]);

  return null;
};

const Map = () => {
  const { geoData, markers } = useStore();

  return (
    <MapContainer
      center={geoData}
      zoom={12}
      zoomControl={false}
      className="min-h-screen w-full"
    >
      <SetViewOnUserLocation />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {markers.length > 0 &&
        markers.map((marker, index) => {
          return <Marker key={index} position={marker.location} />;
        })}
      <ZoomControl position="topright" />
    </MapContainer>
  );
};

export default Map;
