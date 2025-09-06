import React from 'react';

const RoomCard = ({ room }) => {
  return (
    <div className="border border-gray-300 rounded-lg p-5 shadow-sm hover:shadow-md transition cursor-pointer bg-white">
      <h2 className="text-lg font-semibold mb-2">{room.name}</h2>
      <p className="text-gray-600">{room.description}</p>
    </div>
  );
};

export default RoomCard;
