import React, { useEffect, useRef, useState } from "react";

const MapComponent = ({ children }: { children: any }) => {
  const [map, setMap] = useState<google.maps.Map>();
  const ref = useRef<any>(null);
  useEffect(() => {
    if (ref.current && !map)
      setMap(
        new window.google.maps.Map(ref.current, {
          center: new window.google.maps.LatLng(41.850033, -87.6500523),
          zoom: 2,
        })
      );
  }, [ref, map]);

  return (
    <div className=" w-full h-full" ref={ref}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          // @ts-ignore
          return React.cloneElement(child, { map });
        }
      })}
    </div>
  );
};

export default MapComponent;
