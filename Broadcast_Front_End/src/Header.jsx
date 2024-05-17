import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="flex h-[8vh] w-full bg-purple-500 items-center justify-center">
      <Link to={"/"}>
        <div className="text-white text-2xl">Info Broadcaster</div>
      </Link>
    </header>
  );
}
