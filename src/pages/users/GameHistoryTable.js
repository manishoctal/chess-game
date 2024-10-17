import React, { useContext, useEffect, useState } from "react";
import { apiGet } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import Pagination from "../Pagination";
import AuthContext from "context/AuthContext";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import PageSizeList from "components/PageSizeList";
import helpers from "utils/helpers";
import { Link, useLocation } from "react-router-dom";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { isEmpty, startCase } from "lodash";
import ReactCountryFlag from "react-country-flag";
import { GiHorseHead } from "react-icons/gi";


function User() {
  const { t } = useTranslation();
  const location = useLocation();
  const [searchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const { logoutUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('Tab1');

  const [paginationObj, setPaginationObj] = useState({
    page: 1,
    pageCount: 1,
    pageRangeDisplayed: 10,
  });

  const [users, setAllUser] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isDelete] = useState(false);
  const [item, setItem] = useState({})

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const [filterData, setFilterData] = useState({
    kyc: undefined,
    category: location?.state,
    userId: "",
    searchKey: "",
    startDate: "",
    endDate: "",
    isReset: false,
    isFilter: false,
  });

  const userResult = helpers?.ternaryCondition(activeTab === "Tab1", "casual", "monetary")

  const getAllUser = async () => {
    try {

      const payload = {
        page,
        pageSize: pageSize,
      };
      
      const path = `${apiPath.gameHistory}/${location?.state?._id}/${userResult}`;
      const result = await apiGet(path, payload);
      if (result?.data?.success) {
        const response = result?.data?.results;
        setAllUser(response?.docs);
        const resultStatus = result?.data?.success;
        setPaginationObj({
          ...paginationObj,
          page: helpers.ternaryCondition(resultStatus, response.page, null),
          perPageItem: helpers.ternaryCondition(resultStatus, response?.docs.length, null),
          totalItems: helpers.ternaryCondition(resultStatus, response.totalDocs, null),
          pageCount: helpers.ternaryCondition(resultStatus, response.totalPages, null),
        });
      }
    } catch (error) {
      console.error("error ", error);
      setPaginationObj({});
      if (error.response.status === 401 || error.response.status === 409) {
        logoutUser();
      }
    }
  };

  const getChallengeDetails = async () => {
    try {

      const path = `${apiPath.challengesView}/${location?.state?._id}`;
      const result = await apiGet(path);
      if (result?.data?.success) {
        setItem(result?.data?.results)
      }
    } catch (error) {
      console.error("error ", error);
      if (error.response.status === 401 || error.response.status === 409) {
        logoutUser();
      }
    }
  }
  useEffect(() => {
    if (location?.state) {
      getChallengeDetails()
    }
  }, [location])

  const { type } = location.state;

  useEffect(() => {
    getAllUser();
  }, [page, filterData, pageSize, activeTab]);

  // get all user end
  const dynamicPage = (e) => {
    setPage(1);
    setPageSize(e.target.value);
  };

  const handlePageClick = (event) => {
    const newPage = event.selected + 1;
    setPage(newPage);
  };


  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
    } else if (searchTerm || !filterData?.isReset) {
      setFilterData({
        ...filterData,
        isReset: false,
        searchKey: debouncedSearchTerm || "",
        isFilter: !!debouncedSearchTerm,
      });
      setPage(1);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  const showCreatorFlag = helpers?.countryFlag(item?.creatorDetails?.currency);
  const showAcceptorFlag = helpers?.countryFlag(item?.acceptorDetails?.currency);

  return (
    <div className="">
      <div className="bg-[#F9F9F9] dark:bg-slate-900">
        <div className="px-3 py-4">

          <div className="bg-white border border-[#E9EDF9] rounded-lg dark:bg-slate-800 dark:border-[#ffffff38]">
   

          <div className="tabs-header flex items-center justify-between mb-10 p-5">
         <Link aria-current="page" className="" to={-1}>
            <FaCircleArrowLeft size={27} />
          </Link> 
            
         <div className="flex items-center">
         <button
            className={` mr-4 text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 ${activeTab === 'Tab1' ? 'bg-gradBlack' : 'bg-gradientTo'}`}
            onClick={() => handleTabClick('Tab1')}
          >
            {t("CASUAL_CHALLENGE")}
          </button>
          <button
            className={` text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 ${activeTab === 'Tab2' ? 'bg-gradBlack' : 'bg-gradientTo'}`}
            onClick={() => handleTabClick('Tab2')}
          >
            {t("MONETARY_CHALLENGE")}
          </button>
         </div>

        </div>

      <div className="p-5">
      <div className="overflow-x-auto relative rounded-lg border">
          <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
            <thead className="text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]">
              <tr>
              <th scope="col" className="py-3 px-3">
                  {t("S.NO")}
                </th>
                <th scope="col" className="py-3 px-3">
                  {t("MATCH")}
                </th>


                <th scope="col" className="py-3 px-6 text-left">
                  {t("TIME_FORMAT")}
                </th>


                <th scope="col" className="py-3 px-6 text-left">
                  {t("PLAYERS")}
                </th>

                <th scope="col" className="py-3 px-6 text-left">
                  {t("RATING_LOSE_GAIN")}
                </th>

                <th scope="col" className="py-3 px-6 text-left">
                  {t("RESULT")}
                </th>

                <th scope="col" className="py-3 px-6 text-left">
                  {t("MOVES")}
                </th>

                <th scope="col" className="py-3 px-6 text-left">
                  {t("DATE")}
                </th>

                {
                  activeTab === "Tab2" && <> <th scope="col" className="py-3 px-6 text-left">
                    {t("MONEY_AT_STACK")}
                  </th>

                    <th scope="col" className="py-3 px-6 text-left">
                      {t("ADMIN_COMMISION")}
                    </th></>
                }

              </tr>
            </thead>
            <tbody className='text-black'>
                {
                  users?.length > 0  && users?.map((item,i)=>{
                    return   <tr key={i}>
                       <th scope="row" className="py-4 px-6 border-r font-medium text-gray-900  dark:text-white">
                    {i + 1 + pageSize * (paginationObj?.page - 1)}
                  </th>
                    <td className="py-2 px-4 border-r dark:border-[#ffffff38] pl-5">{helpers?.ternaryCondition(item?.challengeId, item?.challengeId, "N/A")}</td>
          
                  
          <td className="py-2 px-4 border-r dark:border-[#ffffff38] pl-5">{helpers?.ternaryCondition(item?.time, `${item?.time} Min`, "N/A")}</td>
          <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-left">
          
            <div>
              <div className='flex items-center justify-center'>
               {
                helpers?.ternaryCondition(item?.creatorDetails?.userName,<div className='flex items-center'>
                   <div className='flex items-center'>
                  {
                    helpers?.ternaryCondition(item?.acceptorSide === "white", <GiHorseHead className='text-black mr-3 text-2xl' />, <GiHorseHead className="mr-3 text-2xl text-gray-500" />)
                  }
                </div>
                <span className='block'>
                  {helpers?.ternaryCondition(item?.creatorDetails?.userName, startCase(item?.creatorDetails?.userName), "")}
                  
                  {helpers?.ternaryCondition(item?.challengeType==="casual", `(${item?.creatorDetails?.ratingCasual})`, `(0)`)}
          
                </span>
          
          
                {
                  helpers?.ternaryCondition(showCreatorFlag, <div className='ml-3 rounded-full overflow-hidden border dynamic-flag w-[30px] h-[30px]'>
                    <ReactCountryFlag
                      countryCode={showCreatorFlag}
                      svg
                      title={showCreatorFlag}
                      className=''
                    />
                  </div>, "")
                }
                </div>,"N/A")
               }
              </div>
              <div className='flex items-center justify-center mt-4'>
                {helpers?.ternaryCondition(item?.acceptorDetails?.userName,   <div>
               {
                  helpers?.ternaryCondition(item?.acceptorSide === "white", <GiHorseHead className='mr-3 text-2xl text-gray-500' />, <GiHorseHead className='text-black mr-3 text-2xl' />)
                }
                <span className='block'>{helpers?.ternaryCondition(item?.acceptorDetails?.userName, startCase(item?.acceptorDetails?.userName), "")} 
                  {helpers?.ternaryCondition(item?.challengeType==="casual", `(${item?.acceptorDetails?.ratingCasual})`, `(0)`)}
                  </span>
                {
                  helpers?.ternaryCondition(showAcceptorFlag, <div className='ml-3 rounded-full overflow-hidden border dynamic-flag w-[30px] h-[30px]'>
                    <ReactCountryFlag
                      countryCode={showAcceptorFlag}
                      svg
                      title={showAcceptorFlag}
                      className=''
                    />
                  </div>, "")
                }
               </div>, "N/A")}
            
              </div>
            </div>
          
          </td>
          <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-left">{helpers?.ternaryCondition(item?.winnerDetails?.userName, `(${item?.winnerDetails?.userName})`, "N/A")}</td>

          <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-left">{helpers?.ternaryCondition(item?.winnerDetails?.userName, `(${item?.winnerDetails?.userName})`, "N/A")}</td>

          <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-left">{helpers?.ternaryCondition(item?.totalMoves, item?.totalMoves, "N/A")}</td>
          <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-left">{dayjs(item?.createdAt).format("DD-MMMM-YYYY")}</td>
          
          {
            type === "monetary" && <>
              <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-left">{helpers?.ternaryCondition(item?.winningAmount, item?.winningAmount, "N/A")}</td>
              <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-left">{helpers?.ternaryCondition(item?.adminComission, item?.adminComission, "N/A")}</td>
            </>
          }

          {
            activeTab === "Tab2" && <> <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-left">{helpers?.formattedAmount(item?.moneyAtStack)}</td>
          <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-left">{helpers?.formattedAmount(item?.adminCommission)}</td></>
          }
          
         


                    </tr>
          
                  })
                }
        
        {isEmpty(users) && (
              <tr className="bg-white text-center border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="py-4 px-6 border-r" colSpan={12}>
                  {t("O_NO_RECORD_FOUND")}
                </td>
              </tr>
            )}

          </tbody>
          </table>
        </div>
      </div>

            <div className="flex justify-between">
              <PageSizeList dynamicPage={dynamicPage} pageSize={pageSize} />
              {paginationObj?.totalItems ? (
                <Pagination handlePageClick={handlePageClick} options={paginationObj} isDelete={isDelete} page={page} />
              ) : null}
            </div>
          </div>
        </div>
      </div>





    </div>
  );
}
export default User;
