import { Separator } from "@/components/ui/separator";
import aboutPage from "@/lib/about.json";
import Image from "next/image";
import Link from "next/link";

function AboutPage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:gap-10 items-center">
        <Image src="/hero.svg" alt="Safe House" width={200} height={200} priority className="w-60 lg:w-96" />
        <div className="flex flex-col justify-center gap-5">
          <h2 className="text-2xl">{aboutPage.title}</h2>
          <div>{aboutPage.description}</div>
        </div>
      </div>
      <ul className="space-y-5">
        {aboutPage.features.map((feature) => (
          <li key={feature.title}>
            <div>{feature.title}</div>
            <div className="text-muted-foreground">{feature.description}</div>
          </li>
        ))}
      </ul>
      <Separator />
      <div className="space-y-2">
        <div className="font-medium">{aboutPage.privacy_commitment.title}</div>
        <div>{aboutPage.privacy_commitment.description}</div>
        <div className="flex gap-1 flex-wrap">
          <div>{aboutPage.closing_message}</div>
          <Link href="/encryption-strategy" className="text-primary hover:underline underline-offset-2">
            Click here
          </Link>
          to know more about our encryption strategy.
          <Link href="/contact" className="text-primary hover:underline underline-offset-2">
            Contact us
          </Link>
          if you have any questions or concerns.
        </div>
      </div>
    </div>
  );
}
export default AboutPage;
