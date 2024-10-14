import { isEmpty, startCase } from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoClose } from "react-icons/io5";
import { apiGet } from "utils/apiFetch";
import apiPath from "utils/apiPath";
import helpers from "utils/helpers";

const SpecifiUserPopup = ({ handleSpecificUser, viewUser,notificationUser }) => {
  const { t } = useTranslation();
  const [userList, setUserList] = useState([])
  console.log('dfdfd',userList)

  const getSpecificUserList = async () => {

    try {
      const res = await apiGet(`${ helpers.ternaryCondition(notificationUser?.sendTo!=='subAdmin',apiPath?.specificUserApiList,apiPath?.getNotificationSubAdmin)}/${viewUser}`);
      console.log("res", res)
      if (res?.status === 200) {
        setUserList(res?.data?.results?.users)
      }

    }
    catch (error) {
      console.log("errr", error)
    }
  }

  useEffect(() => {
    getSpecificUserList()
  }, [])

  console.log("userList", userList)
  return (
    <div>
      <div className="justify-center items-center  overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative my-6 mx-auto max-w-[480px]">
          <div className="sm:py-4 sm:px-2 py-8 px-7 ">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="dark:bg-gray-900 flex items-center justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                <h3 className="text-xl font-semibold dark:text-white">
                  
                {notificationUser?.sendTo!=='subAdmin'?t("OFFERS_SPECIFIC_USERS"):t("SUB_ADMIN_USER")}
                </h3>
                <button className=" ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none" onClick={() => handleSpecificUser(false)}>
                  <span className=" text-[#B8BBBF]  text-4xl " title="Close">
                    ×
                  </span>
                </button>
              </div>

              <div className="p-5 py-3">

                <div className="overflow-x-auto relative rounded-lg border">
                  <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
                    <thead className="text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]">
                      <tr>
                        <th scope="col" className="py-3 px-3 text-center">
                          {notificationUser?.sendTo!=='subAdmin'?t("USERNAME"):t("FULL_NAME")}
                        </th>
                        <th scope="col" className="py-3 px-6 text-center">
                          {t("EMAIL")}
                        </th>

                      </tr>
                    </thead>
                    <tbody>
                      {
                        userList && userList?.length > 0 && userList?.map((item, i) => {
                          return <tr className="bg-white text-center border-b dark:bg-gray-800 dark:border-gray-700" key={i}>
                            <td className="py-2 px-4 border-r dark:border-[#ffffff38]"

                            >
                              {helpers?.ternaryCondition(notificationUser?.sendTo!=='subAdmin',item?.userName?startCase(item?.userName):'N/A',startCase(item?.firstName||'')+' '+ startCase(item?.lastName||'') )}
                            </td>

                            <td className="py-2 px-4 border-r dark:border-[#ffffff38]"
                            >
                              {helpers?.ternaryCondition(item?.email, item?.email, "N/A")}
                            </td>

                          </tr>
                        })
                      }

                      {helpers.ternaryCondition(
                        isEmpty(userList),
                        <tr className="bg-white text-center border-b dark:bg-gray-800 dark:border-gray-700">
                          <td
                            className="py-2 px-4 border-r dark:border-[#ffffff38]"
                            colSpan={13}
                          >
                            {t("O_NO_RECORD_FOUND")}
                          </td>
                        </tr>,
                        null
                      )}
                    </tbody>
                  </table>
                </div>


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
