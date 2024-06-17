import OImage from "components/reusable/OImage";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, Link, useNavigate, NavLink } from "react-router-dom";
import defaultImage from "../../assets/images/No-image-found.jpg";
import checkIcon from "../../assets/images/check.png";
import { startCase, capitalize } from "lodash";
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
import { apiPut } from "utils/apiFetch";
import ShowImage from "./ShowImage";
import UserWalletTransaction from "./userComponents/UserWalletTransaction";
import UserDetail from "./userComponents/UserDetail";
import bonusIcon from "../../assets/icons/icon/bonus.svg";

const UserView = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [item] = useState(location?.state);
  const navigate = useNavigate();
  const notification = useToastContext();
  const [kycSection, setKycSection] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [walletBox, setWalletBox] = useState(false);

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

  return (
    <div className="p-5 dark:bg-slate-900">
      {helpers.ternaryCondition(
        walletBox,
        <Link className="mb-5 ml-4 block" onClick={handleBack}>
          <IoArrowBackSharp />
        </Link>,
        <NavLink to="/users" state={{ userType: item?.userType }} className="mb-5 ml-4 block">
          <IoArrowBackSharp />
        </NavLink>
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
          {helpers.ternaryCondition(
            walletBox,
            <UserWalletTransaction item={item} />,
            <UserDetail item={item} handleShowImage={handleShowImage} renderApprovalStatus={renderApprovalStatus} kycSection={kycSection} />
          )}
        </div>
      )}

      {helpers.andOperator(
        item?.userType === "local",
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
                    <strong>{`+${item?.countryCode} ${item?.mobile}`}</strong>
                  </figcaption>
                </div>
              </div>
            </div>

            <div className="bg-[#000] rounded-lg p-4 ">
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
                        <span className="block text-[#5C5C5C]">{t("NATIONALITY_ID")}</span>
                        <strong>{helpers.ternaryCondition(item?.nationalityId, item?.nationalityId, "N/A")}</strong>
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
                        <span className="block text-[#5C5C5C]">{t("ADDRESS")}</span>
                        <strong>{helpers.ternaryCondition(item?.address, item?.address, "N/A")}</strong>
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
                        <span className="block text-[#5C5C5C]">{t("USER_DOB")}</span>
                        <strong>{helpers.ternaryCondition(item?.dob, dayjs(item?.dob).format("D MMM YYYY"), "N/A")}</strong>
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
                        <span className="block text-[#5C5C5C]">{t("DRIVING_LICENSE")}</span>
                        <strong>{helpers.ternaryCondition(item?.drivingLicense, item?.drivingLicense, "N/A")}</strong>
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
                        <span className="block text-[#5C5C5C] dark:text-white">{t("BONUS_AMOUNT")}</span>
                        <strong className="dark:text-slate-400">{item?.signUpBonusAmount || 0}</strong>
                      </figcaption>
                    </div>
                  </li>
                </div>
              </ul>
            </div>
            <div className="border border-1 border-[#E1DEDE] rounded-md p-6 ps-3">
              <ul>
                <div>
                  <li className="mb-4">
                    <div className="flex items-center">
                      <figcaption className="w-[calc(100%_-_41px)]">
                        <span className="block text-[#5C5C5C]">{t("LOCAL_QR_CODE")}</span>
                        <div className="relative mt-4">
                          <figure className="inline-block overflow-hidden border mb-3 w-90 h-[210px]">
                            <OImage
                              onClick={() => {
                                handleShowImage(item?.qrCode);
                              }}
                              src={item?.qrCode || defaultImage}
                              className="w-full h-full object-contain inline cursor-pointer"
                              alt=""
                              fallbackUrl={defaultImage}
                            />
                          </figure>
                        </div>
                      </figcaption>
                    </div>
                  </li>
                </div>
              </ul>
            </div>
            <div className="border border-1  border-[#E1DEDE] rounded-md p-12">
              <span className="block text-center pb-3 ">{t("KYC_DOCUMENT")}</span>
              <div className="relative">
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
              <span className="block text-center">
                {t("DOCUMENT_NUMBER")}: <b>{helpers.ternaryCondition(item?.kycRecord?.docNumber, item?.kycRecord?.docNumber, "N/A")}</b>
              </span>
              {kycSection}
              <span className="block text-center mt-4">
                {t("KYC_STATUS")}: <b>{helpers.ternaryCondition(item?.kycRecord?.isApproved, capitalize(startCase(item?.kycRecord?.isApproved)), "Kyc not uploaded yet")}</b>
              </span>
            </div>
          </div>
        </div>
      )}

      {showBanner && showImage && <ShowImage handleShowImage={handleShowImage} showImage={showImage} />}
    </div>
  );
};

export default UserView;
