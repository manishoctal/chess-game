import { AiFillEdit, AiFillEye } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { useContext, useEffect } from "react";
import { isEmpty } from "lodash";
import AuthContext from "context/AuthContext";
import { Link } from "react-router-dom";
import OStaticTableHead from "../../components/reusable/OTableHead";

const StaticContentList = ({ countryList, page, handleEdit, sort, setSort, manager }) => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const { updatePageName } = useContext(AuthContext);

  useEffect(() => {
    updatePageName(t("NAV_STATIC_CONTENTS"));
  }, []);

  return (
    <div>
      <div className="p-3">
        <div className="overflow-x-auto relative rounded-lg border">
          <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
            <thead className="text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]">
              <tr>
                <th scope="col" className="py-3 px-6">
                  {t("S.NO")}
                </th>

                <OStaticTableHead sort={sort} setSort={setSort} name="Title" fieldName="title" />
                <OStaticTableHead sort={sort} setSort={setSort} name="O_UPDATED_AT" fieldName="updatedAt" />
                {(manager?.add || manager?.edit || user?.role === "admin") && <OStaticTableHead sort={sort} setSort={setSort} name="O_STATUS" fieldName="status" classTd={"justify-center"} />}
              </tr>
            </thead>
            <tbody>
              {countryList.map((item, i) => {
                return (
                  <tr key={item?._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th scope="row" className="py-2 px-4 border-r dark:border-[#ffffff38] font-medium text-gray-900 text-center dark:text-white">
                      {i + 1 + 10 * (page - 1)}
                    </th>
                    <td className="py-2 px-4 border-r dark:border-[#ffffff38]">{item?.title || "N/A"}</td>
                    <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center">{dayjs(item?.updatedAt).format("DD-MM-YYYY h:mm A")} </td>
                    {(manager?.add || user?.role === "admin") && (
                      <td className="py-2 px-4 border-l ">
                        <div className="">
                          <ul className="flex justify-center">
                            {item?.slug !== "faq" ? (
                              <li onClick={() => handleEdit(item)} className="px-2 py-2 hover:bg-white hover:text-gradientTo">
                                <Link title="Edit" className="hover:text-blue-700 transition duration-150 ease-in-out" data-bs-toggle="tooltip">
                                  <AiFillEdit className="cursor-pointer w-5 h-5 text-slate-600" />
                                </Link>
                              </li>
                            ) : (
                            
                                <li className="px-2 py-2 hover:bg-white hover:text-gradientTo">
                                  <Link title="view" className="hover:text-blue-700 transition duration-150 ease-in-out" data-bs-toggle="tooltip" to="/faqs">
                                    <AiFillEye className="cursor-pointer w-5 h-5 text-slate-600" />
                                  </Link>
                                </li>
                            )}
                          </ul>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
              {isEmpty(countryList) ? (
                <tr className="bg-white border-b text-center dark:bg-gray-800 dark:border-gray-700">
                  <td className="py-2 px-4 border-r dark:border-[#ffffff38]" colSpan={6}>
                    {t("O_NO_RECORD_FOUND")}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaticContentList;
