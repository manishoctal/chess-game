import React, { useContext } from "react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import AuthContext from "context/AuthContext";
import { isEmpty } from "lodash";
import { Link } from "react-router-dom";
import { AiFillEdit } from "react-icons/ai";

const Table = ({ emailTemplate, page, manager }) => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);

  return (
    <div className="p-3">
      <div className="overflow-x-auto relative rounded-lg border">
        <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
          <thead className="text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]">
            <tr>
              <th scope="col" className="py-3 px-6">
                {" "}
                {t("S.NO")}
              </th>
              <th scope="col" className="py-3 px-3">
                {t("EMAIL_TEMPLATE_NAME")}
              </th>
              <th scope="col" className="py-3 px-3">
                {t("O_SUBJECT")}
              </th>
              <th scope="col" className="py-3 px-3">
                {t("O_UPDATED_AT")}
              </th>

              {(manager?.add || user?.role === "admin") && (
                <>
                  <th scope="col" className="py-3 px-6 text-center">
                    {t("O_ACTION")}
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {emailTemplate?.map((item, i) => (
              <tr key={item?._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="py-2 px-4 border-r dark:border-[#ffffff38] font-medium text-gray-900 text-center dark:text-white">
                  {i + 1 + 10 * (page - 1)}
                </th>
                <td className="py-2 px-4 border-r dark:border-[#ffffff38]">{item?.title}</td>
                <td className="py-2 px-4 border-r dark:border-[#ffffff38]">{item?.subject}</td>
                <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center">{dayjs(item?.updatedAt).format("DD-MM-YYYY h:mm A")} </td>

                {(manager?.add || manager?.edit || user?.role === "admin") && (
                  <>
                    <td className="py-2 px-4 border-l">
                      <div className="">
                        <ul className="flex justify-center">
                          <td className="py-2 px-6 flex justify-center">
                            <Link to="/email-manager/edit" state={{ item, type: "edit" }} title={t("O_EDIT")}>
                              <div className="">
                                <AiFillEdit className="cursor-pointer w-5 h-5 text-slate-600" />
                              </div>
                            </Link>
                          </td>
                        </ul>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {isEmpty(emailTemplate) ? (
              <tr className="bg-white border-b w-full text-center dark:bg-gray-800 dark:border-gray-700">
                <td className="py-4 px-6" colSpan={12}>
                  {t("O_NO_RECORD_FOUND")}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
