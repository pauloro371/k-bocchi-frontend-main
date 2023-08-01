import React from "react";

import { Link, Outlet } from "react-router-dom";

export default function Root() {
  return (
    <>
      <div className="navbar">
        <h1>K-Bocchi</h1>
        <ul>
          <li>
            <Link to={"/home"}>Home</Link>
          </li>
          <li>
            <Link to={"/signup"}>Signup</Link>
          </li>
          <li>
            <Link to={"/login"}>Login</Link>
          </li>
        </ul>
        <Outlet />
      </div>
    </>
  );
}
