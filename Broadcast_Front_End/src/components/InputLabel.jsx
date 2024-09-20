export default function InputLabel({
  label,
  placeholder = "",
  value,
  setValue,
  disabled = false,
  textarea = false,
}) {
  return (
    <div className="flex items-center justify-center w-full gap-5">
      <span className="w-1/6">
        <label>{label}</label>
      </span>
      {textarea ? (
        <textarea
          className="border w-5/6 text-start p-4 h-64"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      ) : (
        <input
          type="text"
          className={`border w-5/6 text-start p-4 ${
            disabled && "bg-gray-100 cursor-not-allowed"
          }`}
          placeholder={placeholder}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          disabled={disabled}
        />
      )}
    </div>
  );
}
