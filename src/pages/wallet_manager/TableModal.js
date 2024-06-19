import { useTranslation } from "react-i18next";
import { capitalize, startCase } from "lodash";
import { useEffect, useState } from "react";

const TableModal = ({ setModalTable, modalTable }) => {
  const { t } = useTranslation();

  const [dataItem, setData] = useState(modalTable?.permission);

  useEffect(() => {
    if (modalTable?.permission[0]?.manager === "dashboard") {
      modalTable?.permission?.shift();
      setData(modalTable?.permission);
    }
  }, []);

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none min-w-[762px]">
            <div className="flex items-center justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-xl font-semibold">Permission given</h3>
              <button
                className=" ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none"
                onClick={() => setModalTable(false)}
              >
                <a
                  title="Close"
                  className="hover:text-blue-700 transition duration-150 ease-in-out"
                  data-bs-toggle="tooltip"
                >
                  {" "}
                  <span className=" text-[#B8BBBF]  text-4xl ">×</span>
                </a>
              </button>
            </div>
            <div className="relative p-6 flex-auto">
              <div className="overflow-x-auto  overflow-y-auto relative rounded-lg border">
                <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
                  <thead className="text-xs text-gray-900 border  border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="py-3 px-6 ">
                        {t("SUB_ADMIN_MODULES")}
                      </th>
                      <th scope="col" className="py-3 px-6 ">
                        {t("O_VIEW")}
                      </th>
                      <th scope="col" className="py-3 px-6 ">
                        {t("SUB_ADMIN_ADD_EDIT")}
                      </th>
                      <th scope="col" className="py-3 px-6 ">
                        {t("O_DELETE")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataItem?.map((data, i) => (
                      <tr
                        key={i}
                        className="bg-white border-b  dark:bg-gray-800 dark:border-gray-700"
                      >
                        <td className="py-2 px-4 border-r dark:border-[#ffffff38] ">
                          {capitalize(startCase(data.manager))}
                        </td>
                        <td className="py-2 px-4 border-r dark:border-[#ffffff38] ">
                          {data?.shownView && (
                            <input
                              type="checkbox"
                              name={data?.manager}
                              id="view"
                              checked={data.view}
                              disabled
                            />
                          )}
                        </td>
                        <td className="py-2 px-4 border-r dark:border-[#ffffff38] ">
                          {data?.shownAdd && (
                            <input
                              type="checkbox"
                              name={data?.manager}
                              id="add"
                              checked={data.add}
                              disabled
                            />
                          )}
                        </td>
                        <td className="py-2 px-4 border-r dark:border-[#ffffff38] ">
                          {data?.shownEdit && (
                            <input
                              type="checkbox"
                              id="edit"
                              name={data?.manager}
                              checked={data.edit}
                              disabled
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
              <button
                className="text-black bg-[#E1E1E1] font-normal px-12 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150"
                type="button"
                onClick={() => setModalTable(false)}
              >
                {t("O_BACK")}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black" />
    </>
  );
};

export default TableModal;
