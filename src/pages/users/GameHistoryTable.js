import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, } from "react-router-dom";
import { FaCircleArrowLeft } from "react-icons/fa6";

const GameHistoryTable = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('Tab1');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const renderTableCell = (content, classNames) => (
    <td className={classNames}>{content}</td>
  );


  console.log("activeTab", activeTab)
  const staticUsers = [
    {
      id: 1,
      userId: "U001",
      name: "John Doe",
      userName: "johndoe",
      email: "john@example.com",
      mobile: "123-456-7890",
      userType: "Admin",
      status: "Active"
    },
    {
      id: 2,
      userId: "U002",
      name: "Jane Smith",
      userName: "janesmith",
      email: "jane@example.com",
      mobile: "098-765-4321",
      userType: "User",
      status: "Inactive"
    },
    {
      id: 3,
      userId: "U003",
      name: "Robert Brown",
      userName: "robertbrown",
      email: "robert@example.com",
      mobile: "555-555-5555",
      userType: "Guest",
      status: "Active"
    }
  ];



  const renderTableRows = () => {
    return staticUsers?.map((item, i) => {
      return (
        <tr key={i} >
          {renderTableCell(i + 1, "py-4 px-4 border-r border font-medium text-gray-900 dark:text-white dark:border-[#ffffff38]")}
          {renderTableCell(item.userId, "bg-white py-4 px-6 border-r border dark:border-[#ffffff38]")}
          {renderTableCell(item.name, "bg-white py-4 px-6 border-r border dark:border-[#ffffff38]")}
          {renderTableCell(i + 1, "py-4 px-6 border-r border font-medium text-gray-900 dark:text-white dark:border-[#ffffff38]")}
          {renderTableCell(item.userId, "bg-white py-4 px-6 border-r border dark:border-[#ffffff38]")}
          {renderTableCell(item.name, "bg-white py-4 px-6 border-r border dark:border-[#ffffff38]")}
          {renderTableCell(item.name, "bg-white py-4 px-6 border-r border dark:border-[#ffffff38]")}

          {
            activeTab === "Tab2" && <>  
              {renderTableCell(item.name, "bg-white py-4 px-6 border-r border dark:border-[#ffffff38]")}
              {renderTableCell(item.name, "bg-white py-4 px-6 border-r border dark:border-[#ffffff38]")}</>
          }

        </tr>
      );

    });
  };

  return (
  
      <div className="p-5">
    
        <div className="tabs-header flex items-center justify-between mb-10">
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

        <div className="overflow-x-auto relative rounded-lg border">
          <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
            <thead className="text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]">
              <tr>
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
            <tbody>
              {renderTableRows()}
            </tbody>
          </table>
        </div>
      </div>


  );
};

export default GameHistoryTable;
