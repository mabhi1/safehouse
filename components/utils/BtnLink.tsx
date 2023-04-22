type Props = {
  text: String;
  color: String;
};
const BtnLink = ({ text, color, ...rest }: Props) => {
  return (
    <button
      className={`text-${color}-900 relative hover:after:w-full after:transition-all after:duration-500 after:content-[''] after:w-0 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-${color}-900`}
      {...rest}
    >
      {text}
    </button>
  );
};
export default BtnLink;
