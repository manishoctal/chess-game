import ErrorMessage from "components/ErrorMessage";
import OButton from "components/reusable/OButton";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { apiPost, apiPut } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import useToastContext from "hooks/useToastContext";
import DynamicLabel from "utils/DynamicLabel";

const AddEditInterest = ({ onHide, item, InterestListing }) => {
  const { t } = useTranslation();
  const notification = useToastContext();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    shouldFocusError: true,
  });

  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
    };
    try {
      var result;

      if (!item) {
        const path = apiPath.interests;
        result = await apiPost(path, payload);
      } else {
        const path = apiPath.interests + "/" + item?._id;
        result = await apiPut(path, payload);
      }

      if (result?.data?.success) {
        InterestListing();
        onHide();
        notification.success(result.data.message);
      } else {
        notification.error(result.data.message);
      }
    } catch (error) {
      console.log("error in get all users list==>>>>", error.message);
    }
  };

  useEffect(() => {
    if (item) {
      setValue("name", item?.name);
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
                  <div className="">
                    <div className="px-2">
                      <DynamicLabel
                        name={t("ENTER_INTERESTS_NAME")}
                        type={true}
                      />
                      <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        name="name"
                        placeholder={t("ENTER_INTERESTS_NAME")}
                        type="text"
                        autoFocus
                        {...register("name", {
                          required: "Please enter interest name.",
                          validate: {
                            noSpace: (value) => value.trim() !== "" || "Cannot start with a space.",
                            onlyAlphabets: (value) => /^[a-zA-Z\s!@$%^&*(),.":{}|<>]*$/.test(value) || "Only alphabets and special characters are allowed.",
                          },
                          minLength: {
                            value: 2,
                            message: "Minimum 2 characters must be allowed",
                          },
                          maxLength: {
                            value: 150,
                            message: "Maximum 150 characters are allowed",
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

export default AddEditInterest;
