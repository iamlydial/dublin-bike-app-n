import React from "react";
import BikeStation from "../pages/BikeStation";

const BikeStationCard = ({index, bikeStations}) => {
  console.log(BikeStation)
  return <div>
    {bikeStations.id}
  </div>;
};

export default BikeStationCard;
