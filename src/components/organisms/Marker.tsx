import React, { useEffect, useState } from "react";

const Marker = ({
  position,
  magnitude,
}: {
  position: any;
  magnitude: number;
}) => {
  const [marker, setMarker] = useState<google.maps.Marker>();
  useEffect(() => {
    setMarker(
      new window.google.maps.Marker({
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: "red",
          fillOpacity: 0.2,
          scale: Math.pow(2, magnitude) / 2,
          strokeColor: "white",
          strokeWeight: 0.5,
        },
        position: new window.google.maps.LatLng(position.lat, position.lang),
      })
    );
    console.log(position);
  }, []);

  useEffect(() => {
    if (marker) {
      // marker.setOptions({
      //   position: new window.google.maps.LatLng(position.lat, position.lang),
      // });
      console.log(marker);
    }
  }, [marker, position]);

  return <div />;
};

export default Marker;
