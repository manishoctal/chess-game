import React, { createContext, useState } from "react";
import jwtDecode from "jwt-decode";
import { pick } from "lodash";
import { useNavigate } from "react-router-dom";
import useToastContext from "hooks/useToastContext";
import { apiPost } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => (window?.localStorage.getItem("token") ? jwtDecode(window?.localStorage.getItem("token")) : null));
  const [sidebarStatus, setSidebarStatus] = useState(window?.localStorage.getItem("sidebar") ?? "open");
  const [pageName, setPageName] = useState(window?.localStorage.getItem("pageName") ? window?.localStorage.getItem("pageName") : "Dashboard");
  const navigate = useNavigate();
  const notification = useToastContext();
  const [loginMessage, setLoginMessage] = useState("Admin details updated successfully.");
  const [pageFilter, setPageFilter] = useState({
    keyword: "",
    startDate: "",
    endDate: "",
    selectOne: "",
    selectTwo: "",
    selectThree: "",
  });

  const updatePageName = (name) => {
    window?.localStorage.setItem("pageName", name);
    setPageName(name);
  };

  const cipher = (salt) => {
    const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
    const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);

    return (text) => text.split("").map(textToChars).map(applySaltToChar).map(byteHex).join("");
  };
  const myCipher = cipher("mySecretSalt");
  const loginUser = async (body, setLoginError) => {
    document.getElementById("loader").classList.remove("hidden");
    const { status, data } = await apiPost(apiPath.loginUser, pick(body, ["email", "password"]));
    if (status === 200) {
      if (data.success) {
        if (data?.results.role === "subAdmin" && !data?.results?.isPasswordSet) {
          const token = data?.results?.token || null;
          const refresh_token = data?.results?.refresh_token || null;
          localStorage.setItem("token", token);
          localStorage.setItem("refresh_token", refresh_token);
          setUser(jwtDecode(token));
          navigate("/change-password");
          notification.success(data?.message);
        } else {
          const token = data?.results?.token || null;
          const refreshToken = data?.results?.refresh_token || null;
          window?.localStorage.setItem("token", token);
          window?.localStorage.setItem("refresh_token", refreshToken);
          window?.localStorage.setItem("pageName", "Dashboard");
          setPageName("Dashboard");
          setUser(jwtDecode(token));
          window.localStorage.setItem("pass", myCipher(body.password));
          navigate("/dashboard");
          notification.success(data?.message);
        }
        setLoginError(false);
      } else {
        notification.error(data.message);
        setLoginError(true);
      }
    }
    document.getElementById("loader").classList.add("hidden");
  };

  const updateProfile = async (formData) => {
    try {
      const res = await apiPost(apiPath.editProfile, formData);
      const token = res?.data?.results?.token || null;
      const refreshToken = res?.data?.results?.refresh_token || null;
      window?.localStorage.setItem("token", token);
      setLoginMessage(res?.data?.message);
      window?.localStorage.setItem("refresh_token", refreshToken);
      setUser(jwtDecode(token));
      const { message, success } = res.data;
      if (res && success) {
        notification.success(message);
      }
    } catch (err) {
      console.error("err:", err);
    }
  };

  const handleSidebar = () => {
    const s1 = window?.localStorage.getItem("sidebar");
    window?.localStorage.setItem("sidebar", s1 === "open" ? "close" : "open");
    setSidebarStatus(s1 === "open" ? "close" : "open");
  };

  const logoutUser = () => {
    setUser(null);
    window?.localStorage.removeItem("token");
    window?.localStorage.removeItem("refresh_token");
    navigate("/login");
    notification.success("Logout Successfully.");
  };

  const filterUpdate = (data) => {
    setPageFilter({
      keyword: data?.searchKey,
      startDate: data?.startDate,
      endDate: data?.endDate,
      selectOne: data?.selectOne,
      selectTwo: data?.selectTwo,
      selectThree: data?.selectThree,
    });
  };

  const contextData = {
    user,
    loginUser,
    logoutUser,
    updateProfile,
    sidebarStatus,
    handleSidebar,
    pageName,
    updatePageName,
    loginMessage,
    pageFilter,
    filterUpdate,
  };
  return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>;
};
