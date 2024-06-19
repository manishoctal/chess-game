import React, { useContext, useEffect, useState } from "react";
import { apiGet, apiPut } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import Table from "./Table";
import Pagination from "../Pagination";
import dayjs from "dayjs";
import AuthContext from "context/AuthContext";
import useToastContext from "hooks/useToastContext";
import OSearch from "components/reusable/OSearch";
import { useTranslation } from "react-i18next";

function EmailTemplate() {
  const notification = useToastContext();
  const { user } = useContext(AuthContext);
  const manager =
    user?.permission?.find((e) => e.manager === "email_manager") ?? {};
  const [emailTemplate, setEmailTemplate] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const {t} = useTranslation()
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [filterData, setFilterData] = useState({
    category: "",
    searchkey: "",
    startDate: "",
    endDate: "",
    isReset: false,
    isFilter: false,
  });
  const [sort, setSort] = useState({
    sortBy: "createdAt",
    sortType: "desc",
  });

  const allEmailTemplate = async () => {
    try {
      const { category, startDate, endDate, searchkey } = filterData;

      const payload = {
        page: emailTemplate?.nextPage === null ? page - 1 : page,
        pageSize,
        status: category,
        startDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : null,
        endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : null,
        keyword: searchkey?.trim(),
        sortKey: sort.sortBy,
        sortType: sort.sortType,
      };

      const path = apiPath.emailTemplate;
      const result = await apiGet(path, payload);
      const response = result?.data?.results;
      setEmailTemplate(response);
     
    } catch (error) {
      console.error("error in get all sub admin list==>>>>", error.message);
    }
  };
  const handelStatusChange = async (item) => {
    try {
      const payload = {
        status: item?.status === "inactive" ? "active" : "inactive",
        type:'email'
      };
      const path = `${apiPath.changeStatus}/${item?._id}`;
      const result = await apiPut(path, payload);
      if (result?.status === 200) {
        notification.success(result.data.message);
      }
    } catch (error) {
      console.error("error in get all sub admin list==>>>>", error.message);
    } finally {
      if (
        emailTemplate?.nextPage === null &&
        filterData?.isFilter &&
        emailTemplate?.prevPage
      ) {
        setPage(page - 1);
      } else {
        allEmailTemplate();
      }
    }
  };

  useEffect(() => {
    allEmailTemplate();
  }, [filterData, page, sort]);

  

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
    } else if (searchTerm || !filterData?.isReset) {
      setFilterData({
        ...filterData,
        isReset: false,
        searchkey: debouncedSearchTerm || "",
        isFilter: !!debouncedSearchTerm,
      });
      setPage(1);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  return (
    <div>
      <div className="bg-[#F9F9F9] dark:bg-slate-900">
        <div className="px-3 py-4">
          <div className="bg-white border border-[#E9EDF9] rounded-lg dark:bg-slate-800 dark:border-[#ffffff38]">
            <form className="border-b border-b-[#E3E3E3] 2xl:flex gap-2 px-4 py-3">
              <div className="col-span-2 flex flex-wrap  items-center">
                <div className="flex items-center lg:pt-0 pt-3 flex-wrap justify-center mb-2 2xl:mb-0">
                  <div className="relative flex items-center mb-3">
                  <OSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm}  placeholder={t("EMAIL_TEMPLATE_NAME")}/>
                  </div>
                 
                </div>
              </div>
             
            </form>
            <Table
              emailTemplate={emailTemplate}
              allEmailTemplate={allEmailTemplate}
              page={page}
              setSort={setSort}
              sort={sort}
              manager={manager}
              handelStatusChange={handelStatusChange}
            />
           
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailTemplate;
