import ErrorMessage from "components/ErrorMessage";
import OButton from "components/reusable/OButton";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { apiPost, apiPut } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import useToastContext from "hooks/useToastContext";

import obj from "../../utils/helpers";
import DynamicLabel from "utils/DynamicLabel";

const Add = ({ onHide, item, countryListing }) => {
  const { t } = useTranslation();
  const notification = useToastContext();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    shouldFocusError: true,
  });

  const onSubmit = async (data) => {
    const payload = {
      countryCode: data.countryCode,
      name: data.name,
    };

    try {
      var result;
      if (item) {
        const path = apiPath.countryManagerListing + "/" + item?._id;
        result = await apiPut(path, payload);
      } else {
        const path = apiPath.countryManagerListing;
        result = await apiPost(path, payload);
      }

      if (result?.data?.success) {
        countryListing();
        onHide();
        notification.success(result.data.message);
      } else {
        notification.error(result.data.message);
      }
    } catch (error) {
      console.log("error in get all users list==>>>>", error.message);
    }
    // setAddMerchantLoading(false);
  };

  useEffect(() => {
    if (item) {
      reset(item);
    }
  }, []);

  return (
    <div>
      <>
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="relative my-6  w-full max-w-[600px] mx-auto">
            <div className="sm:py-4 sm:px-2 py-8 px-7 ">
              <div className="overflow-hidden border border-white dark:border-[#ffffff38] rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className=" flex items-center justify-between p-5 border-b dark:border-[#ffffff38] border-solid border-slate-200 rounded-t dark:bg-slate-900">
                  <h3 className="text-xl font-semibold pl-3 dark:text-white">
                    {item ? t("O_EDIT") : t("O_ADD")}
                  </h3>
                  <button
                    className=" ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none"
                    onClick={() => onHide()}
                  >
                    <span className=" text-[#B8BBBF]  text-4xl " title="Close">
                      ×
                    </span>
                  </button>
                </div>
                <div className="relative p-6 flex-auto dark:bg-slate-800">
                  <div className="flex">
                    <div className="px-2 w-[300px]">
                      <DynamicLabel name={t("COUNTRY_CODE")} type={true} />
                      <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        name="countryCode"
                        placeholder={t("COUNTRY_CODE")}
                        type="text"
                        maxLength={3}
                        onKeyPress={(e) => {
                          obj.isInputNumber(e);
                        }}
                        autoFocus
                        {...register("countryCode", {
                          required: "Please enter country code.",
                        })}
                      />
                      <ErrorMessage message={errors?.countryCode?.message} />
                    </div>
                    <div className="px-2 w-full">
                      <DynamicLabel name={t("COUNTRY")} type={true} />
                      <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        name="name"
                        placeholder={t("COUNTRY")}
                        type="text"
                        {...register("name", {
                          required: "Please enter country name.",
                          maxLength: {
                            value: 150,
                            message: "Maximum 150 characters are allowed",
                          },
                          validate: {
                            whiteSpace: (value) =>
                              value.trim() ? true : "White spaces not allowed.",
                          },
                        })}
                      />
                      <ErrorMessage message={errors?.name?.message} />
                    </div>
                  </div>
                </div>
                <div className="dark:border-[#ffffff38] dark:bg-slate-900 flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-black bg-[#E1E1E1] font-normal px-12 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => onHide()}
                  >
                    {t("CLOSE")}
                  </button>

                  <OButton
                    label={item ? <>{t("O_EDIT")}</> : <>{t("O_ADD")}</>}
                    type="submit"
                    onClick={handleSubmit(onSubmit)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="opacity-25 fixed inset-0 z-40 bg-black"
          onClick={() => onHide()}
        />
      </>
    </div>
  );
};

export default Add;
