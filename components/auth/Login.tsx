import Image from "next/image";
import Link from "next/link";
import Button from "../ui/Button";
import { passwordReset, rememberSignIn, signIn } from "@/firebase/firebaseFunctions";
import React, { useEffect, useState } from "react";
import Input from "../ui/Input";
import { showToast } from "@/utils/handleToast";
import Spinner from "../ui/Spinner";
import { FiEye, FiEyeOff } from "react-icons/fi";

type Props = {};
const Login = (props: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const emailInput = document.getElementById("email");
    if (emailInput) emailInput.focus();
  }, []);

  const handleReset = async () => {
    setLoading(true);
    const emailInput = document.getElementById("email");
    if (!emailInput || !("value" in emailInput)) return;
    if (emailInput.value === "" || typeof emailInput.value !== "string") {
      showToast("error", "Enter email to reset");
      return;
    }
    try {
      const email = emailInput.value.trim();
      await passwordReset(email);
      showToast("success", "Check your inbox to reset");
    } catch (error: any) {
      showToast("error", error);
    }
    setLoading(false);
  };

  const toggleShowPassword = () => {
    setShowPassword((showPassword) => !showPassword);
  };

  const handleLogin = async (e: React.SyntheticEvent) => {
    setLoading(true);
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
      remember: { checked: boolean };
    };
    const email = target.email.value.trim();
    const password = target.password.value.trim();
    const checked = target.remember.checked;
    try {
      if (checked) await rememberSignIn(email, password);
      else await signIn(email, password);
    } catch (error: any) {
      if (error === "Wrong Password") error = "User Not Found";
      showToast("error", error);
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, labelName: string) => {
    const value = e.target.value;
    let label = document.getElementById(labelName);
    if (value.length > 0) {
      label?.classList.add("-translate-y-5", "text-sm", "text-cyan-900");
    } else {
      label?.classList.remove("-translate-y-5", "text-sm", "text-cyan-900");
    }
  };

  return (
    <div className="text-base bg-slate-50 flex flex-col min-h-screen">
      <header className="pt-5 px-3 md:px-10 flex items-center justify-between mb-10">
        <div className="flex gap-1 items-center">
          <Image src="/logo.png" alt="Safe House" width={50} height={50} priority />
          <Link href={"/home"}>Safe House</Link>
        </div>
      </header>
      <main className="flex-1 px-12 md:px-5 pb-5">
        <div className="flex-1 flex flex-col lg:flex-row items-center gap-5 justify-center">
          <div className="w-1/2 lg:w-1/4 justify-center flex">
            <Image src="/login-img.png" width={420} height={494} alt="Login" priority className="w-auto h-auto" />
          </div>
          <div className="flex flex-col gap-3 lg:w-1/3 lg:p-8">
            <h1 className="text-3xl">Welcome back</h1>
            <h2 className="text-sm">Login to your dashboard and access your notes, passwords, links and more.</h2>
            <form className="flex flex-col gap-3" autoComplete="off" onSubmit={handleLogin}>
              <div className="relative flex-1">
                <Input
                  wide="full"
                  onChange={(e) => handleChange(e, "emailLabel")}
                  id="email"
                  type="email"
                  name="email"
                  className="peer"
                  autoComplete="false"
                  formNoValidate
                />
                <label
                  id="emailLabel"
                  htmlFor="email"
                  className="absolute cursor-text text-slate-400 text-base left-[0.6rem] top-[0.6rem] peer-focus:-translate-y-5 peer-focus:text-sm peer-focus:text-cyan-900 bg-slate-50 transition-all duration-200"
                >
                  Email
                </label>
              </div>
              <div className="relative flex-1">
                <Input
                  wide="full"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  onChange={(e) => handleChange(e, "passwordLabel")}
                  className="peer"
                  readOnly
                  onFocus={(e) => e.target.removeAttribute("readonly")}
                />
                <label
                  htmlFor="password"
                  id="passwordLabel"
                  className="absolute cursor-text text-slate-400 text-base left-[0.6rem] top-[0.6rem] peer-focus:-translate-y-5 peer-focus:text-sm peer-focus:text-cyan-900 bg-slate-50 transition-all duration-200"
                >
                  Password
                </label>
                {showPassword ? (
                  <FiEyeOff className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer" onClick={toggleShowPassword} />
                ) : (
                  <FiEye className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer" onClick={toggleShowPassword} />
                )}
              </div>
              <div className="flex justify-between">
                <span className="flex gap-1 items-center">
                  <Input type="checkbox" id="remember" name="remember" value="remember" className="hover:cursor-pointer" />
                  <label htmlFor="remember" className="cursor-pointer">
                    Remember Me
                  </label>
                </span>
                {loading ? (
                  <Spinner size="sm" />
                ) : (
                  <Button variant="link" onClick={handleReset} type="button">
                    Forgot Password?
                  </Button>
                )}
              </div>
              {loading ? (
                <Button variant="disabled">
                  <Spinner size="sm" />
                </Button>
              ) : (
                <Button>Login</Button>
              )}
              <div className="flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-slate-300 after:mt-0.5 after:flex-1 after:border-t after:border-slate-300">
                <p className="mx-4 mb-0 text-center">OR</p>
              </div>
              <Button variant="disabled">Register</Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};
export default Login;
