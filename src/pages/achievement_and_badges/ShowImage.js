import OImage from "components/reusable/OImage";
import React from "react";

const ShowImage = ({ handleShowImage, showImage }) => {
  console.log("showImage", showImage);
  return (
    <div>
      <div className="justify-center items-center  overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none flex">
        <div className="relative my-6 mx-auto w-[300px]">
          <div className="sm:py-4 sm:px-2 py-8 px-7 ">
            <button
              className="top-0 bg-black text-white absolute z-50 right-0 ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none"
              onClick={() => handleShowImage()}
            >
              <span className="text-4xl" title="Close">
                ×
              </span>
            </button>
            <div className="overflow-hidden border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="flex justify-center">
                <OImage src={showImage?.image} className="w-full h-full object-cover text-center" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black" />
    </div>
  );
};

export default ShowImage;
