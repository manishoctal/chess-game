import React, { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import { useForm } from "react-hook-form";
import useToastContext from "hooks/useToastContext";
import { useTranslation } from "react-i18next";
import OInputField from "components/reusable/OInputField";
import { preventMaxInput } from "utils/validations";
import formValidation from "../../utils/formValidation";
import OButton from "components/reusable/OButton";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router";
import ErrorMessage from "components/ErrorMessage";
import ODateRangePicker from "components/shared/datePicker/ODateRangePicker";
import OImage from "components/reusable/OImage";
import { AiFillCloseCircle } from "react-icons/ai";
import ODatePicker from "components/shared/datePicker/ODatePicker";
import defaultImage from "../../assets/images/No-image-found.jpg";

export default function SubscriptionAddEditView() {
  const [thubnailTitle, setThubnailTitle] = useState("");
  const { t } = useTranslation();
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");
  const [setProfilePicError] = useState("");
  const [isValidityError, setIsValidityError] = useState(false);
  const location = useLocation();
  const editItem = location?.state?.item;
  const type = location?.state?.type;
  const notification = useToastContext();
  const [isLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    shouldFocusError: true,
  });

  console.log("editItem", editItem);

  const onSubmit = async (data) => {
    const isValid = checkValidation();
    if (!isValid) {
      return;
    }
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("discount", data.discount);
      formData.append("description", data.description);
      formData.append("validity", date);
      formData.append("image", data.image?.[0]);
      const path = apiPath.couponListing;
      let result;
      result = await apiPost(path, formData);
      if (result?.data?.success) {
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
      setProfilePicError("Please upload image");
    }
    if (date == null) {
      setIsValidityError("Please select date");
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
        // notification.error('Only jpeg,png,jpg,gif formats are allowed')
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

  useEffect(() => {
    if (editItem !== undefined) {
      reset(editItem);
    }
  }, []);

  const handleDateChange = (dates) => {
    setDate(dates);
    setIsValidityError(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onsubmit)} method="post">
        <div className="">
          <div className="relative p-6 pb-0 flex-auto">
            <div className="md:py-4 sm:px-2 sm:py-8 px-7">
              <div className="relative w-[150px] h-[150px]">
                <input
                  type="file"
                  title={thubnailTitle}
                  accept="image/png, image/jpg, image/jpeg"
                  name="image"
                  className="opacity-0 absolute top-0 left-0 end-0 h-full z-10 cursor-pointer"
                  onChange={handleThumbnail}
                  onClick={(e) => (e.target.value = null)}
                />

                <div className="position-relative">
                  <div className="w-[150px] h-[150px] rounded-full overflow-hidden border-2">
                    <OImage
                      src={
                        typeof image === "object"
                          ? URL.createObjectURL(image)
                          : defaultImage
                      }
                      className="w-full h-full m-auto object-cover border"
                      alt=""
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                {/* <ErrorMessage message={profilePicError} /> */}
              </div>
            </div>

            <div className="grid grid-cols-4">
              <div className="md:py-4 sm:py-3 px-2">
                <OInputField
                  wrapperClassName="relative z-0  w-full group"
                  name="title"
                  inputLabel={
                    <>
                      {t("ENTER_SUBSCRIPTION_NAME")}
                      <span className="text-red-500">*</span>
                    </>
                  }
                  type="text"
                  autoFocus
                  maxLength={150}
                  onInput={(e) => preventMaxInput(e, 500)}
                  register={register("title", formValidation.packName)}
                  errors={errors}
                  disable={type === "view"}
                />
              </div>
              <div className="md:py-4 sm:px-2 sm:py-8 px-7">
                <div className="relative z-0  w-full group">
                  <label
                    htmlFor="validity"
                    className="font-medium text-sm text-[#000] dark:text-gray-400  mb-2 block"
                  >
                    Validity<span className="text-red-500">*</span>
                  </label>
                  <ODatePicker
                    name="validity"
                    id="validity"
                    value={date}
                    // disable={counponData !== undefined}
                    handleDateChange={handleDateChange}
                  />

                  {isValidityError && (
                    <ErrorMessage message="Please select validity." />
                  )}
                </div>
              </div>

              <div className="md:py-4 sm:py-3 px-2">
                <OInputField
                  wrapperClassName="relative z-0  w-full group"
                  name="price"
                  inputLabel={
                    <>
                      {t("ENTER_PRICE")}
                      <span className="text-red-500">*</span>
                    </>
                  }
                  type="number"
                  maxLength={500}
                  onInput={(e) => preventMaxInput(e, 500)}
                  register={register("price", formValidation.price)}
                  errors={errors}
                  disable={type === "view"}
                />
              </div>

              <div className="md:py-4 sm:py-3 px-2">
                <OInputField
                  wrapperClassName="relative z-0  w-full group"
                  name="noCoins"
                  inputLabel={<>{t("OFFERS_DISCOUNT")} (%)</>}
                  type="number"
                  onInput={(e) => preventMaxInput(e, 500)}
                  register={register("noCoins", formValidation.noCoins)}
                  errors={errors}
                  disable={type === "view"}
                />
              </div>
            </div>
            <div className="grid grid-cols-4">
              <div className="md:py-4 sm:py-3 px-2">
                <div class="flex items-center">
                  <input
                    checked
                    id="disabled-radio-2"
                    type="radio"
                    value=""
                    name="disabled-radio"
                    class="outline-none w-4 h-4 text-blue-600 bg-gray-100 border-gray-300  dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    for="disabled-radio-2"
                    class="ml-2 text-sm font-medium text-gray-400 dark:text-gray-500"
                  >
                    Badge
                  </label>
                </div>
              </div>
              <div className="md:py-4 sm:py-3 px-2">
                <div class="flex items-center">
                  <input
                    checked
                    id="disabled-radio-2"
                    type="radio"
                    value=""
                    name="disabled-radio"
                    class="outline-none w-4 h-4 text-blue-600 bg-gray-100 border-gray-300  dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    for="disabled-radio-2"
                    class="ml-2 text-sm font-medium text-gray-400 dark:text-gray-500"
                  >
                    Coin
                  </label>
                </div>
              </div>

              <div className="md:py-4 sm:py-3 px-2">
                <div class="flex items-center">
                  <input
                    checked
                    id="disabled-radio-2"
                    type="radio"
                    value=""
                    name="disabled-radio"
                    class="outline-none w-4 h-4 text-blue-600 bg-gray-100 border-gray-300  dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    for="disabled-radio-2"
                    class="ml-2 text-sm font-medium text-gray-400 dark:text-gray-500"
                  >
                    Chat
                  </label>
                </div>
              </div>

              <div className="md:py-4 sm:py-3 px-2">
                <div class="flex items-center">
                  <input
                    checked
                    id="disabled-radio-2"
                    type="radio"
                    value=""
                    name="disabled-radio"
                    class="outline-none w-4 h-4 text-blue-600 bg-gray-100 border-gray-300  dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    for="disabled-radio-2"
                    class="ml-2 text-sm font-medium text-gray-400 dark:text-gray-500"
                  >
                    Video Call
                  </label>
                </div>
              </div>
            </div>
            <div className="md:py-4 sm:py-3 px-2">
              <OInputField
                wrapperClassName="relative z-0  w-full group"
                name="description"
                inputLabel={
                  <>
                    Description<span className="text-red-500">*</span>
                  </>
                }
                type="textarea"
                maxLength={500}
                onInput={(e) => preventMaxInput(e, 500)}
                register={register("description", formValidation.description)}
                errors={errors}
              />
            </div>
          </div>

          <div className="flex items-center justify-center p-3 mt-3 border bg-[#cbd5e13a]  rounded-b">
            <Link to="/platform-news-manager">
              <button
                className="text-black bg-[#E1E1E1] font-normal px-12 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150"
                type="button"
              >
                {t("O_BACK")}
              </button>
            </Link>

            {type === "view" ? null : isLoading ? (
              <div className="spinner-container bg-LightBlue text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150">
                <div className="loading-spinner" />
              </div>
            ) : (
              <OButton
                label={
                  location?.pathname === "/subscription-manager/add"
                    ? "Add"
                    : "Edit"
                }
                type="submit"
                loading={isLoading}
              />
            )}
          </div>
        </div>
      </form>
    </>
  );
}
