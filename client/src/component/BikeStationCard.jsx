import React from "react";

const BikeStationCard = ({ index, bikeStation }) => {
  console.log(bikeStation, "BikeStation");
  console.log(index, "index");
  return (
    <div className="grid grid-cols-2 w-auto p-10 border-4 border-gray-400 rounded-3xl">
      <div className="flex flex-col items-start">
        <p className=" text-gray-400">Bike Station Id: </p>
        <p className=" text-gray-400">Name: </p>
        <p className=" text-gray-400">Address: </p>
        <p className=" text-gray-400">Available Bike Stands: </p>
        <p className=" text-gray-400">Available Bikes:</p>
        <p className=" text-gray-400">Banking: </p>
        <p className=" text-gray-400">Bike Status:</p>
        <p className=" text-gray-400">Longitude: </p>
        <p className=" text-gray-400">Latitude: </p>
      </div>
      <div className="flex flex-col items-start">
        <p>{bikeStation.id}</p>
        <p>{bikeStation.name}</p>
        <p>{bikeStation.address}</p>
        <p>{bikeStation.availableBikeStands}</p>
        <p>{bikeStation.availableBikes}</p>
        <p>{bikeStation.banking}</p>
        <p>{bikeStation.status}</p>
        <p>{bikeStation.longitude ? bikeStation.longitude : "N/A"}</p>
        <p>{bikeStation.latitude ? bikeStation.latitude : "N/A"}</p>
      </div>
    </div>
  );
};

export default BikeStationCard;
