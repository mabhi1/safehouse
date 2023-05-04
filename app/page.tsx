import Image from "next/image";

const classes = {
  cards: "flex flex-col gap-3 p-5 shadow items-center",
  cardHeading: "underline underline-offset-2",
  cardBody: "text-center",
  cardImage: "w-1/2",
};
export default function Home() {
  return (
    <div className="flex flex-col divide-y-2">
      <div className="flex flex-col md:flex-row justify-center items-center gap-3 md:gap-5 px-5 pb-5 lg:px-10 lg:pb-10">
        <div className="w-full md:w-1/2">
          <Image src={"/homepage.png"} width={1200} height={676} alt="Safe House" priority className="w-auto h-auto" />
        </div>
        <div className="flex flex-col justify-center p-5 lg:p-10 gap-3 md:gap-5 w-full md:w-1/2">
          <h1 className="text-3xl">Safe House</h1>
          <div className="">
            Your personal Secure storage for passwords, banks, notes and more. All the data for your cards and passwords are stored in an encrypted
            form. Only you can see your data
          </div>
        </div>
      </div>
      <div className="flex flex-col p-5 gap-10">
        <div className="text-center">Features</div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          <div className={classes.cards}>
            <div className={classes.cardImage}>
              <Image src={"/docs.png"} width={720} height={720} alt="Docs" priority />
            </div>
            <div className={classes.cardHeading}>Docs</div>
            <div className={classes.cardBody}>Upload your documents and securely access from anywhere</div>
          </div>
          <div className={classes.cards}>
            <div className={classes.cardImage}>
              <Image src={"/notes.png"} width={720} height={720} alt="Notes" priority />
            </div>
            <div className={classes.cardHeading}>Note</div>
            <div className={classes.cardBody}>Create important notes from anywhere. Edit and Delete them</div>
          </div>
          <div className={classes.cards}>
            <div className={classes.cardImage}>
              <Image src={"/calendar.png"} width={720} height={720} alt="Calendar" priority />
            </div>
            <div className={classes.cardHeading}>Calendar</div>
            <div className={classes.cardBody}>Go through the calendar. Add or Remove daily events</div>
          </div>
          <div className={classes.cards}>
            <div className={classes.cardImage}>
              <Image src={"/cards.png"} width={720} height={720} alt="Cards" priority />
            </div>
            <div className={classes.cardHeading}>Cards</div>
            <div className={classes.cardBody}>Add Debit or Credit Cards. All the data is encrypted and stored</div>
          </div>
          <div className={classes.cards}>
            <div className={classes.cardImage}>
              <Image src={"/passwords.png"} width={720} height={720} alt="Passwords" priority />
            </div>
            <div className={classes.cardHeading}>Passwords</div>
            <div className={classes.cardBody}>Store encrypted login credentials for any website</div>
          </div>
        </div>
      </div>
    </div>
  );
}
