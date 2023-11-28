import React, { useState } from "react";
import { apiPost, apiPut } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
import { useForm } from "react-hook-form";
import useToastContext from "hooks/useToastContext";
import ErrorMessage from "components/ErrorMessage";
import { useTranslation } from "react-i18next";
import OInputField from "components/reusable/OInputField";
import { preventMaxInput } from "utils/validations";
import formValidation from "../../utils/formValidation";
import { validateFile } from "utils/reusableMethods";
import { TagsInput } from "react-tag-input-component";
import OTextArea from "components/reusable/OTextArea";
import OButton from "components/reusable/OButton";

const AddEditSticker = ({ onClose, getAllStickers, item, type }) => {
  const { t } = useTranslation();
  const notification = useToastContext();
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState(
    type === "edit" ? item?.keyword?.split(",") : []
  );

  const [imageName, setImageName] = useState();
  const [fileMsg, setFileMsg] = useState();
  const [image, setImage] = useState(item?.sticker);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      sound_image: item?.sound_image,
      sound_file: item?.sound_file,
      name: item?.name,
      playlistName: item?.playlistName,
      artistName: item?.artistName,
      keyword: item?.keyword,
      displayName: item?.displayName,
      description: item?.description,
    },
  });

  const fileValid = () => {
    let isValidImage = false;
    if (image) {
      setFileMsg("");
      isValidImage = true;
    } else {
      setFileMsg("Please add a sticker.");
    }

    return { isValidImage };
  };

  const handleSubmitForm = async (data) => {
    const isValid = fileValid();
    if (!isValid?.isValidImage) {
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      if (image && !image.includes(".jpg")) {
        const response = await fetch(image);
        const newData = await response.blob();
        const metadata = {
          type: "image/*",
        };
        const file = new window.File([newData], `${image}.jpg`, metadata);
        formData.append("sticker", file);
      }

      formData.append("name", data.name);
      formData.append("displayName", data.displayName);
      formData.append("keyword", selected);
      formData.append("description", data.description);
      let path;
      if (type === "add") {
        path = apiPath.stickers;
        const result = await apiPost(path, formData);
        if (result.data.success) {
          getAllStickers();
          onClose();
          notification.success(result?.data.message);
        } else {
          notification.error(result?.data.message);
        }
      } else if (type === "edit") {
        path = apiPath.stickers + "/" + item._id;
        const result = await apiPut(path, formData);
        if (result.data.success) {
          getAllStickers();
          onClose();
          notification.success(result?.data.message);
        } else {
          notification.error(result?.data.message);
        }
      }
    } catch (error) {
      console.log("error in get all users list==>>>>", error);
      notification.error(error.message);
    }
    setIsLoading(false);
  };

  const onChangePicture = ({ e }) => {
    const validMessage = validateFile(e.target.files[0]);
    if (validMessage) {
      setFileMsg(validMessage);
      setImage("");
      setImageName("");
    } else {
      setImage(URL.createObjectURL(e.target.files[0]));
      setFileMsg("");
      setImageName(e.target.files[0].name);
    }
  };

  const InputField = () => {
    return (
      <>
        <div className="">
          <div>
            <label for="floating_file">
              Upload sticker<span className="text-red-500">*</span>
            </label>
            <div className="relative z-0  w-full group">
              <div className="flex py-2 px-3 w-full text-sm text-gray-900 bg-transparent border-2 rounded-lg border-[#DFDFDF] appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0  peer">
                <input
                  type="file"
                  name="sticker"
                  placeholder="sticker"
                  onChange={(e) => onChangePicture({ e, type: "image" })}
                  style={{ color: "transparent" }}
                  className="form-control"
                  accept="image/png,image/jpeg,image/jpg"
                />

                <div className="image_title">
                  {" "}
                  {imageName?.length > 17
                    ? imageName?.substring(0, 12) +
                      "..." +
                      imageName?.substring(
                        imageName?.length - 5,
                        imageName?.length
                      )
                    : imageName}
                </div>
              </div>
            </div>
          </div>
          <div>
            {image && !fileMsg && (
              <img
                src={
                  image !== null
                    ? image
                    : URL.createObjectURL(watch("passportWatch")[0])
                }
                className="mt-5"
                style={{
                  width: "8rem",
                  height: "8rem",
                  borderRadius: "8px",
                  boxShadow:
                    "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
                }}
                alt="display"
              />
            )}
            <ErrorMessage message={fileMsg} />
          </div>
        </div>
      </>
    );
  };

  let typeName = "";
  switch (type) {
    case "add":
      typeName = "Add";
      break;
    case "edit":
      typeName = "Edit";
      break;
    default:
  }
  return (
    <>
      <div className="justify-center items-center  overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="md:py-4 sm:px-2 sm:py-8 px-7">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none lg:min-w-[762px]">
              <div className="flex items-center justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                <h3 className="text-xl font-semibold">{typeName} Sticker</h3>
                <button
                  className=" ml-auto flex items-center justify-center  text-black border-2 rounded-full  h-8 w-8 float-right text-3xl leading-none font-extralight outline-none focus:outline-none"
                  onClick={onClose}
                >
                  <span className=" text-[#B8BBBF]  text-4xl " title="Close">
                    ×
                  </span>
                </button>
              </div>
              <form onSubmit={handleSubmit(handleSubmitForm)} method="post">
                <div className="relative p-6 flex-auto">
                  <div className="grid grid-cols-2">
                    <div className="md:py-4 sm:px-2 sm:py-3 md:px-7 px-2">
                      <OInputField
                        wrapperClassName="relative z-0  w-full group"
                        name="name"
                        inputLabel={
                          <>
                            Name<span className="text-red-500">*</span>
                          </>
                        }
                        type="text"
                        autoFocus
                        maxLength={500}
                        onInput={(e) => preventMaxInput(e, 500)}
                        register={register("name", formValidation.stickerName)}
                        errors={errors}
                        // disable={type === "edit"}
                      />
                    </div>
                    <div className="md:py-4 sm:px-2 sm:py-3 md:px-7 px-2">
                      <OInputField
                        wrapperClassName="relative z-0  w-full group"
                        name="displayName"
                        inputLabel={
                          <>
                            Display name<span className="text-red-500">*</span>
                          </>
                        }
                        type="text"
                        maxLength={500}
                        onInput={(e) => preventMaxInput(e, 500)}
                        register={register(
                          "displayName",
                          formValidation.displayName
                        )}
                        errors={errors}
                      />
                    </div>
                    <div className="md:py-4 sm:px-2 sm:py-3 md:px-7 px-2 col-span-2">
                      <label
                        htmlFor="inputTag"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Enter keywords
                      </label>
                      <TagsInput
                        value={selected}
                        onChange={setSelected}
                        name="inputTag"
                        placeHolder="Enter keywords"
                      />
                      {/* <em>Press enter to add new tag</em> */}
                    </div>
                    <div className="md:py-4 sm:px-2 sm:py-3 md:px-7 px-2 col-span-2">
                      <label
                        htmlFor="inputTag"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Description<span className="text-red-500">*</span>
                      </label>
                      <OTextArea
                        wrapperClassName="relative z-0  w-full group"
                        name="description"
                        type="text"
                        maxLength={15000}
                        onInput={(e) => preventMaxInput(e, 15000)}
                        register={register(
                          "description",
                          formValidation.description
                        )}
                        errors={errors}
                      />
                    </div>

                    {/* <div className='md:py-4 sm:px-2 sm:py-3 md:px-7 px-2'>
                      <OInputField
                        wrapperClassName='relative z-0   w-full group'
                        type='text'
                        name='playlistName'
                        id='playlistName'
                        inputLabel={<>Widget content type<span className='text-red-500'>*</span></>}
                        register={register('playlistName', formValidation.playlistName)}
                        errors={errors}
                      />
                    </div> */}

                    <div className="md:py-4 sm:px-2 sm:py-3 md:px-7 px-2">
                      <InputField className="mt-4" />
                    </div>
                    {/* <div className='md:py-4 sm:px-2 sm:py-3 md:px-7 px-2'>
                      <AudioSide />

                    </div> */}
                  </div>
                </div>
                <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-black bg-[#E1E1E1] font-normal px-12 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150"
                    type="button"
                    onClick={onClose}
                  >
                    {t("O_BACK")}
                  </button>

                  {
                    <OButton
                      label={typeName}
                      disabled={isLoading}
                      className="bg-gradientTo"
                      onClick={() => fileValid()}
                      type="submit"
                      loading={isLoading}
                    />
                  }
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black" />
    </>
  );
};

export default AddEditSticker;
