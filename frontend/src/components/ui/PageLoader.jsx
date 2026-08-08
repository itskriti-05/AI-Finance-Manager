export default function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center bg-[#FAFAFC]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#6D5EF7] border-t-transparent"></div>

        <p className="text-sm text-gray-500">
          Loading
        </p>
      </div>
    </div>
  );
}