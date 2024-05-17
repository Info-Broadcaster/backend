import Header from "./Header";

export default function PageLayer({ title = undefined, children }) {
  return (
    <>
      <Header />
      {title == undefined ? null : <h1>{title}</h1>}
      <main className=" w-full h-screen p-20">{children}</main>
    </>
  );
}
