import Header from "./Header";

export default function PageLayer({ title = undefined, children }) {
  return (
    <>
      <Header />
      <main className=" w-full p-20">
        {title == undefined ? (
          <br />
        ) : (
          <h1 className="text-2xl uppercase ">{title}</h1>
        )}
        <div>{children}</div>
      </main>
    </>
  );
}
