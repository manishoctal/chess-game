import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { apiGet } from "utils/apiFetch";
import apiPath from "utils/apiPath";
import helpers from "utils/helpers";
import dayjs from "dayjs";
import ReactCountryFlag from "react-country-flag";
import ImageModal from "./ImageModal";
import { startCase } from "lodash";


function ViewCommunityModerator() {
  const location = useLocation();
  const [zoomImage, setZoomImage] = useState(false);
  const item = location?.state;
  const [viewList, setViewList] = useState({})

  const showZoomImage = viewList?.mediaType === "image"

  const handleZoomImage = () => {
    setZoomImage(!zoomImage)
  }
  const viewCommunityList = async () => {
    try {
      const result = await apiGet(`${apiPath?.communityModeratror}/${item?._id}`)
      if (result?.data?.success) {
        setViewList(result?.data?.results)
      }
    }
    catch (err) {
      console.log("error", err)
    }
  }

  useEffect(() => {
    viewCommunityList()
  }, [])


  console.log("viewList",viewList)

  const showCountryFlag = helpers?.countryFlag(viewList?.user?.currency);

  return (
    <div>
      <div className="bg-[#F9F9F9] dark:bg-slate-900">
        <div className="px-3 py-4">
          <div className="flex active mb-5 ml-4 ">
            <Link aria-current="page" className="" to={-1}>
              <FaCircleArrowLeft size={27} />
            </Link>
          </div>
          <div className="bg-white border border-[#E9EDF9] rounded-lg dark:bg-slate-800 dark:border-[#ffffff38] p-5">

            <div>


              <div className="w-[400px] border mb-5">
                <div className="p-5 mb-2 h-[300px]">{helpers?.ternaryCondition(viewList?.mediaType === "image",
                  <button onClick={() => handleZoomImage()} className="w-full h-full cursor-pointer">
                    <img src={viewList?.file} alt="" className="w-full h-full object-cover" />
                  </button>,
                  <iframe
                    width="355"
                    height="280"
                    src={viewList?.file}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                )}
                </div>

                <div className="border p-4 flex items-center justify-between">
                  <strong>Like : <span className="font-light">{helpers?.ternaryCondition(viewList?.likeCount, viewList?.likeCount, "0")}</span></strong>
                  <strong>Comment : <span className="font-light">{helpers?.ternaryCondition(viewList?.commentCount, viewList?.commentCount, "0")}</span></strong>
                </div>

              </div>
              <ul className="list-disc ml-5">
                <div className="mb-3">
                  <ReactCountryFlag
                    countryCode={showCountryFlag}
                    svg
                    title={showCountryFlag}
                    style={{
                      width: '2em',
                      height: '2em',
                    }}
                  />
                </div>
                <li className="mb-3"><strong>User Name :</strong> <span>{helpers?.ternaryCondition(viewList?.user?.userName, startCase(viewList?.user?.userName), "N/A")}</span> </li>
                <li className="mb-3"><strong>Post Title :</strong> <span>{helpers?.ternaryCondition(viewList?.postTitle, startCase(viewList?.postTitle), "N/A")}</span></li>
                <li className="mb-3"><strong>Date of Post :</strong> <span>{helpers?.ternaryCondition(viewList?.createdAt, dayjs(viewList?.createdAt).format("DD-MM-YYYY"), "N/A")}</span></li>
                <li className="mb-3"><strong>Description :</strong> <span>{helpers?.ternaryCondition(viewList?.description, viewList?.description, "N/A")}</span></li>


              </ul>
            </div>


          </div>
        </div>
      </div>

      {

        zoomImage && <ImageModal handleZoomImage={handleZoomImage} showZoomImage={showZoomImage} image={viewList?.file} />

      }

    </div>
  );
}

export default ViewCommunityModerator;
