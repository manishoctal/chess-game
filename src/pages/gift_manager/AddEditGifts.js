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
import OImage from "components/reusable/OImage";
import { AiFillPlusCircle } from "react-icons/ai";
import defaultImage from "../../assets/images/No-image-found.jpg";
import DynamicLabel from "utils/DynamicLabel";

export default function AddEditGifts({ allCategory }) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const editItem = location?.state;
  const type = location?.state?.type;
  const notification = useToastContext();
  const [isLoading, setIsLoading] = useState(false);
  const [thubnailTitle, setThubnailTitle] = useState("");
  const [image, setImage] = useState("");
  const [profilePicError, setProfilePicError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    shouldFocusError: true,
  });

  console.log("editItem", editItem);

  console.log("subscription", allCategory);

  const [imageData] = useState("");
  const [paymentOption, setPaymentOption] = useState("unpaid");
  const [categoryList, setCategoryList] = useState("");

  const handleSubmitForm = async (data) => {
    const isValid = checkValidation();
    if (!isValid) {
      return;
    }

    try {
      setIsLoading(true);
      let path;
      let result;
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("coins", data.coin);
      formData.append("categoryId", data.categoryId);
      formData.append("paymentStatus", paymentOption);
      formData.append("image", image);

      if (location?.pathname === "/gift-manager/add") {
        path = apiPath.addGift;
        result = await apiPost(path, formData);
      } else if (location?.pathname === "/gift-manager/edit") {
        path = apiPath.editGift + "/" + editItem._id;
        result = await apiPut(path, formData);
      }

      if (result.data.success) {
        notification.success(result?.data.message);
        navigate(-1);
      } else {
        notification.error(result?.data.message);
      }
    } catch (error) {
      console.log("error in get all users list==>>>>", error);
      notification.error(error.message);
    }
    setIsLoading(false);
  };

  console.log("imageData", imageData);

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

  const checkValidation = () => {
    let isValid = true;
    if (image == "" || image == undefined) {
      isValid = false;
      setProfilePicError("Please upload favicon");
    }
    return isValid;
  };

  useEffect(() => {
    if (editItem) {
      reset(editItem);
      setImage(editItem?.image);
      setValue("categoryId", editItem?.category[0]?._id);
      setPaymentOption(editItem?.paymentStatus);
      console.log("coiner", editItem?.coins);
    }
  }, []);

  const CategoryList = async () => {
    try {
      const path = apiPath.categoryListWithoutPage;
      const result = await apiGet(path);
      const response = result?.data?.results;
      setCategoryList(response);
    } catch (error) {
      console.log("error in get all sub admin list==>>>>", error.message);
    }
  };

  useEffect(() => {
    CategoryList();
  }, []);

  useEffect(() => {
    if (paymentOption == "unpaid") {
      setValue("coin", 0);
    }
    if (paymentOption == "paid") {
      setValue("coin", editItem?.coins);
    }
  }, [paymentOption]);

  console.log("payment option", paymentOption);

  return (
    <>
      <form
        onSubmit={handleSubmit(handleSubmitForm, () => checkValidation())}
        method="post"
      >
        <div className="outer-boarder">
          <div className="headerForm bg-gradient-to-t from-gradpurple to-gradientFrom dark:bg-gray-800">
            {editItem ? "Edit" : "Add"} {t("GIFT_MANAGER")}
          </div>

          <div className="relative p-6  pb-0 flex-auto">
            <div className="max-w-[300px]">
              <div className="md:py-4 sm:px-2 sm:py-8 px-7">
                <div className="flex items-center">
                  <DynamicLabel name={t("UPLOAD_FAV")} type={true} />
                </div>

                <div className="border-2 rounded-full h-[80px] w-[80px] relative block py-3 px-3 text-sm text-gray-900 bg-transparent  border-[#DFDFDF] appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0  peer">
                  <input
                    type="file"
                    title={thubnailTitle}
                    accept="image/png, image/jpg, image/jpeg"
                    name="image"
                    className="opacity-0 absolute top-0 left-0 end-0 h-full z-10 cursor-pointer"
                    onChange={handleThumbnail}
                    onClick={(e) => (e.target.value = null)}
                  />

                  <span className="text-base justify-center cursor-pointer flex items-center pl-3 w-full absolute top-[0px] left-[0px] right-0 bottom-0 text-[#A5A5A5]">
                    {t("UPLOAD_FAV")}
                  </span>

                  <div className="absolute right-0 left-0 bottom-0 top-0 flex items-center">
                    <div className="rounded-full w-full h-full  overflow-hidden ">
                      <OImage
                        src={
                          typeof image === "object"
                            ? image !== null
                              ? URL.createObjectURL(image)
                              : defaultImage
                            : editItem && image
                            ? image
                            : defaultImage
                        }
                        className="w-full h-full m-auto object-cover border"
                        alt=""
                      />
                    </div>
                  </div>
                  <span className="absolute right-0 bottom-0 text-2xl ">
                    <AiFillPlusCircle className="border-2 border-[#000] rounded-full" />
                  </span>
                </div>
                <div className="mt-2">
                  <ErrorMessage message={profilePicError} />
                </div>
              </div>

              <div className="md:py-4 sm:py-3 px-2">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  {t("GIFT_NAME")}
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative z-0  w-full group md:py-3 sm:py-3">
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    name="name"
                    type="text"
                    onInput={(e) => preventMaxInput(e, 500)}
                    {...register("name", formValidation.giftName)}
                  />
                </div>
                <ErrorMessage message={errors?.name?.message} />
              </div>

              <div className="md:py-4 sm:py-3 px-2">
                <DynamicLabel name={t("SELECT_CATEGORY")} type={true} />
                <select
                  name="floating_password"
                  className="block p-2 w-full text-sm text-[#A5A5A5] bg-transparent border-2 rounded-lg border-[#DFDFDF]  dark:text-[#A5A5A5] focus:outline-none focus:ring-0  peer"
                  placeholder=" "
                  {...register("categoryId", {
                    required: "Please select category",
                  })}
                >
                  <option defaultValue value="">
                    {t("SELECT_CATEGORY")}
                  </option>
                  {categoryList?.length > 0 &&
                    categoryList.map((item11, index) => {
                      return (
                        <option
                          value={item11?._id}
                          key={index}
                          selected={item11._id === editItem?.category[0]?._id}
                          // selected={item11?._id === item?.Category?._id}
                        >
                          {item11?.name}
                        </option>
                      );
                    })}
                </select>

                <div className="mt-2">
                  <ErrorMessage message={errors?.categoryId?.message} />
                </div>
              </div>

              {paymentOption === "unpaid" ? (
                ""
              ) : (
                <div className="md:py-4 sm:py-3 px-2">
                  <OInputField
                    wrapperClassName="relative z-0  w-full group"
                    name="coin"
                    inputLabel={t("ENTER_NO_COIN")}
                    labelType={true}
                    type="number"
                    disable={paymentOption === "unpaid"}
                    onInput={(e) => preventMaxInput(e, 500)}
                    register={register("coin", formValidation.coinNumber)}
                    errors={errors}
                  />
                </div>
              )}

              <div className="md:py-4 sm:py-3 px-2 flex items-center justify-between">
                <div class="flex items-center">
                  <input
                    // id="default-radio-1"
                    type="radio"
                    name="payment"
                    checked={paymentOption === "unpaid"}
                    onClick={(e) => setPaymentOption("unpaid")}
                    // {...register("paymentStatus")}
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300  dark:focus:ring-blue-600 dark:ring-offset-gray-800  dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    for="default-radio"
                    class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Free
                  </label>
                </div>
                <div class="flex items-center">
                  <input
                    // id="default-radio-1"
                    onClick={(e) => setPaymentOption("paid")}
                    type="radio"
                    checked={paymentOption === "paid"}
                    {...register("paymentStatus")}
                    name="payment"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300  dark:focus:ring-blue-600 dark:ring-offset-gray-800  dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    for="default-radio"
                    class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Paid
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-3 mt-3 border bg-[#cbd5e13a]  rounded-b">
            <Link to="/gift-manager">
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
                  location?.pathname === "/gift-manager/add" ? "Add" : "Edit"
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
