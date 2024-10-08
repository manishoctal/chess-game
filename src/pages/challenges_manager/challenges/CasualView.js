import AuthContext from 'context/AuthContext';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GiHorseHead } from 'react-icons/gi';
import { useLocation } from 'react-router-dom';
import { apiGet } from 'utils/apiFetch';
import apiPath from 'utils/apiPath';
import helpers from 'utils/helpers';
import { startCase } from "lodash";


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
  console.log("type", type)
  console.log("item", item)

  const renderTableCell = (content, classNames) => (
    <td className={classNames}>{content}</td>
  );


  return (
    <div className="p-6">
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
                <strong>Monetary Rating: </strong>{helpers?.ternaryCondition(item?.creatorDetails?.userName, item?.creatorDetails?.userName, "N/A")}
              </div>, <div>
                <strong>Casual Rating: </strong>{helpers?.ternaryCondition(item?.creatorDetails?.rating, item?.creatorDetails?.rating, "N/A")}
              </div>)
            }
            <div>
              <strong>Date of creation: </strong>{dayjs(item?.createdAt).format("DD-MMMM-YYYY")}
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
              <strong>Acceptor Side: </strong> {helpers?.ternaryCondition(item?.acceptorSide === "white", <div className='bg-[#0096ff] p-2 rounded-full ml-3'>
                <GiHorseHead className={`${item?.acceptorSide === "white" && "text-white"}`} /></div>, <div className='bg-[#0096ff] p-2 rounded-full ml-3'>
                <GiHorseHead className={`${item?.acceptorSide === "black" && "text-black"}`} /></div>
                , "N/A")}
            </div>
            <div>
              <strong>Challenge Type: </strong>{helpers?.ternaryCondition(item?.type, startCase(item?.type), "N/A")}
            </div>
          </div>
        </div>

      </div>


      <div className="overflow-x-auto relative rounded-lg border">
        <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
          <thead className="text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]">
            <tr>


              {
                type === "monetary" && <th scope="col" className="py-3 px-6 text-left">
                  {t("CHALLENGE_ID")}
                </th>
              }


              <th scope="col" className="py-3 px-6 text-left">
                {t("TIME_FORMAT")}
              </th>


              <th scope="col" className="py-3 px-6 text-center">
                {t("CASUAL_PLAYER")}
              </th>

              <th scope="col" className="py-3 px-6 text-center">
                {t("RESULT")}
              </th>

              <th scope="col" className="py-3 px-6 text-center">
                {t("MOVES")}
              </th>


              <th scope="col" className="py-3 px-6 text-center">
                {t("DATE")}
              </th>

              {
                type === "monetary" &&
                <>
                  <th scope="col" className="py-3 px-6 text-left">
                    {t("WINNING_AMOUNT")}
                  </th>

                  <th scope="col" className="py-3 px-6 text-left">
                    {t("ADMIN_COMMISION")}
                  </th>

                </>
              }

              <th scope="col" className="py-3 px-6 text-center">
                {t("O_ACTION")}
              </th>
            </tr>
          </thead>
          <tbody>
            <td className="py-2 px-4 border-r dark:border-[#ffffff38]">{helpers?.ternaryCondition(item?.time, `${item?.time} Min`, "N/A")}</td>
            <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center">

              <div>
                <div className='flex items-center justify-center'>
                  <div className='flex items-center'>
                    {
                      item?.acceptorSide === "white" ? <GiHorseHead className='text-black mr-3' /> : <GiHorseHead className="mr-3" />
                    }
                  </div>
                  <span className='block'>
                    {helpers?.ternaryCondition(item?.creatorDetails?.userName, item?.creatorDetails?.userName, "N/A")} {helpers?.ternaryCondition(item?.creatorDetails?.rating, `(${item?.creatorDetails?.rating})`, "N/A")}

                  </span>
                </div>
                <div className='flex items-center justify-center mt-4'>
                  {
                    item?.acceptorSide === "white" ? <GiHorseHead className='mr-3' /> : <GiHorseHead className='text-black mr-3' />
                  }

                  <span className='block'>{helpers?.ternaryCondition(item?.acceptorDetails?.userName, item?.acceptorDetails?.userName, "")} {helpers?.ternaryCondition(item?.acceptorDetails?.rating, `(${item?.acceptorDetails?.rating})`, "N/A")}</span>

                </div>


              </div>



            </td>
            <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center">{helpers?.ternaryCondition(item?.winnerDetails?.userName, `(${item?.winnerDetails?.userName})`, "N/A")}</td>
            <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center">{helpers?.ternaryCondition(item?.totalMoves, item?.totalMoves, "N/A")}</td>
            <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center">{dayjs(item?.createdAt).format("DD-MMMM-YYYY")}</td>
            <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center"><button className='bg-gradientTo p-3 rounded-md text-white text-sm'>Review (Not working)</button></td>
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default CasualView;
