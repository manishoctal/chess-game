import OImage from "components/reusable/OImage";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, Link, useNavigate, NavLink } from "react-router-dom";
import defaultImage from "../../assets/images/No-image-found.jpg";
import checkIcon from "../../assets/images/check.png";
import { startCase } from "lodash";
import { IoArrowBackSharp } from "react-icons/io5";
import helpers from "utils/helpers";
import firstNameIcon from "../../assets/icons/icon/name-icon.svg";
import balanceIcon from "../../assets/icons/icon/balance.svg";
import emailIcon from "../../assets/icons/icon/email.svg";
import mobileIcon from "../../assets/icons/icon/mobile.svg";
import dobIcon from "../../assets/icons/icon/dob.svg";
import locationIcon from "../../assets/icons/icon/location.svg";
import cityIcon from "../../assets/icons/icon/city.svg";
import useToastContext from "hooks/useToastContext";
import apiPath from "utils/apiPath";
import { apiGet, apiPut } from "utils/apiFetch";
import ShowImage from "./ShowImage";
import bonusIcon from "../../assets/icons/icon/bonus.svg";
import AuthContext from "context/AuthContext";
import { FaCircleArrowLeft } from "react-icons/fa6";

const UserView = () => {
  const { t } = useTranslation();
  const { logoutUser } = useContext(AuthContext);
  const location = useLocation();
  const [item, setItems] = useState();
  const navigate = useNavigate();
  const notification = useToastContext();
  const [kycSection, setKycSection] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [walletBox, setWalletBox] = useState(false);



  const getUserDetails = async () => {
    try {
      const payload = {
        userId: location?.state?._id || null
      };
      const path = apiPath.getUserDetails;
      const result = await apiGet(path, payload);
      if (result?.data?.success) {
        setItems(result?.data?.results)
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

  const handleWalletBox = () => {
    setWalletBox(false);
  };

  const handleBack = () => {
    setWalletBox(false);
  };



  const PlayerCardInfo = ({ label, value }) => (
    <div>
      <label className="block text-sm font-medium text-gray-900 dark:text-white px-2 mb-1">{label}</label>
      <span className="block text-sm font-medium text-gray-900 dark:text-white px-2 text-center">{value}</span>
    </div>
  )


  return (
    <div className="p-5 dark:bg-slate-900">
      {helpers.ternaryCondition(
        walletBox,
        <Link className="mb-5 ml-4 block" onClick={handleBack}>
          <IoArrowBackSharp />
        </Link>,
        <div className='flex active mb-5 ml-4 '>
          <Link aria-current="page" className="" to={-1}>
            <FaCircleArrowLeft size={27} />
          </Link>
        </div>
      )}
      {helpers.andOperator(
        item?.userType === "tourist",
        <div className="mt-10">
          <div className="items-center flex mb-5">
            <div className="mr-5 flex cursor-pointer">
              <figure className="overflow-hidden rounded-full inline-block  border border-2 mb-5">
                <OImage
                  className="w-[100px] h-[100px] inline"
                  src={helpers?.orOperator(item?.profilePic, defaultImage)}
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
            <div className="grid grid-cols-4 bg-[#F2F2F2] rounded-lg p-4 w-[70%] mr-4 px-8">
              {helpers.ternaryCondition(
                walletBox,
                <InformationSection iconSrc={firstNameIcon} title={t("USER_ID")} content={helpers.ternaryCondition(item?.userId, startCase(item?.userId), "N/A")} />,
                <InformationSection iconSrc={firstNameIcon} title={t("FAMILY_NAME")} content={helpers.ternaryCondition(item?.familyName, startCase(item?.familyName), "N/A")} />
              )}
              <InformationSection iconSrc={firstNameIcon} title={t("FIRST_NAME")} content={helpers.ternaryCondition(item?.firstName, startCase(item?.firstName), "N/A")} />
              <InformationSection iconSrc={emailIcon} title={t("EMAIL_ADDRESS")} content={helpers.ternaryCondition(item?.email, item?.email, "N/A")} />
              <div className="ps-2">
                <InformationSection iconSrc={mobileIcon} title={t("O_MOBILE_NUMBER")} content={`+${item?.countryCode} ${item?.mobile}`} />
              </div>
            </div>
            <div className="bg-[#000] rounded-lg p-4" onClick={handleWalletBox}>
              <div className="flex items-center">
                <figure className="mr-3">
                  <img src={balanceIcon} alt="" />
                </figure>
                <figcaption className="text-white">
                  <span className="block">{helpers.formattedAmount(item?.walletAmount)}</span>
                  <span className="text-sm">{t("AVAILABLE_BALANCE")}</span>
                </figcaption>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-10">
        <div className="flex items-center">
          <div className="flex mr-5 cursor-pointer">
            <figure className="inline-block overflow-hidden rounded-full border border-2 mb-5">
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
                  <span className="block text-[#5 C5C5C]">{t("NAME")}</span>
                  <strong> {helpers.ternaryCondition(item?.firstName, startCase((item?.firstName ?? "") + " " + (item?.lastName ?? "")), "N/A")}</strong>
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
                  <strong>{item?.mobile ? helpers.ternaryCondition(item?.countryCode?.includes('+'), `${item?.countryCode} ${item?.mobile}`, `+${item?.countryCode} ${item?.mobile}`) : 'N/A'}</strong>
                </figcaption>
              </div>
            </div>
          </div>

          <div className="bg-[#4a24c2] rounded-lg p-4 ">
            <div className="flex items-center">
              <figure className="mr-3">
                <img src={balanceIcon} alt="" />
              </figure>
              <figcaption className="text-white">
                <span className="block">{helpers.formattedAmount(item?.totalAmount) || 0}</span>
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
                      <strong>{helpers.ternaryCondition(item?.userId, item?.userId, "N/A")}</strong>
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
              <div>
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
              </div>
              <div>
                <li className="mb-4">
                  <div className="flex items-center">
                    <figure className="bg-[#F2F2F2] w-[42px] h-[41px] rounded-full flex items-center justify-center mr-3">
                      <img src={bonusIcon} alt="" />
                    </figure>
                    <figcaption className="w-[calc(100%_-_41px)]">
                      <span className="block text-[#5C5C5C] dark:text-white">{t("INVITE_CODE")}</span>
                      <strong className="dark:text-slate-400">{item?.inviteCode || 'N/A'}</strong>
                    </figcaption>
                  </div>
                </li>
              </div>
            </ul>
          </div>

          <div className="border border-1  border-[#E1DEDE] rounded-md p-12">
            <span className="block text-center pb-3 font-bold ">{t("KYC_DOCUMENT")}</span>
            <div className="relative">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('GOVERNMENT_ID_PDF')}</label>
              <figure className="inline-block overflow-hidden border mb-3 w-full h-[200px]">
                <OImage
                  src={item?.kycRecord?.docImageFront || defaultImage}
                  className="w-full h-full object-contain inline  cursor-pointer"
                  onClick={() => handleShowImage(item?.kycRecord?.docImageFront)}
                  alt=""
                  fallbackUrl={defaultImage}
                />
              </figure>
              {renderApprovalStatus()}
            </div>

            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-center">or</label>

            <div className="relative">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('FRONT_PROOF_ID_IMAGE')}</label>
              <figure className="inline-block overflow-hidden border mb-3 w-full h-[200px]">
                <OImage
                  src={item?.kycRecord?.docImageFront || defaultImage}
                  className="w-full h-full object-contain inline  cursor-pointer"
                  onClick={() => handleShowImage(item?.kycRecord?.docImageFront)}
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
                  src={item?.kycRecord?.docImageBack || defaultImage}
                  className="w-full h-full object-contain inline cursor-pointer"
                  alt=""
                  onClick={() => handleShowImage(item?.kycRecord?.docImageBack)}
                  fallbackUrl={defaultImage}
                />
              </figure>
              {renderApprovalStatus()}
            </div>
            {kycSection}
            <span className="block text-center mt-4">
              {t("KYC_VERIFIED")}: <b>{helpers.ternaryCondition(item?.kycStatus, 'Yes', 'No')}</b>
            </span>
          </div>
          <div className="border border-1 border-[#E1DEDE] rounded-md p-6 ps-3">
            <ul>
              <div>
                <li className="mb-4">
                  <div className="flex items-center">
                    <figcaption className="w-[calc(100%_-_41px)]">
                      <span className="block text-[#5C5C5C] font-bold mb-4">{t("O_PORTFOLIO")}</span>

                      <div className="relative mt-4">
                        <figure className="inline-block overflow-hidden border mb-3 w-90 h-[210px] w-[480px]">
                          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white p-2 mt-3">{t('PLAYER_CARD')}</label>

                          <div className="flex justify-between mb-9">
                            <PlayerCardInfo label={t('O_INVESTMENT')} value={helpers.formattedAmount(100)} />
                            <PlayerCardInfo label={t('TOTAL_SELLING_CARD')} value={helpers.formattedAmount(100)} />
                            <PlayerCardInfo label={t('RETURN_SELLING_CARD')} value={helpers.formattedAmount(100)} />
                          </div>

                          <div className="flex justify-between">
                            <PlayerCardInfo label={t('CARD_BOUGHT')} value={helpers.formattedAmount(100)} />
                            <PlayerCardInfo label={t('CARD_SOLD')} value={helpers.formattedAmount(100)} />
                            <PlayerCardInfo label={t('CARD_HOLD')} value={helpers.formattedAmount(100)} />
                          </div>
                        </figure>
                      </div>

                      <div className="relative mt-4">
                        <figure className="inline-block overflow-hidden border mb-3 w-90 h-[210px] w-[480px]">
                          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white p-2 mt-3">{t('PLAYER_STOCK')}</label>

                          <div className="flex justify-between mb-9">
                            <PlayerCardInfo label={t('O_INVESTMENT')} value={helpers.formattedAmount(100)} />
                            <PlayerCardInfo label={t('TOTAL_SELLING_STOCK')} value={helpers.formattedAmount(100)} />
                            <PlayerCardInfo label={t('RETURN_SELLING_STOCK')} value={helpers.formattedAmount(100)} />
                          </div>

                          <div className="flex justify-between">
                            <PlayerCardInfo label={t('STOCK_BOUGHT')} value={helpers.formattedAmount(100)} />
                            <PlayerCardInfo label={t('STOCK_SOLD')} value={helpers.formattedAmount(100)} />
                            <PlayerCardInfo label={t('STOCK_HOLD')} value={helpers.formattedAmount(100)} />
                          </div>
                        </figure>
                      </div>
                    </figcaption>
                  </div>
                </li>
              </div>
            </ul>
          </div>

        </div>
      </div>


      {showBanner && showImage && <ShowImage handleShowImage={handleShowImage} showImage={showImage} />}
    </div>
  );
};

export default UserView;
