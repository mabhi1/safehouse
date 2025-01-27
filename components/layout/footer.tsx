import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-10">
      <div className="bg-accent text-sm text-accent-foreground flex justify-center p-2 gap-1">
        <span>&copy; 2023. All Rights Reserved.</span>
        <Link href="/privacy-policy" className="text-primary hover:underline underline-offset-2">
          Privacy policy.
        </Link>
      </div>
    </footer>
  );
};
export default Footer;
