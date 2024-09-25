import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaCircleArrowLeft } from "react-icons/fa6";

function ViewCommunityModerator() {
    const location = useLocation();
    const item = location.state;
    console.log("item", item);

  return (
    <div>
      <div className="bg-[#F9F9F9] dark:bg-slate-900">
        <div className="px-3 py-4">
          <div className="flex active mb-5 ml-4 ">
            <Link aria-current="page" className="" to={-1}>
              <FaCircleArrowLeft size={27} />
            </Link>
          </div>
          <div className="bg-white border border-[#E9EDF9] rounded-lg dark:bg-slate-800 dark:border-[#ffffff38]">
           <h2>Hello</h2>
           
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewCommunityModerator;
