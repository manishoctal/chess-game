import OImage from "components/reusable/OImage";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, Link, useNavigate, NavLink } from "react-router-dom";
import defaultImage from "../../../assets/images/No-image-found.jpg";
import checkIcon from "../../../assets/images/check.png";
import { IoArrowBackSharp } from "react-icons/io5";
import helpers from "utils/helpers";
import firstNameIcon from "../../../assets/icons/icon/name-icon.svg";
import balanceIcon from "../../../assets/icons/icon/balance.svg";
import emailIcon from "../../../assets/icons/icon/email.svg";
import mobileIcon from "../../../assets/icons/icon/mobile.svg";
import dobIcon from "../../../assets/icons/icon/dob.svg";
import locationIcon from "../../../assets/icons/icon/location.svg";
import cityIcon from "../../../assets/icons/icon/city.svg";
import useToastContext from "hooks/useToastContext";
import apiPath from "utils/apiPath";
import { apiGet, apiPut } from "utils/apiFetch";
import AuthContext from "context/AuthContext";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { BiHistory } from "react-icons/bi";

const CasualView = () => {
  const { t } = useTranslation();
  const { logoutUser } = useContext(AuthContext);
  const location = useLocation();
  const [item, setItem] = useState();
  const navigate = useNavigate();
  const notification = useToastContext();
  const [kycSection, setKycSection] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showFreeModel,setShowFreeModel]=useState(false);
  const [walletBox, setWalletBox] = useState(false);
  
  const handleFreeModal = () =>{
    setShowFreeModel(!showFreeModel)
    getUserDetails()
  }


  const getUserDetails = async () => {
    try {
      const path = `${apiPath.getUserDetails}/${location?.state?._id}`;
      const result = await apiGet(path);
      if (result?.data?.success) {
        setItem(result?.data?.results)
      }
    } catch (error) {
      console.error("error ", error);
      if (error.response.status === 401 || error.response.status === 409) {
        logoutUser();
      }
    }
  }


  useEffect(() => {
    if (location?.state) {
      getUserDetails()
    } else {
      navigate('/users')
    }
  }, [location])
  const approveAndReject = async (data) => {
    try {
      const payload = {
        status: data,
      };
      const path = apiPath.approveAndRejectKyc + "/" + item._id;
      const result = await apiPut(path, payload);
      if (result?.data?.success) {
        notification.success(result?.data.message);
        navigate("/users");
      } else {
        notification.error(result?.data?.message);
      }
    } catch (error) {
      console.error("error:", error.message);
    }
  };
  const kycDocSection = async () => {
    if (item?.kycRecord?.isApproved === "pending") {
      try {
        const result = await new Promise((resolve) => {
          setTimeout(() => {
            resolve(
              <div className="flex items-center justify-center p-6">
                <button
                  className="text-black bg-[#E1E1E1] font-normal px-12 py-2.5 text-sm outline-none focus:outline-none rounded mr-6 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => approveAndReject("approved")}
                >
                  {t("APPROVE")}
                </button>

                <button
                  className="bg-gradientTo text-white active:bg-emerald-600 font-normal text-sm px-8 py-2.5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                  type="submit"
                  onClick={() => approveAndReject("rejected")}
                >
                  {t("REJECT")}
                </button>
              </div>
            );
          }, 0);
        });

        setKycSection(result);
      } catch (error) {
        console.error("Error in kycDocSection:", error);
        setKycSection(null);
      }
    } else {
      setKycSection(null);
    }
  };

  const renderApprovalStatus = () => {
    const kycRecord = item?.kycRecord;

    if (!kycRecord) {
      return null;
    }
    const { isApproved } = kycRecord;
    if (isApproved === "approved") {
      return <img src={checkIcon} alt="" className="absolute right-[-10px] top-[-10px]" />;
    } else {
      return null;
    }
  };

  useEffect(() => {
    renderApprovalStatus();
    kycDocSection();
  }, [item?.kycRecord?.isApproved]);

  const InformationSection = ({ iconSrc, title, content }) => {
    return (
      <div className="flex items-center">
        <figure className="bg-white w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3">
          <img src={iconSrc} alt="" />
        </figure>
        <figcaption className="w-[calc(100%_-_41px)]">
          <span className="text-[#5C5C5C] block">{title}</span>
          <strong className="truncate max-w-[200px] block">{content}</strong>
        </figcaption>
      </div>
    );
  };

  const [showImage, setShowImage] = useState();

  const handleShowImage = (showData) => {
    setShowImage(showData);
    setShowBanner(!showBanner);
  };

  const handleBack = () => {
    setWalletBox(false);
  };



  return (
    <div className="p-5 dark:bg-slate-900">
      {helpers.ternaryCondition(
        walletBox,
        <Link className="mb-5 ml-4 block" onClick={handleBack}>
          <IoArrowBackSharp />
        </Link>,
        <div className='flex active mb-3 ml-4 justify-between'>
          
          <Link aria-current="page" className="" to={-1}>
            <FaCircleArrowLeft size={27} />
          </Link>

          <div className="flex items-center">

          <NavLink
            to="/users/view/game-history"
            title={t("O_VIEW")}
            className="bg-gradientTo flex gap-2 text-sm px-6 ml-3  py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2"
          >
            <BiHistory  className="cursor-pointer w-5 h-5 text-white" />{" "}
            {t("GAME_HISTORY")}
          </NavLink>

 

            <button onClick={()=>handleFreeModal()}className="bg-gradientTo flex gap-2 text-sm px-6 ml-3  py-2 rounded-lg items-center border border-transparent text-white hover:bg-DarkBlue sm:w-auto w-1/2">
              {t("FREEZE_BALANCE")}
            </button>
          </div>

        </div>
      )}
   
 

      <div className="mt-10">
        <div className="flex items-center">
          <div className="flex mr-5 cursor-pointer">
            <figure className="inline-block overflow-hidden rounded-full border-2 mb-5">
              <OImage
                src={item?.profilePic || defaultImage}
                className="w-[100px] h-[100px] inline"
                onClick={helpers.ternaryCondition(item?.profilePic !== "https://octal-dev.s3.ap-south-1.amazonaws.com/", () => handleShowImage(item.profilePic), undefined)}
                fallbackUrl={defaultImage}
                alt=""
              />
            </figure>
            {helpers.andOperator(
              item?.verificationStatus === "verified",
              <span>
                <img src={item?.verificationStatus === "verified" && checkIcon} alt="" />
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 bg-[#F2F2F2] rounded-lg p-4 w-[70%] mr-4 px-8 flex justify-between">
            <div>
              <div className="flex items-center">
                <figure className="bg-white w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3">
                  <img src={firstNameIcon} alt="" />
                </figure>
                <figcaption className="w-[calc(100%_-_41px)]">
                  <span className="block text-[#5 C5C5C]">{t("USERS_FULL_NAME")}</span>
                  <strong> {helpers.ternaryCondition(item?.fullName, item?.fullName, "N/A")}</strong>
                </figcaption>
              </div>
            </div>
            <div>
              <div className="flex items-center">
                <figure className="bg-white w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3">
                  <img src={emailIcon} alt="" />
                </figure>
                <figcaption className="w-[calc(100%_-_41px)]">
                  <span className="block text-[#5 C5C5C]">{t("EMAIL_ADDRESS")}</span>
                  <strong>{helpers.ternaryCondition(item?.email, item?.email, "N/A")}</strong>
                </figcaption>
              </div>
            </div>
            <div>
              <div className="flex items-center">
                <figure className="bg-white w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3">
                  <img src={mobileIcon} alt="" />
                </figure>
                <figcaption className="w-[calc(100%_-_41px)]">
                  <span className="block text-[#5 C5C5C]">{t("O_MOBILE_NUMBER")}</span>
                  <strong>{helpers.ternaryCondition(item?.mobile, item?.mobile, "N/A")}</strong>
                </figcaption>
              </div>
            </div>
          </div>

          <div className="bg-gradientTo rounded-lg p-4 ">
            <div className="flex items-center">
              <figure className="mr-3">
                <img src={balanceIcon} alt="" />
              </figure>
              <figcaption className="text-white">
                <span className="block">{helpers.formattedAmount(item?.walletAmount) || 0}</span>
                <span className="text-sm">{t("AVAILABLE_BALANCE")}</span>
              </figcaption>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5">

          <div className="border border-1 border-[#E1DEDE] rounded-md p-6 ps-3">
            <ul>
              <div>
                <li className="mb-4">
                  <div className="flex items-center">
                    <figure className="bg-[#F2F2F2] w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3">
                      <img src={cityIcon} alt="" />
                    </figure>
                    <figcaption className="w-[calc(100%_-_41px)]">
                      <span className="block text-[#5C5C5C]">{t("USER_ID")}</span>
                      <strong>{helpers.ternaryCondition(item?.userUniqId, item?.userUniqId, "N/A")}</strong>
                    </figcaption>
                  </div>
                </li>
              </div>
              <div>
                <li className="mb-4">
                  <div className="flex items-center">
                    <figure className="bg-[#F2F2F2] w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3">
                      <img src={locationIcon} alt="" />
                    </figure>
                    <figcaption className="w-[calc(100%_-_41px)]">
                      <span className="block text-[#5C5C5C]">{t("USER_NAME")}</span>
                      <strong>{helpers.ternaryCondition(item?.userName, item?.userName, "N/A")}</strong>
                    </figcaption>
                  </div>
                </li>
              </div>
              <div>
                <li className="mb-4">
                  <div className="flex items-center">
                    <figure className="bg-[#F2F2F2] w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3">
                      <img src={dobIcon} alt="" />
                    </figure>
                    <figcaption className="w-[calc(100%_-_41px)]">
                      <span className="block text-[#5C5C5C]">{t("O_CREATED_AT")}</span>
                      <strong>{helpers.ternaryCondition(item?.createdAt, dayjs(item?.createdAt).format("D MMM YYYY"), "N/A")}</strong>
                    </figcaption>
                  </div>
                </li>
              </div>
              {/* <div>
                <li className="mb-4">
                  <div className="flex items-center">
                    <figure className="bg-[#F2F2F2] w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3">
                      <img src={locationIcon} alt="" />
                    </figure>
                    <figcaption className="w-[calc(100%_-_41px)]">
                      <span className="block text-[#5C5C5C]">{t("INVITE_CODE_USED")}</span>
                      <strong>{helpers.ternaryCondition(item?.inviteByCode, item?.inviteByCode, "N/A")}</strong>
                    </figcaption>
                  </div>
                </li>
              </div> */}
              <div>
                {/* <li className="mb-4">
                  <div className="flex items-center">
                    <figure className="bg-[#F2F2F2] w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3">
                      <img src={bonusIcon} alt="" />
                    </figure>
                    <figcaption className="w-[calc(100%_-_41px)]">
                      <span className="block text-[#5C5C5C] dark:text-white">{t("INVITE_CODE")}</span>
                      <strong className="dark:text-slate-400">{helpers.ternaryCondition(item?.inviteCode, item?.inviteCode, "N/A")}</strong>
                    </figcaption>
                  </div>
                </li> */}

              </div>
            </ul>
          </div>

          {/* <div className="border border-1  border-[#E1DEDE] rounded-md p-12">
            <span className="block text-center pb-3 font-bold ">{t("KYC_DOCUMENT")}</span>
            <div className="relative">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('GOVERNMENT_ID_PDF')}</label>
              <figure className="inline-block overflow-hidden border mb-3 w-full h-[200px]">
                <OImage
                  src={item?.document || defaultImage}
                  className="w-full h-full object-contain inline  cursor-pointer"
                  onClick={() => handleShowImage(item?.document)}
                  alt=""
                  fallbackUrl={defaultImage}
                />
              </figure>
              {renderApprovalStatus()}
            </div>

            <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-center">or</span>

            <div className="relative">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('FRONT_PROOF_ID_IMAGE')}</label>
              <figure className="inline-block overflow-hidden border mb-3 w-full h-[200px]">
                <OImage
                  src={item?.frontPicture || defaultImage}
                  className="w-full h-full object-contain inline  cursor-pointer"
                  onClick={() => handleShowImage(item?.frontPicture)}
                  alt=""
                  fallbackUrl={defaultImage}
                />
              </figure>
              {renderApprovalStatus()}
            </div>
            <div className="relative">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('BACK_PROOF_ID_IMAGE')}</label>
              <figure className="inline-block overflow-hidden border mb-3 w-full h-[200px]">
                <OImage
                  src={item?.backPicture || defaultImage}
                  className="w-full h-full object-contain inline cursor-pointer"
                  alt=""
                  onClick={() => handleShowImage(item?.backPicture)}
                  fallbackUrl={defaultImage}
                />
              </figure>
              {renderApprovalStatus()}
            </div>
            {kycSection}
       
          </div> */}

          <div className="border border-1 border-[#E1DEDE] rounded-md p-6 ps-3">
            <span className="block text-center pb-3 font-bold ">{t("GAME_STATICS")}</span>
            <ul>
              <div>
                <li className="mb-4">
                  <div className="flex items-center">
                    <figure className="bg-[#F2F2F2] w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3">
                      <img src={cityIcon} alt="" />
                    </figure>
                    <figcaption className="w-[calc(100%_-_41px)]">
                      <span className="block text-[#5C5C5C]">{t("TOTAL_NO_OF_GAME_PLAYED")}</span>
                      <strong>{helpers.ternaryCondition(item?.gameStatic?.totalPlay, item?.gameStatic?.totalPlay, "N/A")}</strong>
                    </figcaption>
                  </div>
                </li>
              </div>
              <div>
                <li className="mb-4">
                  <div className="flex items-center">
                    <figure className="bg-[#F2F2F2] w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3">
                      <img src={locationIcon} alt="" />
                    </figure>
                    <figcaption className="w-[calc(100%_-_41px)]">
                      <span className="block text-[#5C5C5C]">{t("TOTAL_NO_OF_GAME_WON")}</span>
                      <strong>{helpers.ternaryCondition(item?.gameStatic?.totalLoss, item?.gameStatic?.totalLoss, "N/A")}</strong>
                    </figcaption>
                  </div>
                </li>
              </div>
              <div>
                <li className="mb-4">
                  <div className="flex items-center">
                    <figure className="bg-[#F2F2F2] w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3">
                      <img src={dobIcon} alt="" />
                    </figure>
                    <figcaption className="w-[calc(100%_-_41px)]">
                      <span className="block text-[#5C5C5C]">{t("TOTAL_NO_OF_GAME_LOSE")}</span>
                      <strong>{helpers.ternaryCondition(item?.gameStatic?.totalDraw, item?.gameStatic?.totalDraw, "N/A")}</strong>
                    </figcaption>
                  </div>
                </li>
              </div>
              <div>
                <li className="mb-4">
                  <div className="flex items-center">
                    <figure className="bg-[#F2F2F2] w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3">
                      <img src={locationIcon} alt="" />
                    </figure>
                    <figcaption className="w-[calc(100%_-_41px)]">
                      <span className="block text-[#5C5C5C]">{t("TOTAL_NO_OF_GAME_DRAWN")}</span>
                      <strong>{helpers.ternaryCondition(item?.gameStatic?.totalWon, item?.gameStatic?.totalWon, "N/A")}</strong>
                    </figcaption>
                  </div>
                </li>
              </div>

            </ul>
          </div>


        </div>
      </div>


    </div>
  );
};

export default CasualView;
