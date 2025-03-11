/**
 * Note: Use position fixed according to your needs
 * Desktop navbar is better positioned at the bottom
 * Mobile navbar is better positioned at bottom right.
 **/

import { cn } from "@/lib/utils";
import { AnimatePresence, MotionValue, motion, useMotionValue } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import { Button } from "./button";
import { ChevronDown, ChevronUp } from "lucide-react";

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
  activeLetter = "",
}: {
  items: { title: string; icon?: React.ReactNode; href: string }[];
  desktopClassName?: string;
  mobileClassName?: string;
  activeLetter?: string;
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} activeLetter={activeLetter} />
      <FloatingDockMobile items={items} className={mobileClassName} activeLetter={activeLetter} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
  activeLetter,
}: {
  items: { title: string; icon?: React.ReactNode; href: string }[];
  className?: string;
  activeLetter: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("relative block md:hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute bottom-full mb-2 inset-x-0 flex flex-col gap-2 h-[70dvh] w-fit overflow-y-auto no-scrollbar justify-end"
          >
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  transition: {
                    delay: idx * 0.01,
                  },
                }}
                transition={{ delay: (items.length - 1 - idx) * 0.01 }}
              >
                <Link
                  href={item.href}
                  key={item.title}
                  className="h-10 w-10 rounded-full bg-muted flex items-center justify-center border border-muted-foreground/15"
                >
                  <div
                    className={cn(
                      "h-4 w-4 text-center bg-muted text-muted-foreground",
                      activeLetter === item.title ? "text-primary font-medium" : "text-muted-foreground"
                    )}
                  >
                    {item.icon ? item.icon : item.title}
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <Button size="icon" onClick={() => setOpen(!open)} className="rounded-full h-10 w-10">
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
      </Button>
    </div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
  activeLetter,
}: {
  items: { title: string; icon?: React.ReactNode; href: string }[];
  className?: string;
  activeLetter: string;
}) => {
  const mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto hidden md:flex gap-4 items-end rounded-2xl bg-gray-50 dark:bg-neutral-900 px-4 py-3 w-fit",
        className
      )}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} activeLetter={activeLetter} {...item} />
      ))}
    </motion.div>
  );
};

function IconContainer({
  title,
  icon,
  href,
  activeLetter,
}: {
  mouseX: MotionValue;
  title: string;
  icon?: React.ReactNode;
  href: string;
  activeLetter: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Link href={href}>
      <motion.div
        ref={ref}
        className={cn(
          "aspect-square rounded-full flex items-center justify-center relative w-10 h-10",
          activeLetter === title ? "bg-primary" : "bg-gray-200 dark:bg-gray-800 hover:bg-primary/20"
        )}
      >
        <motion.div className="flex items-center justify-center w-4 h-4">
          <span className={activeLetter === title ? "text-muted" : "text-muted-foreground"}>{icon ? icon : title}</span>
        </motion.div>
      </motion.div>
    </Link>
  );
}
