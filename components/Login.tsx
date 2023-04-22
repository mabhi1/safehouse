import Image from "next/image";
import Link from "next/link";
import BtnLink from "./utils/BtnLink";
import { signIn } from "@/firebase/firebaseFunctions";
import { Dispatch, SetStateAction } from "react";

type Props = {
  setVerified: Dispatch<SetStateAction<boolean>>;
};
const Login = (props: Props) => {
  const handleLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value;
    const password = target.password.value;
    await signIn(email, password);
    props.setVerified(true);
  };

  const handleChange = (e) => {
    const emailValue = e.target.value;
    console.log(emailValue.length);
    let emailLabel = document.getElementById("emailLabel");
    if (emailValue.length > 0) {
      emailLabel?.classList.add("-translate-y-4");
      emailLabel?.classList.add("text-sm");
      emailLabel?.classList.add("text-cyan-900");
    } else {
      emailLabel?.classList.remove("-translate-y-4");
      emailLabel?.classList.remove("text-sm");
      emailLabel?.classList.remove("text-cyan-900");
    }
  };

  return (
    <main className="py-5 px-10 text-base bg-slate-50 min-h-screen">
      <header className="flex items-center justify-between mb-10">
        <div className="flex gap-1 items-center">
          <Image src="/logo.png" alt="Safe House" width={50} height={50} priority />
          <Link href={"/home"}>Safe House</Link>
        </div>
      </header>
      <div className="flex-1 flex flex-col lg:flex-row items-center gap-5 justify-center">
        <Image src="/login-img.png" width={420} height={494} alt="Login" />
        <div className="flex flex-col gap-2 lg:w-1/3 lg:p-8">
          <h1 className="text-3xl">Welcome back</h1>
          <h2 className="text-sm">Login to your dashboard and access your notes, passwords, links and more.</h2>
          <form className="flex flex-col gap-3" autoComplete="off" onSubmit={handleLogin}>
            <div className="relative flex-1">
              <input
                onChange={handleChange}
                type="email"
                name="email"
                className="w-full peer p-2 border-2 focus:border-cyan-900 focus-visible:outline-none bg-slate-50 border-slate-400 rounded w-100"
                autoComplete="false"
              />
              <label
                id="emailLabel"
                htmlFor="email"
                className="absolute text-slate-400 text-base left-2 top-2 peer-focus:-translate-y-4 peer-focus:text-sm peer-focus:text-cyan-900 bg-slate-50 transition-all duration-200"
              >
                Email
              </label>
            </div>
            <div className="relative flex-1">
              <input
                type="password"
                name="password"
                className="w-full peer p-2 border-2 focus:border-cyan-900 focus-visible:outline-none bg-slate-50 border-slate-400 rounded w-100"
                readOnly
                onFocus={(e) => e.target.removeAttribute("readonly")}
              />
              <label
                htmlFor="password"
                className="absolute text-slate-400 text-base left-2 top-2 peer-focus:-translate-y-4 peer-focus:text-sm peer-focus:text-cyan-900 bg-slate-50 transition-all duration-200"
              >
                Password
              </label>
            </div>
            <div className="flex justify-between">
              <span className="flex gap-1">
                <input type="checkbox" name="remember" value="remember" className="inline-block pl-[0.15rem] hover:cursor-pointer" />
                <label htmlFor="remember">Remember Me</label>
              </span>
              <BtnLink color="cyan" text="Forgot Password?" />
            </div>
            <input
              type="submit"
              value="Login"
              className="p-2 cursor-pointer shadow-lg shadow-cyan-900/50 rounded bg-cyan-900 hover:bg-cyan-800 focus:bg-cyan-800 text-slate-50 uppercase"
            />
            <div className="flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-slate-300 after:mt-0.5 after:flex-1 after:border-t after:border-slate-300">
              <p className="mx-4 mb-0 text-center">OR</p>
            </div>
            <button className="p-2 rounded bg-slate-400 text-slate-50 uppercase cursor-not-allowed" disabled>
              Register
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};
export default Login;
