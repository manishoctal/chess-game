import OButton from "components/reusable/OButton";
import useToastContext from "hooks/useToastContext";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { apiGet, apiPost } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import { useTranslation } from "react-i18next";
import OInputField from "components/reusable/OInputField";
import FormValidation from "utils/formValidation";
import OTextArea from "components/reusable/OTextArea";
import DynamicLabel from "utils/DynamicLabel";
import Select from "react-select";
import ErrorMessage from "components/ErrorMessage";
import helpers from "utils/helpers";
import { IoClose, IoSendSharp } from "react-icons/io5";
const NotificationAdd = ({ getAllNotifications, handleCategory }) => {
  const [loading, setLoading] = useState(false);
  const [notificationUserError, setNotificationUserError] = useState(false);
  const [usersSuggestion, setUsersSuggestion] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState("");
  const formValidation = FormValidation();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    shouldFocusError: true,
  });
  const customStyles = {
    option: (provided) => ({
      ...provided,
      fontSize: "12px",
      zIndex: 999,
    }),

    singleValue: (provided) => ({
      ...provided,
      fontSize: "12px",
    }),
  };
  const notification = useToastContext();
  const [availableFor, setAvailableFor] = useState("all");

  // add notification function start
  const onSubmit = async (data) => {
    if (availableFor === "specificUser" && selectedUsers == "") {
      setNotificationUserError(true);
    } else {
      try {
        setLoading(true);
        const obj = {
          ...data,
          sendTo: availableFor,
          user: helpers.ternaryCondition(availableFor !== "all", selectedUsers?.value, null),
        };

        const res = await apiPost(apiPath.notifications, { ...obj });
        if (res.data.success) {
          notification.success(res?.data?.message);
          handleCategory();
          getAllNotifications();
        } else {
          notification.error(res?.data?.message);
        }
      } catch (err) {
        console.error("err:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  // add notification function end

  // debounce function for search start
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm?.trim());
    }, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  const handleSearchOption = async (event) => {
    try {
      const payload = {
        keyword: event,
      };
      const path = apiPath.searchUsers;
      const result = await apiGet(path, payload);
      if (result?.data?.success) {
        const formattedOption = result?.data?.results?.map((res) => {
          return { label: `${res?.name + "," + "(" + res?.email + ")"}`, value: res?._id };
        });
        setUsersSuggestion(formattedOption);
      }
    } catch (error) {
      console.error("error ", error);
    }
  };

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
    } else if (searchTerm) {
      handleSearchOption(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);
  // debounce function for search end

  useEffect(() => {
    getAllNotifications();
  }, []);
  return (
    <div>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative my-6 mx-auto">
          <div className="sm:py-4 sm:px-2 py-8 px-7 ">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="dark:bg-gray-900 flex items-center justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                <h3 className="text-xl font-semibold dark:text-white">{t("SEND_NOTIFICATION")}</h3>
                <button className=" ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none" onClick={() => handleCategory(false)}>
                  <span className=" text-[#B8BBBF]  text-4xl " title="Close">
                    ×
                  </span>
                </button>
              </div>
              <div className="relative p-6 flex-auto dark:bg-gray-800">
                <div className="">
                  <div className="px-2">
                    <OInputField
                      wrapperClassName=""
                      name="title"
                      placeholder={t("ENTER_NOTIFICATION_TITLE")}
                      inputLabel={
                        <>
                          {t("NOTIFICATION_TITLE")}
                          <span className="text-red-500">*</span>
                        </>
                      }
                      type="text"
                      autoFocus
                      register={register("title", formValidation.title)}
                      errors={errors}
                    />
                  </div>

                  <div className="px-2">
                    <OTextArea
                      wrapperClassName="relative z-0 my-6 w-full group"
                      name="description"
                      inputLabel={
                        <>
                          {t("ENTER_CONTENT")}
                          <span className="text-red-500">*</span>
                        </>
                      }
                      type="textarea"
                      register={register("description", formValidation.content)}
                      errors={errors}
                    />
                  </div>

                  <div className="px-2">
                    <div className="relative z-0 mb-6 w-full group flex">
                      <div className="flex items-center w-[200px]">
                        <input
                          id="default-checkbox"
                          type="radio"
                          checked={availableFor === "all"}
                          name="default-radio"
                          onChange={() => {
                            setAvailableFor("all");
                            setSelectedUsers("");
                          }}
                          className="w-4 cursor-pointer h-4 text-blue-600 bg-gray-100 border-gray-300 rounded  dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label htmlFor="default-checkbox" className="ml-2 text-sm font-medium cursor-pointer text-gray-900 dark:text-gray-300">
                          {t("ALL_USERS")}
                        </label>
                      </div>
                      <div className="flex items-center w-[200px]">
                        <input
                          id="default-checkbox1"
                          type="radio"
                          checked={availableFor === "specificUser"}
                          name="default-radio"
                          onChange={() => {
                            setAvailableFor("specificUser");
                            setSelectedUsers("");
                          }}
                          className="w-4 cursor-pointer h-4 text-blue-600 bg-gray-100 border-gray-300 rounded  dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label htmlFor="default-checkbox1" className="ml-2 text-sm font-medium cursor-pointer text-gray-900 dark:text-gray-300">
                          {t("ANY_PARTICULAR_USERS")}
                        </label>
                      </div>
                    </div>
                    <div>
                      {availableFor == "specificUser" && (
                        <div className="relative z-0 w-full group md:py-3 sm:py-3">
                          <DynamicLabel
                            name={
                              <>
                                {t("SPECIFIC_USER")} <span className="text-red-600">*</span>
                              </>
                            }
                            type={false}
                          />
                          <Select
                            wrapperClassName="relative z-0 mb-2 w-full group"
                            name="language"
                            inputValue={searchTerm}
                            onInputChange={(value) => setSearchTerm(value)}
                            placeholder={<>{t("SEARCH_USER_BY_NAME")}</>}
                            options={[{ label: t("SEARCH_USER_BY_NAME"), value: "" }, ...usersSuggestion]}
                            defaultValue={t("SELECT_USERS")}
                            onChange={(e) => {
                              if (e?.value == "") {
                                setSelectedUsers("");
                              } else {
                                setSelectedUsers(e);
                                setNotificationUserError(false);
                              }
                            }}
                            selectStyles={customStyles}
                            value={selectedUsers}
                          />
                          {selectedUsers == "" && notificationUserError && <ErrorMessage message="Please select users." />}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b dark:bg-gray-900">
                <button
                  className="text-black bg-[#E1E1E1] font-normal px-6 flex gap-2 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => handleCategory(false)}
                  title={t("O_CLOSE")}
                >
                  <IoClose size={19} />
                  {t("O_CLOSE")}
                </button>
                <OButton
                  extraClasses={"!px-6"}
                  label={
                    <>
                      <IoSendSharp size={16} className="mr-2" />
                      {t("O_SEND")}
                    </>
                  }
                  type="submit"
                  title={t("O_SEND")}
                  onClick={handleSubmit(onSubmit)}
                  loading={loading}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black" />
    </div>
  );
};

export default NotificationAdd;
