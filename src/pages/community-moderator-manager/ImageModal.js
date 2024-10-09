
import React from "react";
const ImageModal = ({handleZoomImage,showZoomImage,image}) => {
  

    return (
        <div>
            <div className="justify-center items-center  overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative my-6 w-[800px] m-auto">
                    <div className="sm:py-4 sm:px-2 py-8 px-7 ">
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        <button className="absolute bg-black  right-[-10px] top-[-10px] ml-auto flex items-center justify-center  text-black rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none" onClick={() => handleZoomImage()}>
                                    <span className=" text-[#ffff]  text-2xl " title="Close">
                                        ×
                                    </span>
                                </button>
                            <div className="h-[600px] dark:bg-gray-900 flex items-center justify-between p-5">
                               {
                                showZoomImage &&  <img src={image} alt="" className="w-full h-full object-cover"/>
                               }
                             
                            </div>    
                        </div>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black" />
        </div>
    );
};

export default ImageModal;
