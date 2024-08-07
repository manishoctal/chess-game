import React, { useContext, useEffect, useState } from "react";
import { AiFillEdit, AiFillEye } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import AuthContext from "context/AuthContext";
import { isEmpty, startCase } from "lodash";
import { useNavigate } from "react-router-dom";
import helpers from "../../utils/helpers";
import OBadgesTableHead from "../../components/reusable/OTableHead";
import OImage from "components/reusable/OImage";
import ShowImage from "./ShowImage";
import { NavLink } from "react-router-dom";

const Table = ({ badges, page, sort, setSort, manager, handelStatusChange, pageSize, editViewBanner }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, updatePageName } = useContext(AuthContext);

  useEffect(() => {
    updatePageName(t("ACHIEVEMENT_AND_BADGES"));
  }, []);

  const getDateTable = (dateData) => {
    return <td className="py-2 px-4 border-r dark:border-[#ffffff38]">{dateData || "N/A"}</td>;
  };

  const [showImage, setShowImage] = useState();
  const [showBanner, setShowBanner] = useState(false);

  const handleShowImage = (showData) => {
    setShowImage(showData);
    setShowBanner(!showBanner);
  };

  return (
    <div className="p-3">
      <div className="overflow-x-auto relative rounded-lg border">
        <table className="w-full text-xs text-left text-[#A5A5A5] dark:text-gray-400 ">
          <thead className="text-xs text-gray-900 border border-[#E1E6EE] bg-[#E1E6EE] dark:bg-gray-700 dark:text-gray-400 dark:border-[#ffffff38]">
            <tr>
              <th scope="col" className="py-3 px-6">
                {t("S.NO")}
              </th>
              <OBadgesTableHead sort={sort} fieldName="achievementId" setSort={setSort} name="ID" />
              <OBadgesTableHead name="TYPE" fieldName="type" sort={sort} setSort={setSort} />
              <OBadgesTableHead name="NAME" fieldName="name" sort={sort} setSort={setSort} />
              <OBadgesTableHead name="DESCRIPTION" sort={sort} setSort={setSort} fieldName="description" />
              <OBadgesTableHead sort={sort} setSort={setSort} name="CRITERIA" fieldName="criteria" />
              <OBadgesTableHead sort={sort} setSort={setSort} name="GAME_TYPE" fieldName="gameType" />
              <OBadgesTableHead sort={sort} setSort={setSort} name="WON_MATCH_ELO_RATING" fieldName="rating" />
              <OBadgesTableHead sort={sort} setSort={setSort} name="O_CREATED_AT" fieldName="createdAt" />
              <OBadgesTableHead sort={sort} setSort={setSort} name="IMAGE" fieldName="image" />
              {(manager?.add || manager?.edit || user?.role === "admin") && <OBadgesTableHead sort={sort} setSort={setSort} name="O_STATUS" fieldName="status" classTd={" flex justify-center"} />}
              <th scope="col" className="py-3 px-6 text-center">
                {t("O_ACTION")}
              </th>
            </tr>
          </thead>
          <tbody>
            {badges?.map((item, i) => (
              <tr key={i} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="py-2 px-4 border-r dark:border-[#ffffff38] font-medium text-gray-900  dark:text-white">
                  {i + 1 + pageSize * (page - 1)}
                </th>

                <td className="py-2 px-4 border-r dark:border-[#ffffff38]">{startCase(item?.achievementId) || "N/A"}</td>

                <td className="py-2 px-4 border-r dark:border-[#ffffff38]">{startCase(item?.type)}</td>
                <td className="py-2 px-4 border-r dark:border-[#ffffff38]">{startCase(item?.name)}</td>

                <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-slate-900 font-bold">{item?.description || "N/A"}</td>

                <td className="py-2 px-4 border-r dark:border-[#ffffff38] font-bold">{item?.criteria || "N/A"}</td>
                <td className="py-2 px-4 border-r dark:border-[#ffffff38] w-[190px]">{startCase(item?.gameType) || "N/A"}</td>

                <td className="py-2 px-4 border-r dark:border-[#ffffff38]  font-bold text-slate-600 text-center">{item?.rating || "N/A"}</td>

                {getDateTable(helpers.getDateAndTime(item?.createdAt) || "N/A")}
                <td className="py-2 px-4 border-r dark:border-[#ffffff38] w-[200px]">
                  <OImage src={item.image} className="w-[50px] h-[50px] rounded-full" alt="profile picture" onClick={() => handleShowImage(item)} />
                </td>
                {(manager?.add || manager?.edit || user?.role === "admin") && (
                  <td className="py-2 px-4 border-r dark:border-[#ffffff38] text-center">
                    <label className="inline-flex relative items-center cursor-pointer" title={`${helpers.ternaryCondition(item?.status === "active", "Active", "Inactive")}`}>
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={item?.status === "active"}
                        onChange={(e) => helpers.alertFunction(`${t("ARE_YOU_SURE_YOU_WANT_TO")} ${helpers.ternaryCondition(e.target.checked, "active", "inactive")} '${item.name}'?`, item, handelStatusChange)}
                      />
                      <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-focus:ring-0 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-gradientTo" />
                    </label>
                  </td>
                )}
                <td className="py-2 px-4 border-l">
                  <div className="">
                    <ul className="flex justify-center">
                      {(manager?.view || user?.role === "admin") && (
                        <li className="px-2 py-2 hover:text-gradientTo">
                          <NavLink to="/achievement-and-badges/view" title={t("O_VIEW")} state={item}>
                            <AiFillEye className="cursor-pointer w-5 h-5 text-slate-600" />
                          </NavLink>
                        </li>
                      )}
                      {(manager?.add || user?.role === "admin") && (
                        <li
                          onClick={() => {
                            editViewBanner("edit", item);
                          }}
                          className="px-2 py-2 hover:text-gradientTo"
                        >
                          <a title={t("O_EDIT")}>
                            <AiFillEdit className="cursor-pointer w-5 h-5 text-slate-600" />
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
            {isEmpty(badges) ? (
              <tr className="bg-white border-b w-full text-center dark:bg-gray-800 dark:border-gray-700">
                <td className="py-4 px-6" colSpan={9}>
                  {t("O_NO_RECORD_FOUND")}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      {showBanner && showImage && <ShowImage handleShowImage={handleShowImage} showImage={showImage} />}
    </div>
  );
};

export default Table;
