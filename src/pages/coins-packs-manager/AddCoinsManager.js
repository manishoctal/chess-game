import React, { useEffect, useState } from "react";
import { apiPost, apiPut } from "../../utils/apiFetch";
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
import { AiFillCloseCircle } from "react-icons/ai";
import defaultImage from "../../assets/images/No-image-found.jpg";
import DynamicLabel from "utils/DynamicLabel";

export default function AddCoinsManager() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const editItem = location?.state?.item;
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
    formState: { errors },
  } = useForm({
    mode: "onChange",
    shouldFocusError: true,
  });

  console.log("editItem", editItem);

  const [imageData, setImageData] = useState();

  const handleSubmitForm = async (data) => {
    // const isValid = checkValidation();
    // if (!isValid) {
    //   return;
    // }
    try {
      setIsLoading(true);
      let path;
      let result;
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price);
      formData.append("coins", data.coins);
      formData.append("image", image);
      formData.append("description", data.description);

      setImageData(data.image?.[0]);

      if (location?.pathname === "/coins_pack_manager/add") {
        path = apiPath.getCoinListing;
        result = await apiPost(path, formData);
      } else if (location?.pathname === "/coins_pack_manager/edit") {
        path = apiPath.getCoinListing + "/" + editItem._id;
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

  // const handleFileThumbnail = (e) => {
  //   const getType = e?.type?.split("/");
  //   if (getType) {
  //     const fileSize = (e?.size / (1024 * 1024)).toFixed(2);
  //     if (
  //       getType[1] !== undefined &&
  //       (getType[1] === "jpeg" || getType[1] === "png" || getType[1] === "jpg")
  //     ) {
  //       if (fileSize > 2) {
  //         notification.error("Please select image below 2 MB");
  //         return false;
  //       }
  //       return true;
  //     } else {
  //       notification.error("Only jpeg,png,jpg formats are allowed");
  //     }
  //   }
  // };

  const handleThumbnail = ({ target }) => {
    // if (!handleFileThumbnail(target.files[0])) return;
    setThubnailTitle(target.files[0].name);
    setImage(target.files[0]);
    setProfilePicError("");
  };

  const handleClearThumbnail = () => {
    setImage("");
  };

  const checkValidation = () => {
    let isValid = true;
    if (image == "") {
      isValid = false;
      setProfilePicError("Please upload favicon");
    }
    return isValid;
  };

  useEffect(() => {
    if (editItem !== undefined) {
      reset(editItem);
      setImage(editItem?.image);
    }
  }, []);

  return (
    <>
      <form
        onSubmit={handleSubmit(handleSubmitForm, checkValidation)}
        method="post"
      >
        <div className="outer-boarder">
          <div className="headerForm bg-gradient-to-t from-gradpurple to-gradientFrom dark:bg-gray-800">
            {editItem ? "Edit" : "Add"} {t("COIN_PACK_MANAGER")}
          </div>
          <div className="relative p-6  pb-0 flex-auto">
            <div className="grid grid-cols-3">
              <div className="md:py-4 sm:py-3 px-2">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  {t("PACK_NAME")}
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative z-0  w-full group md:py-3 sm:py-3">
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    name="name"
                    type="text"
                    onInput={(e) => preventMaxInput(e, 500)}
                    {...register("name", formValidation.packName)}
                  />
                </div>
                <ErrorMessage message={errors?.name?.message} />
              </div>

              <div className="relative z-0  w-full group md:py-3 sm:py-3">
                <div className="md:py-4 sm:py-3 px-2">
                  <OInputField
                    wrapperClassName="relative z-0  w-full group"
                    name="coins"
                    inputLabel={t("NO_OF_COINS")}
                    labelType={true}
                    type="number"
                    onInput={(e) => preventMaxInput(e, 500)}
                    register={register("coins", formValidation.noCoins)}
                    errors={errors}
                  />
                </div>
              </div>
              <div className="relative z-0  w-full group md:py-3 sm:py-3">
                <div className="md:py-4 sm:py-3 px-2">
                  <OInputField
                    wrapperClassName="relative z-0  w-full group"
                    name="price"
                    inputLabel={`${t("ENTER_PRICE")} $`}
                    labelType={true}
                    type="number"
                    maxLength={500}
                    onInput={(e) => preventMaxInput(e, 500)}
                    register={register("price", formValidation.price)}
                    errors={errors}
                  />
                </div>
              </div>

              <div className="md:py-4 sm:py-3 px-2">
                <OInputField
                  wrapperClassName="relative z-0  w-full group"
                  name="description"
                  inputLabel={t("DESCRIPTION")}
                  labelType={true}
                  type="textarea"
                  maxLength={500}
                  onInput={(e) => preventMaxInput(e, 500)}
                  register={register("description", formValidation.description)}
                  errors={errors}
                />
              </div>

              <div className="md:py-4 sm:px-2 sm:py-8 px-7">
                <div className="flex items-center">
                  <DynamicLabel name={t("UPLOAD_FAVICON")} type={false} />
                  <strong className="block mb-2 text-sm font-medium  dark:text-white mb-2 ml-4">
                    Suggested: Square Image
                  </strong>
                </div>

                <div className="h-[72px] relative block py-3 px-3 w-full text-sm text-gray-900 bg-transparent border-2 rounded-lg border-[#DFDFDF] appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0  peer">
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
                </div>
                {/* <div className="mt-2">
                  <ErrorMessage message={profilePicError} />
                </div> */}
              </div>

              <div className="md:py-4 sm:px-2 sm:py-8 px-7">
                <div className="position-relative mt-[30px] flex items-center">
                  <div className="w-20 h-16  overflow-hidden border-2">
                    <OImage
                      src={
                        typeof image === "object"
                          ? URL.createObjectURL(image)
                          : editItem && image
                          ? image
                          : defaultImage
                      }
                      className="w-full h-full m-auto object-cover border"
                      alt=""
                    />
                  </div>
                  {image ? (
                    <AiFillCloseCircle
                      className="cursor-pointer ml-[10px] text-lg"
                      onClick={() => handleClearThumbnail()}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-3 mt-3 border bg-[#cbd5e13a]  rounded-b">
            <Link to="/coins_pack_manager">
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
                  location?.pathname === "/coins_pack_manager/add"
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
