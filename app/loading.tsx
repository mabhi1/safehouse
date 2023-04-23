import Spinner from "@/components/ui/Spinner";

const Loading = () => {
  return (
    <div className="flex-1 flex flex-col items-center gap-10 pt-20">
      <Spinner size="xl" />
      <span>Please Wait...</span>
    </div>
  );
};
export default Loading;
