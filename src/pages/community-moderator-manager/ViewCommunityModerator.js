import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { apiGet } from "utils/apiFetch";
import apiPath from "utils/apiPath";
import helpers from "utils/helpers";
import dayjs from "dayjs";

function ViewCommunityModerator() {
    const location = useLocation();
    const item = location.state;
    const [viewList,setViewList]=useState({})
    console.log("item", item);


    const viewCommunityList  = async () =>{
        try{
          const result = await apiGet(`${apiPath?.communityModeratror}/${item?._id}`)
          if(result?.data?.success)
          {
            setViewList(result?.data?.results)
          }
        }
        catch(err){
              console.log("error",err)
        }
    }

    useEffect(()=>{
      viewCommunityList()
    },[item?._id])

    console.log("viewList",viewList)

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
              <ul>
                <li className="mb-2"><strong>User Name :</strong> <span>{helpers?.ternaryCondition(viewList?.username,viewList?.username,"N/A")}</span></li>
                <li className="mb-2"><strong>Post Title :</strong> <span>{helpers?.ternaryCondition(viewList?.postTitle,viewList?.postTitle,"N/A")}</span></li>
                <li className="mb-2"><strong>Date of post :</strong> <span>{helpers?.ternaryCondition(viewList?.createdAt,dayjs(viewList?.createdAt).format("DD-MM-YYYY"),"N/A")}</span></li>
                <li className="mb-2"><strong>Description :</strong> <span>{helpers?.ternaryCondition(viewList?.description,viewList?.description,"N/A")}</span></li>
              </ul>
            </div>

           
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewCommunityModerator;
