import Spinner from "./Spinner";

export default function Button({ children, callback, isLoading = false }) {
  return (
    <button
      className={`bg-purple-700 w-60 h-14 rounded-md text-white ${
        isLoading ? "cursor-not-allowed" : "cursor-pointer"
      }`}
      onClick={callback}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex justify-center">
          <Spinner />
        </div>
      ) : (
        children
      )}
    </button>
  );
}
