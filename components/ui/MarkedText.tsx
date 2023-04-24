type Props = {
  searchTerm: string;
  text: string;
};
const MarkedText = ({ searchTerm, text }: Props) => {
  if (searchTerm.length === 0) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(searchTerm);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      <>{text.substring(0, idx)}</>
      <span className="bg-fuchsia-200">{text.substring(idx, idx + searchTerm.length)}</span>
      <>{text.substring(idx + searchTerm.length)}</>
    </>
  );
};
export default MarkedText;
