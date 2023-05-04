"use client";
import { FcApproval, FcExpired, FcHighPriority, FcInfo } from "react-icons/fc";
import { IoClose } from "react-icons/io5";

type Props = {};

const Toast = (props: Props) => {
  return (
    <>
      {/* Success Toast */}
      <div
        id="success-toast"
        className="toast z-50 transition-transform duration-300 fixed top-1 right-1 md:top-10 md:right-10 translate-x-[150%] flex w-96 gap-3 bg-green-50 items-center border-l-8 border-l-green-700 rounded shadow-lg shadow-slate-300 p-3"
      >
        <FcApproval className="text-2xl" />
        <IoClose data-toast-close className="absolute top-1 right-1 text-2xl cursor-pointer" />
        <div>
          <h1>Success</h1>
          <span className="text-slate-600" id="success-toast-message"></span>
        </div>
      </div>

      {/* Error Toast */}
      <div
        id="error-toast"
        className="toast z-50 transition-transform duration-300 fixed top-1 right-1 md:top-10 md:right-10 translate-x-[150%] flex w-96 gap-3 bg-red-50 items-center border-l-8 border-l-red-700 rounded shadow-lg shadow-slate-300 p-3"
      >
        <FcHighPriority className="text-2xl" />
        <IoClose data-toast-close className="absolute top-1 right-1 text-2xl cursor-pointer" />
        <div>
          <h1>Error</h1>
          <span className="text-slate-600" id="error-toast-message"></span>
        </div>
      </div>

      {/* Info Toast */}
      <div
        id="info-toast"
        className="toast z-50 transition-transform duration-300 fixed top-1 right-1 md:top-10 md:right-10 translate-x-[150%] flex w-96 gap-3 bg-blue-50 items-center border-l-8 border-l-blue-700 rounded shadow-lg shadow-slate-300 p-3"
      >
        <FcInfo className="text-2xl" />
        <IoClose data-toast-close className="absolute top-1 right-1 text-2xl cursor-pointer" />
        <div>
          <h1>Info</h1>
          <span className="text-slate-600" id="info-toast-message"></span>
        </div>
      </div>

      {/* Warning Toast */}
      <div
        id="warning-toast"
        className="toast z-50 transition-transform duration-300 fixed top-1 right-1 md:top-10 md:right-10 translate-x-[150%] flex w-96 gap-3 bg-yellow-50 items-center border-l-8 border-l-yellow-700 rounded shadow-lg shadow-slate-300 p-3"
      >
        <FcExpired className="text-2xl" />
        <IoClose data-toast-close className="absolute top-1 right-1 text-2xl cursor-pointer" />
        <div>
          <h1>Warning</h1>
          <span className="text-slate-600" id="warning-toast-message"></span>
        </div>
      </div>
    </>
  );
};
export default Toast;
