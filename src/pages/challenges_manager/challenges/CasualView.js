import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import helpers from 'utils/helpers';

const CasualView = () => {

  const location = useLocation();
  const { t } = useTranslation();
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

  ];


  const { type } = location.state;
  console.log("type", type)

  const renderTableCell = (content, classNames) => (
    <td className={classNames}>{content}</td>
  );

  const renderTableRows = () => {
    return staticUsers?.map((item, i) => {
      return (
        <tr key={i} >
          {
            type === "monetary" && <> {renderTableCell(item.name, "bg-white py-4 px-4 border-r border dark:border-[#ffffff38] text-center")}</>
          }
          {renderTableCell(item.userId, "bg-white py-4 px-4 border-r border dark:border-[#ffffff38]")}
          {renderTableCell(item.name, "bg-white py-4 px-4 border-r border dark:border-[#ffffff38] text-center")}
          {renderTableCell(i + 1, "py-4 px-3 border-r border font-medium text-gray-900 dark:text-white dark:border-[#ffffff38] text-center")}
          {renderTableCell(item.userId, "bg-white py-4 px-4 border-r border dark:border-[#ffffff38] text-center")}
          {renderTableCell(item.name, "bg-white py-4 px-4 border-r border dark:border-[#ffffff38] text-center")}

          {
            type === "monetary" && <> {renderTableCell(item.name, "bg-white py-4 px-4 border-r border dark:border-[#ffffff38] text-center")}  {renderTableCell(item.name, "bg-white py-4 px-4 border-r border dark:border-[#ffffff38] text-center")}</>
          }

          {renderTableCell(item.name, "bg-white py-4 px-4 border-r border dark:border-[#ffffff38] text-center")}
        </tr>
      );

    });
  };
  return (
    <div className="p-6">
      <div className='grid grid-cols-2 gap-x-5'>
        <div className="border border-gray-300  mb-4">
          <header className="border-b  py-2 px-4 bg-gray-100 rounded-t-md dark:bg-gray-800 "><div className="font-semibold dark:text-white">Challenge Created Detail</div></header>
          <div className="grid grid-cols-2 gap-4 mt-2 p-4">
            <div>
              <strong>Creator Name: </strong>Mohan
            </div>
            <div>
              <strong>User Name: </strong>Mohan12
            </div>
         
            {
              helpers?.ternaryCondition(type === "monetary" , <div>
                <strong>Monetary Rating: </strong>800
              </div>, <div>
                <strong>Casual Rating: </strong>800
              </div>)
            }
            <div>
              <strong>Date of creation: </strong>12-June-2024
            </div>
            <div>
              <strong>Country: </strong>India
            </div>
          </div>
        </div>

        <div className="border border-gray-300 mb-4">
          <header className="border-b  py-2 px-4 bg-gray-100 rounded-t-md dark:bg-gray-800 "><div className="font-semibold dark:text-white">Challenge Detail</div></header>

          <div className="grid grid-cols-2 gap-4 mt-2  p-4">
            <div>
              <strong>Challenge ID: </strong>12
            </div>
            <div>
              <strong>Time Format: </strong>10:00 Min
            </div>
            <div>
              <strong>Acceptor Rating Min Range: </strong>800
            </div>
            <div>
              <strong>Acceptor Rating Max Range: </strong>1000
            </div>
            <div>
              <strong>Acceptor Side: </strong>
            </div>
            <div>
              <strong>Challenge Type: </strong>Instant
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
            {renderTableRows()}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default CasualView;
