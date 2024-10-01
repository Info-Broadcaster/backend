export default function AdvancedSpinner() {
  return (
    <div className="relative flex justify-center items-center">
      <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500"></div>
      <img src="/logo1.png" className="rounded-full h-16 w-16 m-12" />
    </div>
  );
}
