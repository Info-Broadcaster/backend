/* eslint-disable react/no-unescaped-entities */
import "./App.css";
import { useNavigate } from "react-router-dom";
import PageLayer from "./PageLayer";

function App() {
  const navigate = useNavigate();
  function generateArticle() {
    navigate("/edition");
  }

  return (
    <PageLayer>
      <div className="flex flex-col w-full items-center gap-10">
        <h1 className="text-4xl">Bienvenue sur InfoBroadcaster</h1>
        <p>
          InfoBroadcaster est une application de diffusion d'informations, elle
          permet de résumer des liens web et de les diffuser à un public ciblé.
        </p>
        <input
          type="text"
          placeholder="Votre lien ..."
          className="border w-5/12 h-14 text-center"
        />
        <button
          className="bg-purple-400 w-60 h-14 rounded-md"
          onClick={() => generateArticle()}
        >
          Générer
        </button>
      </div>
    </PageLayer>
  );
}

export default App;
