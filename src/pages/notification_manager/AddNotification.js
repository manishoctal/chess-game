import React, { useState } from "react";
import useToastContext from "hooks/useToastContext";
import { useForm } from "react-hook-form";
import { apiPost } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import { useTranslation } from "react-i18next";
import OInputField from "components/reusable/OInputField";
import formValidation from "utils/formValidation";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "components/ErrorMessage";
import OTextArea from "components/reusable/OTextArea";
import OButton from "components/reusable/OButton";

const AddNotification = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    shouldFocusError: true,
  });
  const notification = useToastContext();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const res = await apiPost(apiPath.notificationAdd, data);
      if (res?.data?.success === true) {
        navigate("/notification_manager");
        notification.success(res.data?.message);
      } else {
        notification.error(res?.data?.message);
      }
    } catch (err) {
      console.log("err:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} method="post">
        <div className="grid sm:grid-cols-1 md:grid-cols-3 p-6">
          <div className="px-2 col-span-1">
            <OInputField
              wrapperClassName="relative z-0 mb-6 w-full group"
              name="title"
              inputLabel={
                <>
                  {t("TITLE")}
                  <span className="text-red-500">*</span>
                </>
              }
              type="text"
              autoFocus
              register={register("title", formValidation.title)}
              errors={errors}
            />
          </div>

          <div className="px-2 col-span-1">
            <label
              htmlFor="sendTo"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              User type
            </label>
            <select
              id=""
              type="text "
              name="managerType"
              className="dark:bg-slate-900 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder=" "
              {...register("sendTo", formValidation.sendTo)}
            >
              <option value="all">All user</option>
              <option value="artist">All artists</option>
              <option value="collector">All collectors</option>
            </select>
            <ErrorMessage message={errors?.sendTo?.message} />
          </div>

          <div className="px-2 col-span-3">
            <OTextArea
              wrapperClassName="relative z-0 w-full group"
              name="description"
              maxLength={300}
              inputLabel={
                <>
                  {t("DESCRIPTION")}
                  <span className="text-red-500">*</span>
                </>
              }
              type="textarea"
              register={register("description", formValidation.description)}
              errors={errors}
            />
          </div>
        </div>
        <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
          <button
            className="text-black bg-[#E1E1E1] font-normal px-12 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150"
            type="button"
            onClick={() => navigate(-1)}
          >
            {t("O_BACK")}
          </button>

          {isLoading ? (
            <div className="spinner-container bg-LightBlue text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150">
              <div className="loading-spinner" />
            </div>
          ) : (
            <OButton label={t("O_SEND")} type="submit" loading={isLoading} />
          )}
        </div>
      </form>
    </>
  );
};

export default AddNotification;
