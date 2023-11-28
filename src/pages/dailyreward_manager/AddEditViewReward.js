import ErrorMessage from "components/ErrorMessage";
import OButton from "components/reusable/OButton";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { apiPost, apiPut } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import useToastContext from "hooks/useToastContext";
import OImage from "components/reusable/OImage";
import defaultImage from "../../assets/images/No-image-found.jpg";
import { formLengthValidation } from "utils/constants";
import DynamicLabel from "utils/DynamicLabel";

const AddEditViewReward = ({ onHide, editData, rewardListing, dataType }) => {
  const [thubnailTitle, setThubnailTitle] = useState("");
  const { t } = useTranslation();
  const [image, setImage] = useState("");
  const [profilePicError, setProfilePicError] = useState("");
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
    const isValid = checkValidation();
    if (!isValid) {
      return;
    }
    try {
      console.log("data", data, image);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("quantity", data.quantity);
      formData.append("daySequence", data.daySequence);
      formData.append("rewardType", data.rewardType);
      formData.append("image", image);
      let result;

      if (!editData) {
        const path = apiPath.dailyRewardListing;
        result = await apiPost(path, formData);
      } else {
        const path = apiPath.dailyRewardListing + "/" + editData?._id;
        console.log("path", path);
        result = await apiPut(path, formData);
      }

      if (result?.data?.success) {
        onHide();
        rewardListing();
        notification.success(result.data.message);
      } else {
        notification.error(result.data.message);
      }
    } catch (error) {
      console.error("error in get all users list==>>>>", error.message);
    }
  };
  const checkValidation = () => {
    let isValid = true;
    if (image == "") {
      isValid = false;
      setProfilePicError("Please upload image");
    }
    return isValid;
  };

  const handleFileThumbnail = (e) => {
    const getType = e?.type?.split("/");
    if (getType) {
      const fileSize = (e?.size / (1024 * 1024)).toFixed(2);
      if (
        getType[1] !== undefined &&
        (getType[1] === "jpeg" || getType[1] === "png" || getType[1] === "jpg")
      ) {
        if (fileSize > 2) {
          notification.error("Please select image below 2 MB");
          return false;
        }
        return true;
      } else {
        notification.error("Only jpeg,png,jpg formats are allowed");
      }
    }
  };

  const handleThumbnail = ({ target }) => {
    if (!handleFileThumbnail(target.files[0])) return;
    console.log("target", target.files[0].name);
    setThubnailTitle(target.files[0].name);
    setImage(target.files[0]);
    setProfilePicError("");
  };

  console.log("dataType", dataType);

  useEffect(() => {
    if (editData) {
      reset(editData);
      setImage(editData?.image);
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
                    {dataType === "add" && t("ADD_DAILY_REWARDS")}
                    {dataType === "edit" && t("O_EDIT")}
                    {dataType === "view" && t("O_VIEW")}
                  </h3>
                  <button
                    className=" ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none"
                    onClick={() => onHide()}
                  >
                    <span className=" text-[#B8BBBF]  text-4xl" title="Close">
                      ×
                    </span>
                  </button>
                </div>

                <div className="relative p-6 flex-auto dark:bg-slate-800">
                  <div className="md:py-4 sm:px-2 sm:py-8 px-7">
                    <DynamicLabel
                      name={t("UPLOAD_REWARD_FAVICON")}
                      type={true}
                    />

                    <div className="relative w-full h-[150px]">
                      <input
                        type="file"
                        title={thubnailTitle}
                        accept="image/png, image/jpg, image/jpeg"
                        name="image"
                        className={
                          dataType === "view"
                            ? "opacity-0 absolute top-0 left-0 end-0 h-full"
                            : "opacity-0 absolute top-0 left-0 end-0 h-full z-10 cursor-pointer"
                        }
                        // className="opacity-0 absolute top-0 left-0 end-0 h-full z-10 cursor-pointer"
                        onChange={handleThumbnail}
                        onClick={(e) => (e.target.value = null)}
                        disabled={dataType === "view"}
                      />

                      <div className="position-relative">
                        <div className="w-full h-[150px] overflow-hidden border-2">
                          <OImage
                            src={
                              typeof image === "object"
                                ? URL.createObjectURL(image)
                                : image
                                ? image
                                : defaultImage
                            }
                            className={
                              image
                                ? "w-full h-full m-auto object-cover border"
                                : "w-full h-full m-auto object-contain border"
                            }
                            alt=""
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <ErrorMessage message={profilePicError} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2">
                    <div className="px-2 mb-4">
                      <DynamicLabel name={t("ENTER_REWARD_NAME")} type={true} />

                      <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        name="name"
                        placeholder={t("ENTER_REWARD_NAME")}
                        type="text"
                        disabled={dataType === "view"}
                        {...register("name", {
                          required: "Please enter reward name.",
                          maxLength: {
                            value: 60,
                            message: "Maximum 60 characters are allowed",
                          },

                          validate: {
                            whiteSpace: (value) =>
                              value.trim() ? true : "White spaces not allowed.",
                          },
                        })}
                      />
                      <ErrorMessage message={errors?.name?.message} />
                    </div>
                    <div className="px-2 mb-4">
                      <DynamicLabel name={t("REWARD_TITLE")} type={true} />

                      <select
                        id=""
                        type="text "
                        name="rewardType"
                        disabled={dataType === "view"}
                        className="dark:bg-gray-700 dark:border-gray-600 block p-2 w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF] focus:outline-none focus:ring-0  peer"
                        // className="block p-2 w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0  peer"
                        {...register("rewardType", {
                          required: "Please select reward",
                        })}
                      >
                        <option defaultValue value="">
                          {t("O_ALL")}
                        </option>
                        <option value="coin">Coin</option>
                        <option value="gift">Gift</option>
                      </select>
                      <ErrorMessage message={errors?.rewardType?.message} />
                    </div>

                    <div className="px-2 mb-4">
                      <label className="mb-3 block text-sm dark:text-white">
                        <>
                          {t("QUANTITY")}
                          <span className="text-red-500">*</span>
                        </>
                      </label>
                      <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        name="quantity"
                        placeholder={t("QUANTITY")}
                        type="number"
                        disabled={dataType === "view"}
                        {...register("quantity", {
                          required: "Please enter quantity.",
                          maxLength: {
                            value: 150,
                            message: "Maximum 150 characters are allowed",
                          },
                        })}
                      />
                      <ErrorMessage message={errors?.quantity?.message} />
                    </div>
                    <div className="px-2 mb-4">
                      <DynamicLabel name={t("DAYS_SEQUENCE")} type={true} />
                      <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        name="daySequence"
                        placeholder={t("DAYS_SEQUENCE")}
                        type="number"
                        disabled={dataType === "view"}
                        {...register("daySequence", {
                          required: "Please enter days.",
                          maxLength: {
                            value: 150,
                            message: "Maximum 150 characters are allowed",
                          },
                        })}
                      />
                      <ErrorMessage message={errors?.daySequence?.message} />
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
                  {dataType !== "view" && (
                    <OButton
                      label={editData ? <>{t("O_EDIT")}</> : <>{t("O_ADD")}</>}
                      type="submit"
                      onClick={handleSubmit(onSubmit, checkValidation)}
                    />
                  )}
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

export default AddEditViewReward;
