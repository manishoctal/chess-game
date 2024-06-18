import React, { Fragment, useContext } from "react";
import { Transition, Menu } from "@headlessui/react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import OImage from "./reusable/OImage";
import { t } from "i18next";
import Swal from "sweetalert2";

const TopNavBar = () => {
  const {
    logoutUser,
    user,
    handleSidebar,
    pageName,
    updatePageName,
    sidebarStatus,
  } = useContext(AuthContext);
  const handleLogout = () => {
    Swal.fire({
      html: "<b>Are you sure you want to logout?</b>",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No"
    }).then((result) => {
      if (result.isConfirmed) {
        logoutUser()
      }
    });
  };

  return (
    <div className="linHeader border-b py-4 px-4 md:px-8 dark:bg-slate-900">
      <header className="bg-white items-center flex dark:bg-slate-900">
        <div
          className={`mr-4 dark:text-white z-50 ${
            sidebarStatus === "open" ? "showToggleMenu" : ""
          }`}
          onClick={() => handleSidebar()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </div>

        <div className="page_heading ">
          <h1 className="flex items-center text-lg text-slate-900 font-medium dark:text-white">
            {pageName}
          </h1>
        </div>
        <Menu
          as="div"
          className="relative inline-block text-left hover:text-gradientTo sidebar_dropdown ml-auto"
        >
          <div>
            <Menu.Button className="flex relative items-center w-full text-white active:text-gradientTo">
              <span title={t("O_NOTIFICATION")}></span>
              <div className="profile flex items-center ml-auto md:mr-10 mr-2">
                <figure className="inline-block overflow-hidden rounded-full">
                  <OImage
                    src={user?.profilePic}
                    fallbackUrl="/images/user.png"
                    className="w-[40px] h-[40px] inline"
                    alt=""
                  />
                </figure>
                <small className="block text-sm text-slate-900 ml-2 md:block hidden dark:text-white">
                  {user?.firstName + " " + user?.lastName}
                </small>
              </div>
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-10"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute z-10 text-left min-w-[200px]  right-2 content divide-y divide-gray-100  bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="">
                <Menu.Item onClick={() => updatePageName("Edit profile")}>
                  {({ active }) => (
                    <Link
                      to="/profile"
                      className={`${
                        active ? "bg-gradientTo text-white" : "text-gray-900"
                      } group flex w-full items-center  px-6 py-2 text-sm`}
                    >
                      Edit profile
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item onClick={() => updatePageName("Change password")}>
                  {({ active }) => (
                    <Link
                      to="/change-password"
                      className={`${
                        active ? "bg-gradientTo text-white" : "text-gray-900"
                      } group flex w-full items-center  px-6 py-2 text-sm`}
                    >
                      Change password
                    </Link>
                  )}
                </Menu.Item>
              </div>
              <div className="">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`${
                        active ? "bg-gradientTo text-white" : "text-gray-900"
                      } group flex w-full items-center  px-6 py-2 text-sm`}
                    >
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </header>
    </div>
  );
};

export default TopNavBar;
