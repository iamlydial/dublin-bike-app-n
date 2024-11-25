import React from "react";
import BikeStationCard from "../component/BikeStationCard.jsx";

const Home = ({ bikeStations }) => {
  console.log(JSON.stringify(bikeStations, null, 2), "bikeStations");

  return (
    <div className="">
      <div className="pb-5">
        <h1 className="text-3xl font-bold pb-4">A Bike API!</h1>
        <p>
          Fetches the Dublin Bikes dataset, derive its schema dynamically and
          allow users to perform basic queries on that data.
        </p>
      </div>
      <div className="flex flex-wrap gap-5">
        {bikeStations.map((bikeStation, index) => (
          <BikeStationCard key={index} bikeStation={bikeStation} />
        ))}
      </div>
    </div>
  );
};

export default Home;
