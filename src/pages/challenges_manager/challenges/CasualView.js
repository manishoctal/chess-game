import React from 'react';

const CasualView = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="border border-gray-300 p-4 mb-4">
        <h2 className="font-bold">Challenge created detail</h2>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <strong>Creator Name: </strong>Mohan
          </div>
          <div>
            <strong>User Name: </strong>Mohan12
          </div>
          <div>
            <strong>Free Rating: </strong>800
          </div>
          <div>
            <strong>Date of creation: </strong>12-June-2024
          </div>
          <div>
            <strong>Country: </strong>India
          </div>
        </div>
      </div>

      <div className="border border-gray-300 p-4 mb-4">
        <h2 className="font-bold">Challenge detail</h2>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <strong>Challenge ID: </strong>12
          </div>
          <div>
            <strong>Time: </strong>10:00 Min
          </div>
          <div>
            <strong>Acceptor min rating Range: </strong>800
          </div>
          <div>
            <strong>Acceptor Max rating Range: </strong>1000
          </div>
          <div>
            <strong>Acceptor's Side: </strong>
            {/* Add Acceptor side icon here */}
          </div>
          <div>
            <strong>Challenge Type: </strong>Instant
          </div>
        </div>
      </div>

      <div className="border border-gray-300 p-4">
        <h2 className="font-bold text-center">Match</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr className="w-full bg-gray-200">
              <th className="px-4 py-2">Time format</th>
              <th className="px-4 py-2">Players</th>
              <th className="px-4 py-2">Result</th>
              <th className="px-4 py-2">Moves</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center">
              <td className="px-4 py-2">10 min</td>
              <td className="px-4 py-2">
                <div className="flex items-center justify-center">
                  <span className="mr-2">Opponent(2000)</span>
                  <span>user123(800)</span>
                </div>
              </td>
              <td className="px-4 py-2">Opponent(2000) Won</td>
              <td className="px-4 py-2">12</td>
              <td className="px-4 py-2">12-09-2023</td>
              <td className="px-4 py-2 text-blue-600 cursor-pointer">Review</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CasualView;
