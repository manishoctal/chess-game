import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { startCase } from "lodash";
import { useNavigate, useLocation } from "react-router-dom";
import AuthContext from "context/AuthContext";
import helpers from "utils/helpers";
import { Buffer } from 'buffer'
const StaticContentView = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { updatePageName } = useContext(AuthContext);
  const navigate = useNavigate();
  const [content,setContent]=useState()
  useEffect(() => {
    updatePageName(t("VIEW_STATIC_CONTENT"));
  }, []);


  const getContent = async () => {
    const newContent = await Buffer.from(location?.state?.content, 'base64').toString(
      'ascii'
    )
    setContent(newContent)
  }

  useEffect(()=>{
    if(location?.state?.content) getContent()
  },[location])

  return (
    <>
      <div>
        <div className="bg-[#F9F9F9]">
          <div className="px-3 py-4">
            <div className="bg-white border border-[#E9EDF9] rounded-lg">
              <div className=" border-b-[#E3E3E3] grid 2xl:grid-cols-3 xl:grid-cols-2 lg:grid lg:grid-cols-1 gap-2 px-4 ">
                <div className="col-span-3 flex flex-wrap  items-center" />
              </div>
              <div className="relative p-6 flex-auto">
                <div className="grid grid-cols-3">
                  <div className="sm:py-4 sm:px-2 py-8 px-7 col-span-1">
                    <div className="relative z-0 w-full group">
                      <strong>Title:</strong>
                      <h6>{location?.state?.title || "N/A"}</h6>
                    </div>
                  </div>
                  <div className="sm:py-4 sm:px-2 py-8 px-7 col-span-1">
                    <div className="relative z-0 w-full group">
                      <strong>Status:</strong>
                      <h6>{startCase(location?.state?.status) || "N/A"}</h6>
                    </div>
                  </div>
                  <div className="sm:py-4 sm:px-2 py-8 px-7 col-span-1">
                    <div className="relative z-0 w-full group">
                      <strong>Created date:</strong>
                      <h6>
                        {helpers.getDateAndTime(location?.state?.createdAt)}
                      </h6>
                    </div>
                  </div>
                 
                  <div className="sm:py-4 sm:px-2 py-8 px-7 col-span-3 max-h-[540px] overflow-y-auto">
                    <div className="relative z-0 w-full group">
                      <strong>Description:</strong>
                      <div
                        className="break-words"
                        dangerouslySetInnerHTML={{
                          __html: content || "N/A",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
        <button
          className="text-black bg-[#E1E1E1] font-normal px-12 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150"
          type="button"
          onClick={() => navigate("/static-content")}
        >
          {t("CLOSE")}
        </button>
      </div>
    </>
  );
};

export default StaticContentView;
