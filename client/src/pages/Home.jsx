import React from "react";
import BikeStationCard from "../component/BikeStationCard.jsx";

const Home = ({ bikeStations }) => {
  console.log(JSON.stringify(bikeStations, null, 2), "bikeStations");

  return (
    <div>
      <h1 className="text-3xl font-bold underline">A Bike API!</h1>
      <p>
        Fetches the Dublin Bikes dataset, derive its schema dynamically and
        allow users to perform basic queries on that data.
      </p>
      {bikeStations.map((bikeStation, index) => (
        <BikeStationCard key={index} bikeStation={bikeStation} />
      ))}
    </div>
  );
};

export default Home;
