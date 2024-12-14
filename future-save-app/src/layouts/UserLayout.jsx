import React from "react";

import { Outlet } from "react-router-dom";

const UserLayout = () => (
  <div className="user-layout">
    {/* <Navbar />  */}
    <main>
      <Outlet />
    </main>
  </div>
);

export default UserLayout;
