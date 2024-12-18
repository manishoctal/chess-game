import React, { useContext, useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import AuthContext from "context/AuthContext";
import OButton from "components/reusable/OButton";
import { AiFillCamera } from "react-icons/ai";
import OImage from "components/reusable/OImage";
import { useTranslation } from "react-i18next";
import { preventMaxInput } from "utils/validations";
import OInputField from "components/reusable/OInputField";
import AvatarEditor from "react-avatar-editor";
import { Slider } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import FormValidation from "../../utils/formValidation";
import apiPath from "utils/apiPath";
import { apiGet } from "utils/apiFetch";
import axios from "axios";

const Profile = () => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm({ mode: "onChange", shouldFocusError: true, defaultValues: {} });
  const [open, setOpen] = useState(false);
  const [updateProfileLoading, setUpdateProfileLoading] = useState(false);
  const { updateProfile, user, updatePageName } = useContext(AuthContext);
  const profilePicRef = useRef();
  const formValidation = FormValidation();
  const [imageFile, setImageFile] = useState({});
  useEffect(() => {
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePic: user.profilePic,
    });
  }, [user]);

  let editor = "";
  const [picture, setPicture] = useState({
    cropperOpen: false,
    img: null,
    zoom: 2,
    croppedImg: user?.profilePic,
  });

  const handleSlider = (event, value) => {
    setPicture({
      ...picture,
      zoom: value,
    });
  };

  const handleCancel = () => {
    setPicture({
      ...picture,
      cropperOpen: false,
    });
    setOpen(false);
  };

  const setEditorRef = (ed) => {
    editor = ed;
  };

  const handleSave = async (e) => {
    setOpen(false);
    if (setEditorRef) {
      const canvasScaled = editor.getImageScaledToCanvas();
      const croppedImg = canvasScaled.toDataURL();
      setPicture({
        ...picture,
        img: null,
        cropperOpen: false,
        croppedImg,
      });

      const responseData = await fetch(croppedImg);
      const newData = await responseData.blob();
      const metadata = {
        type: "image/jpeg",
      };

      const awsFileToUpload = new File([newData], picture.imageName, metadata);
      const imagePath = apiPath.getImagePath + "?contentType=image/jpeg";
      const result = await apiGet(imagePath, awsFileToUpload);

      const reader = new FileReader();
      reader.readAsArrayBuffer(awsFileToUpload);
      reader.onloadend = async () => {
        const binaryData = reader.result;
        await axios.put(result?.data?.results?.url, binaryData, {
          headers: {
            "Content-Type": "application/octet-stream",
          },
        });
      };

      setImageFile(result?.data?.results);
    }
  };

  const handleFileChange = (e) => {
    const url = URL.createObjectURL(e.target.files[0]);
    setPicture({
      ...picture,
      img: url,
      cropperOpen: true,
      imageName: e.target.files[0].name,
    });
    setOpen(true);
  };

  // update profile function start
  const handleSubmitForm = async (data) => {
    try {
      setUpdateProfileLoading(true);
      const payload = { ...data, profilePic: imageFile?.key, deletedImageKey: imageFile?.key };
      reset();

      updateProfile(payload);
    } catch (err) {
      console.error("err:", err);
    } finally {
      setUpdateProfileLoading(false);
    }
  };

  // update profile function end

  useEffect(() => {
    updatePageName(t("EDIT_PROFILE"));
  }, []);

  const codeValue = watch("email") ? watch("email") : "";

  return (
    <div className="sm:px-8 px-4 py-4 ">
      <div className="border  xl:w-full">
        <header className="border-b  py-2 px-4 bg-gray-100 rounded-t-md dark:bg-gray-800" style={{ height: "40px" }}>
          <div className="font-semibold dark:text-white"></div>
        </header>
        <form onSubmit={handleSubmit(handleSubmitForm)} method="post">
          <div className="grid lg:grid-cols-3 sm:grid-cols-2">
            <div className="py-4 px-4 md:px-8">
              <div className="relative">
                <OInputField
                  wrapperClassName="relative z-0 mb-6 w-full group"
                  name="firstName"
                  placeholder={t("ENTER_FIRST_NAME")}
                  inputLabel={
                    <>
                      {t("ADMIN_FIRST_NAME")}
                      <span className="text-red-500">*</span>
                    </>
                  }
                  type="text"
                  autoFocus
                  maxLength={15}
                  onInput={(e) => preventMaxInput(e, 15)}
                  register={register("firstName", formValidation.subAdminName)}
                  errors={errors}
                />
              </div>
            </div>
            <div className="py-4 px-4 md:px-8">
              <div className="relative">
                <OInputField
                  wrapperClassName="relative z-0 mb-6 w-full group"
                  name="lastName"
                  placeholder={t("ENTER_LAST_NAME")}
                  inputLabel={
                    <>
                      {t("ADMIN_LAST_NAME")}
                      <span className="text-red-500">*</span>
                    </>
                  }
                  type="text"
                  maxLength={15}
                  onInput={(e) => preventMaxInput(e, 15)}
                  register={register("lastName", formValidation.subAdminLastName)}
                  errors={errors}
                />
              </div>
            </div>
            <div className="py-4 px-4 md:px-8">
              <div className="relative">
                <OInputField
                  wrapperClassName="relative z-0  mb-6 w-full group"
                  type="text"
                  name="email"
                  placeholder={t("ENTER_EMAIL_ID")}
                  id="email"
                  value={codeValue.toLowerCase()}
                  inputLabel={
                    <>
                      {t("O_EMAIL_ID")}
                      <span className="text-red-500">*</span>
                    </>
                  }
                  maxLength={50}
                  autoComplete="off"
                  onInput={(e) => preventMaxInput(e, 50)}
                  register={register("email", formValidation.email)}
                  errors={errors}
                />
              </div>
            </div>
            <div>
              <div className="py-4 px-4 md:px-8">
                <div className="relative w-24 h-24 ">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white w-28">{t("PROFILE_PICTURE")}</label>
                  <input type="file" accept="image/png, image/jpg, image/jpeg" name="profilePic" ref={profilePicRef} onChange={handleFileChange} className="hidden" />
                  <OImage src={picture.croppedImg ? picture.croppedImg : user?.profilePic} fallbackUrl="/images/user.png" className="w-24 h-24" alt="" style={{ borderRadius: "50%" }} />
                  <AiFillCamera
                    className=" bg-gray-100  absolute w-4 rounded-xl cursor-pointer"
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                      bottom: "-23px",
                      right: 0,
                      background: "",
                      padding: "1px",
                    }}
                    onClick={() => profilePicRef?.current?.click()}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-4 mb-3">
            {updateProfileLoading ? (
              <button className="bg-gradientTo text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150">
                <div className="spinner-container">
                  <div className="loading-spinner" />
                </div>
              </button>
            ) : (
              <OButton disabled={!isDirty && picture.croppedImg == null} label="Submit" type="submit" loading={updateProfileLoading} title={t("O_SUBMIT")} />
            )}
          </div>
        </form>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      {picture.cropperOpen && ( <DialogContent>
          <DialogContentText id="alert-dialog-description">
           
              <div className="pb-0 bg-white shadow-lg mt-[30px]">
                <AvatarEditor ref={setEditorRef} image={picture.img} width={200} height={200} border={50} color={[255, 255, 255, 0.6]} rotate={0} scale={picture.zoom} sc className="m-auto mb-4" />
                <Slider aria-label="raceSlider" value={picture.zoom} min={1} max={10} step={0.1} onChange={handleSlider} />
                <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b ">
                  <button className="text-black bg-[#E1E1E1] font-normal   px-12 py-2.5 text-sm outline-none focus:outline-none rounded mr-6  ease-linear transition-all duration-150" type="button" onClick={handleCancel}>
                    {t("CANCEL")}
                  </button>
                  <button
                    className=" bg-gradientTo cursor-pointer  text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1  ease-linear transition-all duration-150"
                    type="submit"
                    onClick={handleSave}
                  >
                    {t("O_SAVE")}
                  </button>
                </div>
              </div>
           
          </DialogContentText>
        </DialogContent> )}
      </Dialog>
    </div>
  );
};

export default Profile;
