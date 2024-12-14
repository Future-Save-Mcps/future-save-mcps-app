import React from "react";

import { Outlet } from "react-router-dom";

const AdminLayout = () => (
  <div className="admin-layout">
    hi
    {/* <Sidebar />  */}
    <main>
      {/* <Navbar />  */}
      <Outlet />
    </main>
  </div>
);

export default AdminLayout;
