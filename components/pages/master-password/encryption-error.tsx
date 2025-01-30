export const EncryptionError = ({ error }: { error: any }) => {
  return (
    <div className="space-y-5">
      <div className="text-base uppercase">Master Password Error</div>
      <div className="text-center w-full">
        <h1 className="text-red-900 text-xl">Something went wrong!</h1>
        <div className="text-base">Please contact us or try again after some time.</div>
        <div>Error: {JSON.stringify(error)}</div>
      </div>
    </div>
  );
};
