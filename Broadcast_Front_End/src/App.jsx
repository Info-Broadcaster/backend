/* eslint-disable react/no-unescaped-entities */
import "./App.css";
import { useNavigate } from "react-router-dom";
import PageLayer from "./PageLayer";
import { useState } from "react";
import Button from "./components/Button";

// sendUrl("http://localhost:443/api/dialoguewithllama/url", { url: link });
function App() {
  const [link, setLink] = useState("");
  const navigate = useNavigate();
  function generateArticle() {
    navigate("/edition/" + link);
  }

  function onLinkChange(event) {
    setLink(event.target.value);
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
          value={link}
          onChange={onLinkChange}
        />
        <Button callback={() => generateArticle()}>Générer</Button>
      </div>
    </PageLayer>
  );
}

export default App;
