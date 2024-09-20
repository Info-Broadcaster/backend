export default function TagList({ tags }) {
  return (
    <div className="flex items-start justify-start w-full pl-7">
      <div className="flex gap-3 ">
        {tags?.map((tag, index) => (
          <span key={index} className="flex bg-slate-700 px-3 py-1 text-white">
            # {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
