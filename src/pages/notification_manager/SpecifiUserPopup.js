import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoClose } from "react-icons/io5";
import { apiGet } from "utils/apiFetch";
import apiPath from "utils/apiPath";

const SpecifiUserPopup = ({ handleSpecificUser }) => {
    const { t } = useTranslation();
    const [userList,setUserList]=useState([])

    const getSpecificUserList = async() =>{
           try{
            const res = await apiGet(apiPath?.specificUserApiList);
            if(res?.data?.status===200)
            {
                setUserList(res?.data?.results)
            }

           }
           catch(error){
            console.log("errr",error)
           }
    }

    useEffect(()=>{
        getSpecificUserList()
    },[])

  return (
    <div>
      <div className="justify-center items-center  overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative my-6 mx-auto max-w-[480px]">
          <div className="sm:py-4 sm:px-2 py-8 px-7 ">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="dark:bg-gray-900 flex items-center justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                <h3 className="text-xl font-semibold dark:text-white">{t("OFFERS_SPECIFIC_USERS")}</h3>
                <button className=" ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none" onClick={() => handleSpecificUser(false)}>
                  <span className=" text-[#B8BBBF]  text-4xl " title="Close">
                    ×
                  </span>
                </button>
              </div>

              <div className="p-5 py-3">
                <ul className="max-h-[300px] overflow-y-auto">
                   {
                    userList && userList?.length > 0 && userList?.map((item,i)=>{
                        return  <li className="flex items-center py-2 border-b last:border-none" key={i}>

                        <figcaption>
                            {item?.userName}
                            <div className="text-slate-500 text-sm">{item?.email}</div>
                        </figcaption>
                    </li>
                    })
                   }

                   {
                    isEmpty(userList) &&  <div className="py-4 px-6 text-center">
                    {t("O_NO_RECORD_FOUND")}
                  </div>
                   }
                </ul>

              </div>
           
              <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b dark:bg-gray-900">
                <button
                  className="text-black bg-[#E1E1E1] font-normal px-6 flex gap-2 py-2.5 text-sm outline-none focus:outline-none rounded  ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => handleSpecificUser(false)}
                  title={t("O_CLOSE")}
                >
                  <IoClose size={19} />
                  {t("O_CLOSE")}
                </button>
          
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black" />
    </div>
  );
};

export default SpecifiUserPopup;
