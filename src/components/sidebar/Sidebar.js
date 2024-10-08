import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import Dashboard from "../../assets/images/sidebar_icon1.svg";
import userManager from "../../assets/images/user-manager.svg";
import manageStaticContents from "../../assets/images/manage-static-contents.svg";
import Logout from "../../assets/images/logout.svg";
import { useTranslation } from "react-i18next";
import logoImage from "../../assets/images/sidebar-logo.png";
import Swal from "sweetalert2";
import { FaUserGear } from "react-icons/fa6";
import { AiOutlineMail } from "react-icons/ai";
import { IoMdNotificationsOutline } from "react-icons/io";

import helpers from "utils/helpers";
import { FaRegQuestionCircle } from "react-icons/fa";
import { MdFeedback, MdWidthWide } from "react-icons/md";
import { GrTransaction } from "react-icons/gr";

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
    // debugger
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
        <Link to="/dashboard" onClick={() => updatePageName("Dashboard")} className={`px-2 py-8 pb-3 w-full text-center flex justify-center ${sidebarStatus === "open" ? "showToggle" : ""}`}>
          <img src={logoImage} className="inline max-w-[187px]" alt="" />
        </Link>
        <div className="profile text-center">
          <small className="block text-sm">Welcome</small>
          <strong className="block text-lg overflow-hidden text-ellipsis px-2 whitespace-nowrap ">{user?.firstName + " " + user?.lastName}</strong>
        </div>

        <nav className="pt-4 pb-5 flex flex-col justify-center font-normal text-xs overflow-y-auto">
          <SidebarNavItem path="/dashboard" label="NAV_DASHBOARD" imgSrc={Dashboard} />
          <SidebarNavItem permission="subAdmin_manager" path="/sub-admin-manager" label="SUB_ADMIN_MANAGERS" icon={<FaUserGear size={21} color="#a7a7a7" />} />
          <SidebarNavItem permission="user_manager" path="/users" label="USER_MANAGER" imgSrc={userManager} />
          <SidebarNavItem permission="challenges_manager" path="/challenges-manager" label="CHALLENGES_MANAGER" imgSrc={userManager} />
          <SidebarNavItem permission="community_moderator" path="/community-moderator-manager" label="COMMUNITY_MODERATOR_MANAGER" icon={<AiOutlineMail size={21} color="#a7a7a7" />} />
          <SidebarNavItem permission="email_manager" path="/email-manager" label="EMAIL_MANAGER" icon={<AiOutlineMail size={21} color="#a7a7a7" />} />
          <SidebarNavItem permission="feedback_manager" path="/feedback-manager" label="FEEDBACK_MANAGER" icon={<MdFeedback size={21} color="#a7a7a7" />} />
          <SidebarNavItem permission="withdrawal_request_manager" path="/withdrawal-request-manager" label="WITHDRAWAL_REQEUST_MANAGER" icon={<MdWidthWide size={21} color="#a7a7a7" />} />
          <SidebarNavItem permission="transaction_manager" path="/transection_manager" label="NAV_TRANSACTION_MANAGER" icon={<GrTransaction size={21} color="#a7a7a7" />} />
          <SidebarNavItem permission="notification_manager" path="/notification_manager" label="NOTIFICATION_MANAGER" icon={<IoMdNotificationsOutline size={21} color="#a7a7a7" />} />
          <SidebarNavItem permission="static_pages_management" path="/static-content" label="NAV_STATIC_CONTENTS" imgSrc={manageStaticContents} />
          <SidebarNavItem permission="FAQ" path="/faqs" label="NAV_FAQS" icon={<FaRegQuestionCircle size={21} color="#a7a7a7" />} />
          <SidebarNavItem permission="settings" path="/setting" label="SETTINGS"  imgSrc={manageStaticContents}/>
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
