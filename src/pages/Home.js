import React from "react";
import Dashboard from "./dashboard/Dashboard";
import UserGraph from "./dashboard/UserGraph";
import AdminGraph from "./dashboard/AdminGraph";

const Home = () => {
  return (
    <div className="py-4 px-4 md:px-8 dark:bg-slate-900">
      <Dashboard />
      <div className="sale_report grid grid-cols-2 gap-5 mb-7">
        <UserGraph />
        <AdminGraph />
      </div>
    </div>
  );
};

export default Home;
