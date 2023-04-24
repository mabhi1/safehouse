const dateFormatter = (date: Date) => {
  const dateFormatter = new Intl.DateTimeFormat("en-us", { dateStyle: "long" });
  return dateFormatter.format(new Date(date));
};

export { dateFormatter };
