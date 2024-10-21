import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import helpers from 'utils/helpers';
import { startCase } from "lodash";
import AuthContext from 'context/AuthContext';
import { FaCircleArrowLeft } from 'react-icons/fa6';
import ReactCountryFlag from 'react-country-flag';
import { GiHorseHead } from 'react-icons/gi';
import { Link, useLocation } from 'react-router-dom';
import { apiGet } from 'utils/apiFetch';
import apiPath from 'utils/apiPath';


const CasualView = () => {

  const location = useLocation();
  const { t } = useTranslation();
  const { logoutUser } = useContext(AuthContext)
  const [item, setItem] = useState({})


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

  const showAcceptorFlag = helpers?.countryFlag(item?.acceptorDetails?.currency);
  const showCreatorFlag = helpers?.countryFlag(item?.creatorDetails?.currency);

  return (
    <div className="p-6">

      <div className="flex active mb-5 ml-4 ">
        <Link aria-current="page" className="" to={-1}>
          <FaCircleArrowLeft size={27} />
        </Link>
      </div>

      <div className='grid grid-cols-2 gap-x-5'>
        <div className="border border-gray-300  mb-4">
          <header className="border-b  py-2 px-4 bg-gray-100 rounded-t-md dark:bg-gray-800 "><div className="font-semibold dark:text-white">Challenge Created Detail</div></header>
          <div className="grid grid-cols-2 gap-4 mt-2 p-4">
            <div>
              <strong>Creator Name: </strong>{helpers?.ternaryCondition(item?.creatorDetails?.fullName, item?.creatorDetails?.fullName, "N/A")}
            </div>
            <div>
              <strong>User Name: </strong>{helpers?.ternaryCondition(item?.creatorDetails?.userName, item?.creatorDetails?.userName, "N/A")}
            </div>

            {
              helpers?.ternaryCondition(type === "monetary", <div>
                <strong>Monetary Rating: </strong>{helpers?.ternaryCondition(item?.creatorDetails?.rating, item?.creatorDetails?.rating, "N/A")}
              </div>, <div>
                <strong>Casual Rating: </strong>{helpers?.ternaryCondition(item?.creatorDetails?.rating, item?.creatorDetails?.rating, "N/A")}
              </div>)
            }
            <div>
              <strong>Date of Creation: </strong>{dayjs(item?.createdAt).format("DD-MMMM-YYYY")}
            </div>
            <div>
              <strong>Country: </strong>{helpers?.ternaryCondition(item?.creatorDetails?.country, startCase(item?.creatorDetails?.country), "N/A")}
            </div>
        
          </div>
        </div>

        <div className="border border-gray-300 mb-4">
          <header className="border-b  py-2 px-4 bg-gray-100 rounded-t-md dark:bg-gray-800 "><div className="font-semibold dark:text-white">Challenge Detail</div></header>

          <div className="grid grid-cols-2 gap-4 mt-2  p-4">
            <div>
              <strong>Challenge ID: </strong>{helpers?.ternaryCondition(item?.challengeId, item?.challengeId, "N/A")}
            </div>
            <div>
              <strong>Time Format: </strong>{helpers?.ternaryCondition(item?.time, `${item?.time} Min`, "N/A")}
            </div>
            <div>
              <strong>Acceptor Rating Min Range: </strong>{helpers?.ternaryCondition(item?.minRating, item?.minRating, "N/A")}
            </div>
            <div>
              <strong>Acceptor Rating Max Range: </strong>{helpers?.ternaryCondition(item?.maxRating, item?.maxRating, "N/A")}
            </div>
            <div className='flex items-center'>
              <strong>Acceptor Side: </strong>
              {helpers?.ternaryCondition(item?.acceptorSide === "white", <GiHorseHead className='text-gray-400 ml-3 text-2xl' />, <GiHorseHead className="ml-3 text-2xl text-black" />)}
            </div>
            <div>
              <strong>Challenge Type: </strong>{helpers?.ternaryCondition(item?.type, startCase(item?.type), "N/A")}
            </div>
          </div>
        </div>

      </div>


     <div className='border overflow-hidden rounded-lg'>
     <header className="border-b  py-2 px-4 bg-gray-100 rounded-t-md dark:bg-gray-800 mb-4"><div className="font-semibold dark:text-white">Match Detail</div></header>

     <div className="overflow-x-auto relative rounded-lg ">
        <table className="w-full text-sm text-left text-[#A5A5A5] dark:text-gray-400 ">
          <thead className="text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]">
            <tr>


              {
                type === "monetary" && <th scope="col" className="py-3 px-6 text-left text-lg">
                  {t("CHALLENGE_ID")}
                </th>
              }


              <th scope="col" className="py-3 px-6 text-left text-lg">
                {t("TIME_FORMAT")}
              </th>


              <th scope="col" className="py-3 px-6 text-center text-lg">
                {t("CASUAL_PLAYER")}
              </th>

              <th scope="col" className="py-3 px-6 text-center text-lg">
                {t("RESULT")}
              </th>

              <th scope="col" className="py-3 px-6 text-center text-lg">
                {t("MOVES")}
              </th>


              <th scope="col" className="py-3 px-6 text-center text-lg">
                {t("DATE")}
              </th>

              {
                type === "monetary" &&
                <>
                  <th scope="col" className="py-3 px-6 text-left text-lg">
                    {t("WINNING_AMOUNT")}
                  </th>

                  <th scope="col" className="py-3 px-6 text-left text-lg">
                    {t("ADMIN_COMMISION")}
                  </th>

                </>
              }

              <th scope="col" className="py-3 px-6 text-center text-lg">
                {t("O_ACTION")}
              </th>
            </tr>
          </thead>
          <tbody className='text-black'>
            {
              type === "monetary" && <td className="py-2 px-4 border-r dark:border-[#ffffff38] pl-5">{helpers?.ternaryCondition(item?.challengeId, item?.challengeId, "N/A")}</td>

            }
            <td className="py-2 px-4 border-r dark:border-[#ffffff38] pl-5">{helpers?.ternaryCondition(item?.time, `${item?.time} Min`, "N/A")}</td>
            <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center">

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
            <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center">{helpers?.ternaryCondition(item?.winnerDetails?.userName, `(${item?.winnerDetails?.userName})`, "N/A")}</td>
            <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center">{helpers?.ternaryCondition(item?.totalMoves, item?.totalMoves, "N/A")}</td>
            <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center">{dayjs(item?.createdAt).format("DD-MMMM-YYYY")}</td>

            {
              type === "monetary" && <>
                <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center">{helpers?.ternaryCondition(item?.winningAmount, item?.winningAmount, "N/A")}</td>
                <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center">{helpers?.ternaryCondition(item?.adminComission, item?.adminComission, "N/A")}</td>
              </>
            }

            <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center"><button className='bg-gradientTo p-3 rounded-md text-white text-sm'>Review (Not working)</button></td>
          </tbody>
        </table>
      </div>
     </div>


    </div>
  );
};

export default CasualView;
