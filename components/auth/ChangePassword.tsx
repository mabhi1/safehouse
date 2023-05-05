import { useState } from "react";
import Input from "../ui/Input";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Button from "../ui/Button";
import { showToast } from "@/utils/handleToast";
import { changePassword } from "@/firebase/firebaseFunctions";
import { User } from "firebase/auth";
import Spinner from "../ui/Spinner";

type Props = {
  user: User;
};
const ChangePassword = ({ user }: Props) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, labelName: string) => {
    const value = e.target.value;
    let label = document.getElementById(labelName);
    if (value.length > 0) {
      label?.classList.add("-translate-y-5", "text-sm", "text-cyan-900");
    } else {
      label?.classList.remove("-translate-y-5", "text-sm", "text-cyan-900");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (oldPassword.trim() === "" || newPassword.trim() === "") {
      showToast("error", "Old and New Password required");
      return;
    }
    if (newPassword.trim() !== confirmPassword.trim()) {
      showToast("error", "Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await changePassword(user.email!, oldPassword, newPassword);
      showToast("success", "Password changed successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setLoading(false);
    } catch (error: any) {
      if (error === "Weak Password") showToast("error", "Password must be at least 6 characters long");
      else showToast("error", error);
      setLoading(false);
    }
  };

  return (
    <div className="pt-3 md:pt-5 border-t-2 border-slate-200 flex flex-col gap-3 w-full">
      <div>Change Password</div>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <div className="relative">
          <Input
            wide="lg"
            onChange={(e) => {
              handleChange(e, "oldLabel");
              setOldPassword(e.target.value);
            }}
            value={oldPassword}
            id="oldPassword"
            type="password"
            name="oldPassword"
            className="peer w-full"
            autoComplete="false"
          />
          <label
            id="oldLabel"
            htmlFor="oldPassword"
            className="absolute cursor-text text-slate-400 bg-slate-50 text-base left-[0.6rem] top-[0.6rem] peer-focus:-translate-y-5 peer-focus:text-sm peer-focus:text-cyan-900 transition-all duration-200"
          >
            Old Password
          </label>
        </div>
        <div className="relative md:w-fit">
          <Input
            wide="lg"
            type={showPassword ? "text" : "password"}
            id="newPassword"
            name="newPassword"
            onChange={(e) => {
              handleChange(e, "passwordLabel");
              setNewPassword(e.target.value);
            }}
            value={newPassword}
            className="peer w-full"
          />
          <label
            htmlFor="newPassword"
            id="passwordLabel"
            className="absolute cursor-text text-slate-400 text-base left-[0.6rem] top-[0.6rem] peer-focus:-translate-y-5 peer-focus:text-sm peer-focus:text-cyan-900 bg-slate-50 transition-all duration-200"
          >
            New Password
          </label>
          {showPassword ? (
            <FiEyeOff
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            />
          ) : (
            <FiEye
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            />
          )}
        </div>
        <div className="relative">
          <Input
            wide="lg"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            onChange={(e) => {
              handleChange(e, "confirmLabel");
              setConfirmPassword(e.target.value);
            }}
            value={confirmPassword}
            className="peer w-full"
          />
          <label
            htmlFor="confirmPassword"
            id="confirmLabel"
            className="absolute cursor-text text-slate-400 text-base left-[0.6rem] top-[0.6rem] peer-focus:-translate-y-5 peer-focus:text-sm peer-focus:text-cyan-900 bg-slate-50 transition-all duration-200"
          >
            Confirm Password
          </label>
        </div>
        {loading ? (
          <Button variant={"disabled"} disabled className="md:w-80 lg:w-96">
            <Spinner size="sm" />
            Please Wait...
          </Button>
        ) : (
          <Button type="submit" className="md:w-80 lg:w-96">
            Submit
          </Button>
        )}
      </form>
    </div>
  );
};
export default ChangePassword;
