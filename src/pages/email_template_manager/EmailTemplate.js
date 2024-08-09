import React, { useContext, useEffect, useState } from "react";
import { apiGet, apiPut } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import Table from "./Table";
import dayjs from "dayjs";
import AuthContext from "context/AuthContext";
import useToastContext from "hooks/useToastContext";
function EmailTemplate() {
  const notification = useToastContext();
  const { user } = useContext(AuthContext);
  const manager = user?.permission?.find((e) => e.manager === "email_manager") ?? {};
  const [emailTemplate, setEmailTemplate] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [filterData] = useState({
    category: "",
    searchkey: "",
    startDate: "",
    endDate: "",
    isReset: false,
    isFilter: false,
  });

  // get all email template function start
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
      };

      const path = apiPath.emailTemplate;
      const result = await apiGet(path, payload);
      const response = result?.data?.results;
      setEmailTemplate(response);
    } catch (error) {
      console.error("error in get all sub admin list==>>>>", error.message);
    }
  };

  useEffect(() => {
    allEmailTemplate();
  }, [filterData, page]);

  // get all email template function end

  // change status of email template start
  const handelStatusChange = async (item) => {
    try {
      const payload = {
        status: item?.status === "inactive" ? "active" : "inactive",
        type: "email",
      };
      const path = `${apiPath.changeStatus}/${item?._id}`;
      const result = await apiPut(path, payload);
      if (result?.status === 200) {
        notification.success(result.data.message);
      }
    } catch (error) {
      console.error("error in get all sub admin list==>>>>", error.message);
    } finally {
      if (emailTemplate?.nextPage === null && filterData?.isFilter && emailTemplate?.prevPage) {
        setPage(page - 1);
      } else {
        allEmailTemplate();
      }
    }
  };

  // change status of email template end
  return (
    <div>
      <div className="bg-[#F9F9F9] dark:bg-slate-900">
        <div className="px-3 py-4">
          <div className="bg-white border border-[#E9EDF9] rounded-lg dark:bg-slate-800 dark:border-[#ffffff38] mt-5">
            <Table emailTemplate={emailTemplate} allEmailTemplate={allEmailTemplate} page={page} manager={manager} handelStatusChange={handelStatusChange} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailTemplate;
