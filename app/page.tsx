import Image from "next/image";

const classes = {
  cards: "flex flex-col gap-3 border p-5 shadow items-center",
  cardHeading: "underline underline-offset-2",
  cardBody: "text-center",
  cardImage: "w-1/2 md:w-full",
};
export default function Home() {
  return (
    <div className="flex flex-col divide-y-2">
      <div className="flex flex-col md:flex-row justify-evenly p-5 lg:p-10">
        <div className="min-w-full md:min-w-[16rem] lg:min-w-[24rem]">
          <Image src={"/frontpage.png"} width={500} height={477} alt="Safe House" />
        </div>
        <div className="flex flex-col justify-center p-5 lg:p-10">
          <h1 className="text-5xl">Safe House</h1>
          <div className="">
            Your personal Secure storage for passwords, banks, notes and more. All the data for your cards and passwords are stored in an encrypted
            form. Only you can see your data
          </div>
        </div>
      </div>
      <div className="flex flex-col p-5 gap-10">
        <div className="text-center text-xl">Features</div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
          <div className={classes.cards}>
            <div className={classes.cardImage}>
              <Image src={"/docs.png"} width={720} height={720} alt="Docs" />
            </div>
            <div className={classes.cardHeading}>Docs</div>
            <div className={classes.cardBody}>Upload your documents and securely access from anywhere</div>
          </div>
          <div className={classes.cards}>
            <div className={classes.cardImage}>
              <Image src={"/notes.png"} width={720} height={720} alt="Docs" />
            </div>
            <div className={classes.cardHeading}>Note</div>
            <div className={classes.cardBody}>Create important notes from anywhere. Edit and Delete them</div>
          </div>
          <div className={classes.cards}>
            <div className={classes.cardImage}>
              <Image src={"/calendar.png"} width={720} height={720} alt="Docs" />
            </div>
            <div className={classes.cardHeading}>Calendar</div>
            <div className={classes.cardBody}>Go through the calendar. Add or Remove daily events</div>
          </div>
          <div className={classes.cards}>
            <div className={classes.cardImage}>
              <Image src={"/cards.png"} width={720} height={720} alt="Docs" />
            </div>
            <div className={classes.cardHeading}>Cards</div>
            <div className={classes.cardBody}>Add Debit or Credit Cards. All the data is encrypted and stored</div>
          </div>
          <div className={classes.cards}>
            <div className={classes.cardImage}>
              <Image src={"/passwords.png"} width={720} height={720} alt="Docs" />
            </div>
            <div className={classes.cardHeading}>Passwords</div>
            <div className={classes.cardBody}>Store encrypted login credentials for any website</div>
          </div>
        </div>
      </div>
    </div>
  );
}
