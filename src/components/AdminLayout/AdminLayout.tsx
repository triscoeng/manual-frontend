import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../navbar/navbar";
import Sidebar from "../sidebar/sidebar";

import "./AdminLayout.scss";

const AdminLayout = () => {
  return (
    <div className="container">
      <Sidebar />
      <div className="home">
        <Navbar />
        <div className="homeContainer">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
