import React from "react";
import { FiLogOut } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";

const Navbar = () => {
  const router = useLocation();
  const navigate = useNavigate();
  return (
    <div className="shadow-md bg-gray-900 text-yellow-500 px-6 py-4 flex justify-between items-center">
      <p
        className="font-semibold text-2xl flex justify-center items-center cursor-pointer"
        onClick={() => navigate("/")}
      >
        <span className="mr-2">
          <RxDashboard />
        </span>{" "}
        {router.state && router.state.type=="Faculty"?"Staff": router.state.type} Dashboard
      </p>
      <button
        className="flex justify-center items-center  px-3 py-2 font-semibold rounded-sm"
        onClick={() => navigate("/")}
      >
        Logout
        <span className="ml-2">
          <FiLogOut />
        </span>
      </button>
    </div>
  );
};

export default Navbar;
