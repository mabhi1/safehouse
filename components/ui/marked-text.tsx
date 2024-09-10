type Props = {
  searchTerm: string;
  text: string;
};
const MarkedText = ({ searchTerm, text }: Props) => {
  if (searchTerm.length === 0) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(searchTerm);
  if (idx === -1) return <>{text}</>;
  return (
    <div className="text-wrap text-left">
      <>{text.substring(0, idx)}</>
      <span className="bg-fuchsia-300">{text.substring(idx, idx + searchTerm.length)}</span>
      <>{text.substring(idx + searchTerm.length)}</>
    </div>
  );
};
export default MarkedText;
