export default function Button({ children, callback }) {
  return (
    <button
      className="bg-purple-700 w-60 h-14 rounded-md text-white"
      onClick={callback}
    >
      {children}
    </button>
  );
}
