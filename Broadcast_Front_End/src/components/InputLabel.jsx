export default function InputLabel({
  label,
  placeholder = "",
  value,
  setValue,
}) {
  return (
    <div className="flex items-center justify-center w-full gap-5">
      <span className="w-1/6">
        <label>{label}</label>
      </span>
      <input
        type="text"
        className="border w-5/6 text-start p-4"
        placeholder={placeholder}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    </div>
  );
}
