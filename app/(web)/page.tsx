import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div className="flex flex-col md:flex-row">
        <Image src="/hero.svg" alt="Safe House" width={300} height={300} priority />
        <div className="flex flex-col justify-center p-5 gap-2 w-full md:w-1/2">
          <h2 className="text-2xl">Safe House</h2>
          <div>
            Your personal Secure storage for passwords, banks, notes and more. All your sensitive data are stored in an
            encrypted form.
          </div>
        </div>
      </div>
    </div>
  );
}
