import Header from "./Header";

export default function PageLayer({ title = undefined, children }) {
  return (
    <>
      <Header />
      <main className=" w-full h-screen p-20">
        {title == undefined ? null : (
          <h1 className="text-2xl uppercase pb-20">{title}</h1>
        )}
        <div>{children}</div>
      </main>
    </>
  );
}
