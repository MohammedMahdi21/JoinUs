import { GoogleMap, MarkerF } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import useSharedEvent from "../../hooks/useSharedEvent";

const mapContainerStyle = {
  marginTop: "20px",
  width: "500px",
  height: "500px",
};

export default function MapComponent(props) {
  const [userCoords, setUserCoords] = useState(null);
  const { setMap } = props;
  const { event } = useSharedEvent();

  const onLoad = (marker) => {
    console.log("marker: ", marker);
  };

  // find user's coordinates
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserCoords({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      console.log("user Latitude is :", position.coords.latitude);
      console.log(" user Longitude is :", position.coords.longitude);
    });
  }, []);

  // event coordinates
  const center = { lat: event.lat, lng: event.lng };

  return (
    <GoogleMap
      zoom={12}
      center={center ? center : userCoords} // set center to event location, or user's location
      mapContainerStyle={mapContainerStyle}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
      }}
      onLoad={(map) => setMap(map)}
    >
      <MarkerF position={center} onLoad={onLoad} />
    </GoogleMap>
  );
}
