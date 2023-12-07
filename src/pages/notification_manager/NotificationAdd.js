import ErrorMessage from "components/ErrorMessage";
import OButton from "components/reusable/OButton";
import useToastContext from "hooks/useToastContext";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { apiGet, apiPost } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import { useTranslation } from "react-i18next";
import OInputField from "components/reusable/OInputField";
import formValidation from "utils/formValidation";
import OTextArea from "components/reusable/OTextArea";
import OMultiSelect from "components/reusable/OMultiSelect";
const NotificationAdd = ({ getAllNotifications, handleCategory }) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    shouldFocusError: true,
  });
  const notification = useToastContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [availableFor, setAvailableFor] = useState("all");
  const [userSuggestion, setUserSuggestion] = useState([]);
  const [userList, setUserList] = useState([]);

  const getAllUser = async () => {
    try {
      const path = apiPath.allNotificationUser;
      const payload = {
        keyword: searchTerm,
        limit: 5,
      };
      const result = await apiGet(path, payload);
      if (result?.status === 200) {
        const response = result?.data?.results;
        const latest = response.map((element) => {
          return { label: element.nickName, value: element._id };
        });
        setUserSuggestion(latest);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelectAllUsers = (event) => {
    if (event.target.checked) {
      setAvailableFor("all");
    }
  };

  const [notificationUserError, setNotificationUserError] = useState(false);

  const handleParticularUser = (event) => {
    if (event.target.checked) {
      setAvailableFor("particularUser");
    }
  };

  const checkUserSelection = () => {
    const isValid = userList?.length !== 0
    console.log("isvalid", !isValid)
    setNotificationUserError(!isValid)
    return isValid
  }

  const onSubmit = async (data) => {
    try {
      const isValid = checkUserSelection()
      if (!isValid) return
      const obj = {
        ...data,
        sendTo: availableFor,
      };
      if (userList.length > 0) {
        obj.user = userList?.map((item) => item?.value);
      }

      const res = await apiPost(apiPath.notifications, { ...obj });
      if (res.data.success) {
        handleCategory(false);
        notification.success(res?.data?.message);
        getAllNotifications();
      } else {
        notification.error(res?.data?.message);
      }
    } catch (err) {
      console.error("err:", err);
    }
  };

  useEffect(() => {
    // getAllUser();
  }, []);
  return (
    <div>
      <>
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="relative my-6 mx-auto">
            <div className="sm:py-4 sm:px-2 py-8 px-7 ">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-center justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-xl font-semibold">
                    {t("ADD_NOTIFICATION")}
                  </h3>
                  <button
                    className=" ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none"
                    onClick={() => handleCategory(false)}
                  >
                    <span className=" text-[#B8BBBF]  text-4xl " title="Close">
                      ×
                    </span>
                  </button>
                </div>
                <div className="relative p-6 flex-auto">
                  <div className="">
                    <div className="px-2">
                      <OInputField
                        wrapperClassName=""
                        name="title"
                        inputLabel={
                          <>
                            {t("O_TITLE")}
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
                            {t("O_MESSAGE")}
                            <span className="text-red-500">*</span>
                          </>
                        }
                        type="textarea"
                        register={register(
                          "description",
                          formValidation.description
                        )}
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
                            onChange={() => setAvailableFor('tourist')}
                            className="w-4 cursor-pointer h-4 text-blue-600 bg-gray-100 border-gray-300 rounded  dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label

                            for="default-checkbox"
                            className="ml-2 text-sm font-medium cursor-pointer text-gray-900 dark:text-gray-300"
                          >
                            {t("ALL_TOURIST_USERS")}
                          </label>
                        </div>

                        <div className="flex items-center w-[200px]">
                          <input
                            id="default-checkbox1"
                            type="radio"
                            checked={availableFor === "local"}
                            name="default-radio"
                            onChange={() => setAvailableFor('local')}
                            className="w-4 cursor-pointer h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label

                            for="default-checkbox1"
                            className="ml-2 text-sm font-medium cursor-pointer text-gray-900 dark:text-gray-300"
                          >
                            {t("ALL_THAI_USERS")}
                          </label>
                        </div>
                      </div>
                    </div>

{/* {
  availableFor === "particularUser" &&  <div className="px-2">
  <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
    {t("SELECT_USERS")}
  </p>
  <OMultiSelect
    wrapperClassName="relative z-0 mb-2 w-full group"
    name="language"
    placeholder={
      <>
        {t("SELECT_USERS")}
        <span className="text-red-500">*</span>
      </>
    }
    options={userSuggestion}
    defaultValue={t("SELECT_USERS")}
    onChange={(e)=>{setUserList(e);setNotificationUserError(false)}}
    value={userList}
  />
  {notificationUserError && (
    <ErrorMessage message="Please select user." />
  )}
</div>
} */}


                  </div>
                </div>
                <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-black bg-[#E1E1E1] font-normal px-12 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => handleCategory(false)}
                  >
                    {t("O_BACK")}
                  </button>
                  <OButton
                    label={<>{t("O_ADD")}</>}
                    type="submit"
                    onClick={handleSubmit(onSubmit, () => {
                      checkUserSelection()
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black" />
      </>
    </div>
  );
};

export default NotificationAdd;
