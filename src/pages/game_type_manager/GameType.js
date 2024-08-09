import React, { useContext, useEffect, useState } from "react";
import { apiGet, apiPut } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import { useTranslation } from "react-i18next";
import AuthContext from "context/AuthContext";
import useToastContext from "hooks/useToastContext";
import OSearch from "components/reusable/OSearch";
import { BiReset } from "react-icons/bi";
import Table from "./Table";

function GameType() {
  const { t } = useTranslation();
  const notification = useToastContext();
  const { user, updatePageName } = useContext(AuthContext);
  const manager = user?.permission?.find((e) => e.manager === "game_type_manager") ?? {};
  const [gameType, setGameType] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [filterData, setFilterData] = useState({
    category: "",
    searchKey: "",
    isReset: false,
    isFilter: false,
  });

  const allGameType = async (O) => {
    try {
      const { category, searchKey } = filterData;

      const payload = {
        status: category,
        keyword: searchKey?.trim(),
      };

      const path = apiPath.getGameType;
      const result = await apiGet(path, payload);
      const response = result?.data?.results;
      setGameType(response);
    } catch (error) {
      console.error("error in get all game type list==>>>>", error.message);
    }
  };

  useEffect(() => {
    allGameType();
  }, [filterData]);

  const handelStatusChange = async (item) => {
    try {
      const payload = {
        status: item?.status === "inactive" ? "active" : "inactive",
        type: "gameType",
      };
      const path = `${apiPath.changeStatus}/${item?._id}`;
      const result = await apiPut(path, payload);
      if (result?.status === 200) {
        notification.success(result.data.message);
        allGameType({ statusChange: 1 });
      }
    } catch (error) {
      console.error("error in get all users list==>>>>", error.message);
    }
  };

  const handleReset = () => {
    setFilterData({
      category: "",
      searchKey: "",
      isReset: true,
      isFilter: false,
    });

    setSearchTerm("");
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
    }
  }, [debouncedSearchTerm]);

  const adminStatusPage = (e) => {
    setFilterData({ ...filterData, category: e.target.value, isFilter: true });
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchTerm]);
  useEffect(() => {
    updatePageName(t("GAME_TYPE_MANAGER"));
  }, []);

  return (
    <div>
      <div className="bg-[#F9F9F9] dark:bg-slate-900">
        <div className="px-3 py-4">
          <div className="bg-white border border-[#E9EDF9] rounded-lg dark:bg-slate-800 dark:border-[#ffffff38]">
            <form className="border-b border-b-[#E3E3E3] 2xl:flex gap-2 px-4 py-3">
              <div className="col-span-2 flex flex-wrap  items-center">
                <div className="flex items-center lg:pt-0 pt-3 flex-wrap justify-center mb-2 2xl:mb-0">
                  <div className="relative flex items-center mb-3">
                    <OSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder={t("GAME_TYPE")} />
                  </div>
                  {(manager?.add || manager?.edit || user?.role === "admin") && (
                    <div className="flex items-center mb-3 ml-3">
                      <select
                        id="countries"
                        type=" password"
                        name="floating_password"
                        className="block p-2 w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer"
                        placeholder=" "
                        value={filterData?.category}
                        onChange={(e) => adminStatusPage(e)}
                      >
                        <option defaultValue value="">
                          {t("O_ALL")}
                        </option>
                        <option value="active">{t("O_ACTIVE")}</option>
                        <option value="inactive">{t("O_INACTIVE")}</option>
                      </select>
                    </div>
                  )}

                  <button type="button" onClick={handleReset} title={t("O_RESET")} className="bg-gradientTo flex gap-2 text-sm px-6 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2">
                    <BiReset size={18} />
                    {t("O_RESET")}
                  </button>
                </div>
              </div>
            </form>
            <Table gameType={gameType} allGameType={allGameType} manager={manager} handelStatusChange={handelStatusChange} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameType;
