import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="flex h-[8vh] w-full bg-purple-700 items-center justify-between px-8 shadow-lg">
      <Link to={"/"} className="flex items-center justify-center gap-3">
        <img
          src="/logo1.png"
          className="rounded-full h-10 w-10 filter invert brightness-0"
        />
        <div className="text-white text-2xl">Info Broadcaster</div>
      </Link>
      <Link to={"/connexion"} className="text-white text-lg ml-10">
        Connexion
      </Link>
    </header>
  );
}
