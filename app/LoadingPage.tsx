type Props = {};
const LoadingPage = (props: Props) => {
  return (
    <div className="animate-pulse pt-5 px-5 md:px-10 w-full flex flex-col min-h-screen items-center mb-10">
      <div className="flex items-center justify-between w-full">
        <div className="flex gap-2 items-center">
          <div className="rounded-lg bg-slate-400 h-12 w-12"></div>
          <div className="space-y-6 py-1 w-10 h-2 rounded bg-slate-400"></div>
        </div>
        <div className="hidden lg:flex gap-12">
          <div className="space-y-6 py-1 w-10 h-2 rounded bg-slate-400"></div>
          <div className="space-y-6 py-1 w-10 h-2 rounded bg-slate-400"></div>
          <div className="space-y-6 py-1 w-10 h-2 rounded bg-slate-400"></div>
          <div className="space-y-6 py-1 w-10 h-2 rounded bg-slate-400"></div>
          <div className="space-y-6 py-1 w-10 h-2 rounded bg-slate-400"></div>
        </div>
        <div className="space-y-6 py-1 w-10 h-2 rounded bg-slate-400"></div>
      </div>
      <div className="flex-1 flex justify-center items-center flex-col gap-8">
        <div className="space-y-6 py-1 w-80 lg:w-96 h-2 rounded bg-slate-400"></div>
        <div className="space-y-6 py-1 w-60 lg:w-72 h-2 rounded bg-slate-400"></div>
        <div className="space-y-6 py-1 w-72 lg:w-80 h-2 rounded bg-slate-400"></div>
      </div>
    </div>
  );
};
export default LoadingPage;
