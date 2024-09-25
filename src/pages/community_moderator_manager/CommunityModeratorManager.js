import React, { useContext, useEffect, useState } from "react";
import { apiGet, apiPut } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import NotificationTable from "./CommunityModeratorManagerTable";
import Pagination from "../Pagination";
import AuthContext from "context/AuthContext";
import dayjs from "dayjs";
import ODateRangePicker from "components/shared/datePicker/ODateRangePicker";
import { useTranslation } from "react-i18next";
import PageSizeList from "components/PageSizeList";
import helpers from "utils/helpers";
import OSearch from "components/reusable/OSearch";
import { BiReset } from "react-icons/bi";

function CommunityModeratorManager() {
  const { t } = useTranslation();
  const { logoutUser, notification, user } = useContext(AuthContext);
  const manager = user?.permission?.find((e) => e.manager === "notification_manager" || "achievement_and_badges") ?? {};
  const [paginationObj, setPaginationObj] = useState({
    page: 1,
    pageCount: 1,
    pageRangeDisplayed: 10,
  });

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryAdd, setCategoryAdd] = useState(false);
  const [notifications, setAllNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  // get all notification function start
  const getAllNotifications = async () => {
    try {
      const { startDate, endDate, searchkey, community, status } = filterData;

      const payload = {
        page,
        pageSize,
        community,
        status,
        startDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : null,
        endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : null,
        keyword: helpers.normalizeSpaces(searchkey) || null,
        sortBy: sort.sortBy,
        sortType: sort.sortType,
      };

      const path = apiPath.notifications;
      const result = await apiGet(path, payload);
      if (result?.status === 200) {
        const response = result?.data?.results;
        const resultStatus = result?.data?.success;
        let dummyRec = [
          {
            postId: 1,
            username: "user123",
            postTitle: "First Post",
            likeCount: 34,
            commentCount: 12,
            reportCount: 1,
            community: "General",
            status: "active",
            createdAt: "2024-09-20T14:30:00Z"
          },
          {
            postId: 2,
            username: "coolguy88",
            postTitle: "A Day in the Life",
            likeCount: 56,
            commentCount: 8,
            reportCount: 0,
            community: "Lifestyle",
            status: "active",
            createdAt: "2024-09-21T09:00:00Z"
          },
          {
            postId: 3,
            username: "naturelover",
            postTitle: "The Beauty of Nature",
            likeCount: 78,
            commentCount: 25,
            reportCount: 2,
            community: "Nature",
            status: "Draft",
            createdAt: "2024-09-22T11:15:00Z"
          },
          {
            postId: 4,
            username: "techwhiz",
            postTitle: "Latest Tech Trends",
            likeCount: 102,
            commentCount: 15,
            reportCount: 0,
            community: "Technology",
            status: "Published",
            createdAt: "2024-09-23T16:45:00Z"
          },
          {
            postId: 5,
            username: "foodie_99",
            postTitle: "Exploring Italian Cuisine",
            likeCount: 45,
            commentCount: 10,
            reportCount: 1,
            community: "Food",
            status: "Published",
            createdAt: "2024-09-24T08:30:00Z"
          },
          {
            postId: 6,
            username: "fitnessfan",
            postTitle: "Workout Routines for Beginners",
            likeCount: 67,
            commentCount: 20,
            reportCount: 0,
            community: "Fitness",
            status: "Published",
            createdAt: "2024-09-25T10:00:00Z"
          },
          {
            postId: 7,
            username: "gamerPro",
            postTitle: "Top 10 Video Games of 2024",
            likeCount: 90,
            commentCount: 30,
            reportCount: 0,
            community: "Gaming",
            status: "Draft",
            createdAt: "2024-09-26T12:15:00Z"
          }
        ];

        setAllNotifications(dummyRec);

        setPaginationObj({
          ...paginationObj,
          page: helpers.ternaryCondition(resultStatus, response.page, null),
          pageCount: helpers.ternaryCondition(resultStatus, response.totalPages, null),
          perPageItem: helpers.ternaryCondition(resultStatus, response?.docs.length, null),
          totalItems: helpers.ternaryCondition(resultStatus, response.totalDocs, null),
        });
      }
    } catch (error) {
      setPaginationObj({});
      console.error("error ", error);
      if (error.response.status === 401 || error.response.status === 409) {
        logoutUser();
      }
    }
  };

  useEffect(() => {
    getAllNotifications();
  }, [page, filterData, sort, pageSize]);
  // get all notification function end

  const handlePageClick = (event) => {
    const newPage = event.selected + 1;
    setPage(newPage);
  };

  // debounce search start
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

  const handleCategory = () => {
    setCategoryAdd(!categoryAdd);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  // debounce search end

  const handleReset = () => {
    setFilterData({
      searchkey: "",
      community: "",
      status: "",
      category: "",
      startDate: "",
      endDate: "",
      isReset: true,
      isFilter: false,
    });
    setSearchTerm("");
    setPage(1);
  };





  const handleDateChange = (start, end) => {
    setPage(1);
    setFilterData({
      ...filterData,
      startDate: start,
      endDate: end,
      isFilter: true,
    });
  };

  const dynamicPage = (e) => {
    setPage(1);
    setPageSize(e.target.value);
  };

  const communityStatusChange = (e) => {
    setPage(1);
    setFilterData({ ...filterData, community: e.target.value, isFilter: true });
  };
  const adminStatusChange = (e) => {
    setPage(1);
    setFilterData({ ...filterData, status: e.target.value, isFilter: true });
  };
  const handelStatusChange = async (item) => {
    try {
      const payload = {
        status: item?.status === "inactive" ? "active" : "inactive",
        type: "achievement",
      };
      const path = `${apiPath.changeStatus}/${item?._id}`;
      const result = await apiPut(path, payload);
      if (result?.status === 200) {
        notification.success(result.data.message);
        // allAchievement({ statusChange: 1 });
      }
    } catch (error) {
      console.error("error in get all badges list==>>>>", error.message);
    }
  };

  return (
    <div>
      <div className="bg-[#F9F9F9] dark:bg-slate-900">
        <div className="px-3 py-4">
          <div className="bg-white border border-[#E9EDF9] rounded-lg dark:bg-gray-800 dark:mt-4">
            <form className="border-b border-b-[#E3E3E3] 2xl:flex gap-2 px-4 py-3">
              <div className="col-span-2 flex flex-wrap  items-center">
                <div className="flex items-center lg:pt-0 pt-3 flex-wrap justify-center mb-2 2xl:mb-0">
                  <div className="relative flex items-center mb-3">
                    {/* Post ID, Posted username, Post title */}
                    <OSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder={t("COMMUNITY_MODERATOR_SEARCH_PLACEHOLDER")} />
                  </div>
                  <ODateRangePicker handleDateChange={handleDateChange} isReset={filterData?.isReset} setIsReset={setFilterData} />
                  {(
                    <div className="flex items-center mb-3 ml-3">
                      <select
                        id="countries"
                        type=" password"
                        name="floating_password"
                        className="block p-2 w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer"
                        placeholder=" "
                        value={filterData?.category}
                        onChange={(e) => adminStatusChange(e)}
                      >
                        <option defaultValue value="">
                          {t("O_ALL")}
                        </option>
                        <option value="active">{t("O_ACTIVE")}</option>
                        <option value="inactive">{t("O_INACTIVE")}</option>
                      </select>
                    </div>
                  )}

                  {(
                    <div className="flex items-center mb-3 ml-3">
                      <select
                        id="countries"
                        type=" password"
                        name="floating_password"
                        className="block p-2 w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer"
                        placeholder=" "
                        value={filterData?.category}
                        onChange={(e) => communityStatusChange(e)}
                      >
                        <option defaultValue value="">
                          {t("O_COMMUNITY")}
                        </option>
                        <option value="global">{t("O_COMMUNITY_GLOBAL")}</option>
                        <option value="friends">{t("O_COMMUNITY_FRIENDS")}</option>
                      </select>
                    </div>
                  )}
                  <button type="button" onClick={handleReset} title={t("O_RESET")} className="bg-gradientTo text-sm px-6 flex gap-2 ml-3 mb-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2">
                    <BiReset size={18} />
                    {t("O_RESET")}
                  </button>
                </div>
              </div>

              <div className="2xl:ml-auto xl:ml-0 lg:pt-0 pt-2">
                <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
                  {t("O_SEARCH")}
                </label>

                {/* <div className="flex">
                  {(manager?.add || user?.role === "admin") && (
                    <button
                      title={t("SEND_NOTIFICATION")}
                      type="button"
                      className="bg-gradientTo flex text-sm px-6 ml-3 py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue whitespace-nowrap"
                      onClick={() => handleCategory()}
                    >
                      <IoIosAdd size={18} />
                      {t("SEND_NOTIFICATION")}
                    </button>
                  )}
                </div> */}
              </div>
            </form>
            <NotificationTable
              notifications={notifications}
              notification={notification}
              getAllNotifications={getAllNotifications}
              page={page}
              setSort={setSort}
              sort={sort}
              pageSize={pageSize}
              manager={manager}
              paginationObj={paginationObj}
              handelStatusChange={handelStatusChange}


            />

            {/* {categoryAdd && <NotificationAdd categoryAdd={categoryAdd} getAllNotifications={getAllNotifications} handleCategory={handleCategory} />} */}

            <div className="flex justify-between">
              {paginationObj?.totalItems ? (
                <>
                  <PageSizeList dynamicPage={dynamicPage} pageSize={pageSize} />
                  <Pagination handlePageClick={handlePageClick} options={paginationObj} page={page} />
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CommunityModeratorManager;
