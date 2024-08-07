import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import Dashboard from "../../assets/images/sidebar_icon1.svg";
import SubAdmin from "../../assets/images/sub-admin-manager.svg";
import userManager from "../../assets/images/user-manager.svg";
import rewardWithdrawalRequest from "../../assets/images/reward-withdrawal-request.svg";
import notificationManager from "../../assets/images/Notification-manager.svg";
import manageStaticContents from "../../assets/images/manage-static-contents.svg";
import faqs from "../../assets/images/faqs.svg";
import emailManager from "../../assets/images/email-manager.svg";
import Logout from "../../assets/images/logout.svg";
import { useTranslation } from "react-i18next";
import logoImage from "../../assets/images/Logo.png";
import Swal from "sweetalert2";
import { MdOutlineLocalOffer, MdOutlineSubscriptions } from "react-icons/md";
import { GrAchievement } from "react-icons/gr";
import { VscGame } from "react-icons/vsc";
import { FaUserGear } from "react-icons/fa6";
import { AiOutlineMail } from "react-icons/ai";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaRegQuestionCircle } from "react-icons/fa";

import helpers from "utils/helpers";

const classNames = require("classnames");

const Sidebar = () => {
  const { t } = useTranslation();
  const { logoutUser, user, sidebarStatus, updatePageName } = useContext(AuthContext);

  const generateNavLink = (to, label, icon) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        classNames("flex items-center px-4 lg:px-7 sidebar-icons py-4  ", {
          "bg-gradientTo text-white hover:text-white": isActive,
          "text-black": isActive,
          active: isActive,
        })
      }
      onClick={() => updatePageName(t(label))}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {t(label)}
    </NavLink>
  );

  const handleLogout = () => {
    Swal.fire({
      html: "<b>Are you sure you want to logout?</b>",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        logoutUser();
      }
    });
  };

  const checkSidebarPermission = (arg) => {
    if (!user) {
      return false;
    }
    const localPermissions = [...user?.permission];

    if (user?.permission?.length === 0) {
      return true;
    }
    const perIndex = localPermissions?.findIndex((item) => item?.manager === arg);
    if (perIndex < 0) {
      return false;
    }
    if (localPermissions?.[perIndex]?.view) {
      return true;
    }

    return false;
  };

  const andOperator = (condition, text) => {
    return condition && text;
  };

  const SidebarNavItem = ({ permission, path, label, imgSrc, icon }) => {
    const navLink = generateNavLink(path, label, helpers.orOperator(icon, <img src={imgSrc} className={`max-w-[18px]`} title={t(label)} alt="" />));

    if (permission) {
      return andOperator(checkSidebarPermission(permission), navLink);
    }

    return navLink;
  };

  if (!user) {
    <></>;
  }

  return (
    <div className={`shadow-lg sidebar lg:block z-10   ${sidebarStatus === "open" ? "block" : "sidebarHide"} bg-gradient-to-t from-gradpurple to-gradientFrom w-[220px] xl:w-[280px] fixed h-full overflow-y-auto`}>
      <div className="text-sideBarNavColor">
        <Link to="/dashboard" onClick={() => updatePageName("Dashboard")} className={`px-2 py-8 w-full text-center flex justify-center ${sidebarStatus === "open" ? "showToggle" : ""}`}>
          <img src={logoImage} className="inline max-w-[187px]" alt="" />
        </Link>
        <div className="profile text-center">
          <small className="block text-sm">Welcome</small>
          <strong className="block text-lg overflow-hidden text-ellipsis px-2 whitespace-nowrap ">{user?.firstName + " " + user?.lastName}</strong>
        </div>

        <nav className="pt-4 pb-5 flex flex-col justify-center font-normal text-xs overflow-y-auto">
          <SidebarNavItem path="/dashboard" label="NAV_DASHBOARD" imgSrc={Dashboard} />
          <SidebarNavItem permission="subAdmin_manager" path="/sub-admin-manager" label="SUB_ADMIN_MANAGERS" icon={<FaUserGear size={21} color="#a7a7a7" />} />
          {/* <SidebarNavItem permission="user_manager" path="/users" label="USER_MANAGER" imgSrc={userManager} /> */}
          <SidebarNavItem permission="game_type_manager" path="/game-type-manager" label="GAME_TYPE_MANAGER" icon={<VscGame size={21} color="#a7a7a7" />} />
          <SidebarNavItem permission="how_to_play_manager" path="/how-to-play-manager" label="HOW_TO_PLAY_MANAGER" imgSrc={rewardWithdrawalRequest} />
          <SidebarNavItem permission="offer_manager" path="/offer-manager" label="OFFER_MANAGER" icon={<MdOutlineLocalOffer size={21} color="#a7a7a7" />} />
          <SidebarNavItem permission="subscribed_manager" path="/subscribed-manager" label="SUBSCRIBED_MANAGER" icon={<MdOutlineSubscriptions size={21} color="#a7a7a7" />} />
          <SidebarNavItem permission="achievement_and_badges" path="/achievement-and-badges" label="ACHIEVEMENT_AND_BADGES" icon={<GrAchievement size={21} color="#a7a7a7" />} />
          {/* <SidebarNavItem permission="trading_question_manager" path="/trading-question-manager" label="TRADING_QUESTION_MANAGER" icon={<BsPatchQuestion size={19} color="#a7a7a7" />} imgSrc={rewardWithdrawalRequest} />

          <SidebarNavItem permission="player_card_manager" path="/player-card-manager" label="PLAYER_CARD_MANAGER" icon={<AiOutlineIdcard size={20} color="#a7a7a7" />} imgSrc={rewardWithdrawalRequest} />
          <SidebarNavItem permission="player_stock_manager" path="/player-stock-manager" label="PLAYER_STOCK_MANAGER" icon={<AiOutlineStock size={20} color="#a7a7a7" />} imgSrc={rewardWithdrawalRequest} /> */}

          <SidebarNavItem permission="email_manager" path="/email-manager" label="EMAIL_MANAGER" icon={<AiOutlineMail size={21} color="#a7a7a7" />} />
          <SidebarNavItem permission="notification_manager" path="/notification_manager" label="NOTIFICATION_MANAGER" icon={<IoMdNotificationsOutline size={21} color="#a7a7a7" />} />
          <SidebarNavItem permission="static_page_management" path="/static-content" label="NAV_STATIC_CONTENTS" imgSrc={manageStaticContents} />
          <SidebarNavItem permission="FAQ" path="/faqs" label="NAV_FAQS" icon={<FaRegQuestionCircle size={21} color="#a7a7a7" />} />
          {/* <SidebarNavItem permission="settings" path="/setting" label="SETTINGS" imgSrc={globalSettings} /> */}
          <Link onClick={handleLogout} className="flex items-center px-4 lg:px-7 py-4 sidebar-icons hover:bg-sideBarNavActiveColor">
            <span className="mr-2">
              <img src={Logout} className="max-w-[18px]" title={t("NAV_LOGOUT")} alt="logout" />
            </span>
            {t("NAV_LOGOUT")}
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
