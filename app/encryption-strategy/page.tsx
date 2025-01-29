import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import encryptionFlow from "@/lib/encryption-strategy.json";
import encryptionStrategyImage from "@/public/encryption-strategy.png";
import encryptionImage from "@/public/encryption.png";
import Image from "next/image";

function EncryptionStrategyPage() {
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-start flex-col-reverse md:flex-row gap-5">
        <div className="space-y-4">
          <div className="text-base uppercase">Encryption Strategy</div>
          <div>
            All your data for passwords and cards are encrypted using following encryption strategy and then stored to
            the server.
          </div>
          <ul className="list-disc list-inside space-y-1">
            {encryptionFlow.importantNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
          <div className="text-destructive font-medium">
            You won&apos;t be able to get your data back if you loose both the master password and the recovery key.
          </div>
        </div>
        <Image src={encryptionImage} priority width={200} height={200} alt="Encryption" className="rounded-full" />
      </div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="encryption">
          <AccordionTrigger className="underline-offset-2 gap-5 pb-5 rounded">
            <div className="flex flex-col items-start">
              <div>{encryptionFlow.encryptionStrategy.title}</div>
              <div className="text-muted-foreground text-start text-xs">
                {encryptionFlow.encryptionStrategy.description}
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-5 p-4 bg-muted/50 shadow-inner">
            {encryptionFlow.encryptionStrategy.steps.map((step) => (
              <div key={step.stepNumber} className="space-y-2">
                <div>{step.title}</div>
                <ul className="list-inside list-decimal">
                  {step.details.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="decryption">
          <AccordionTrigger className="underline-offset-2 gap-5 pb-5 rounded">
            <div className="flex flex-col items-start">
              <div>{encryptionFlow.decryptionFlow.title}</div>
              <div className="text-muted-foreground text-start text-xs">
                {encryptionFlow.decryptionFlow.description}
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-5 p-4 bg-muted/50 shadow-inner">
            {encryptionFlow.decryptionFlow.steps.map((step) => (
              <div key={step.stepNumber} className="space-y-2">
                <div>{step.title}</div>
                <ul className="list-inside list-decimal">
                  {step.details.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="recovery" className="border-none">
          <AccordionTrigger className="underline-offset-2 gap-5 pb-5 rounded">
            <div className="flex flex-col items-start">
              <div>{encryptionFlow.recoveryMechanism.title}</div>
              <div className="text-muted-foreground text-start text-xs">
                {encryptionFlow.recoveryMechanism.description}
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-5 p-4 bg-muted/50 shadow-inner">
            {encryptionFlow.recoveryMechanism.steps.map((step) => (
              <div key={step.stepNumber} className="space-y-2">
                <div>{step.title}</div>
                <ul className="list-inside list-decimal">
                  {step.details.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Image
        src={encryptionStrategyImage}
        priority
        width={1000}
        height={1000}
        alt="Encryption Strategy"
        className="w-full max-w-5xl mx-auto"
      />
    </div>
  );
}
export default EncryptionStrategyPage;
