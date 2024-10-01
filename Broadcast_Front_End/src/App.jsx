/* eslint-disable react/no-unescaped-entities */
import "./App.css";
import { useNavigate } from "react-router-dom";
import PageLayer from "./PageLayer";
import { useState } from "react";
import Button from "./components/Button";

function App() {
  const [link, setLink] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("fr");
  const navigate = useNavigate();
  function generateArticle() {
    if (link === "") {
      alert("Veuillez entrer un lien");
      return;
    }
    navigate(`/edition/${encodeURIComponent(link)}/${selectedLanguage}`);
  }

  function onLinkChange(event) {
    setLink(event.target.value);
  }

  function onLanguageChange(event) {
    console.log(event.target.value);
    setSelectedLanguage(event.target.value);
  }

  return (
    <PageLayer>
      <div className="flex flex-col w-full items-center gap-10">
        <img src="/logo1.png" className="rounded-full h-28 w-28" />
        <h1 className="text-4xl">Bienvenue sur InfoBroadcaster</h1>
        <p>
          InfoBroadcaster est une application de diffusion d'informations, elle
          permet de résumer des liens web et de les diffuser à un public ciblé.
        </p>
        <div className="flex w-full justify-center">
          <input
            type="text"
            placeholder="Votre lien ..."
            className="border w-5/12 h-14 text-center"
            value={link}
            onChange={onLinkChange}
          />
          <select name="langue" id="langue" onChange={onLanguageChange}>
            <option value="fr">Français </option>
            <option value="en">Anglais</option>
          </select>
        </div>
        <Button callback={() => generateArticle()}>Générer</Button>
      </div>
    </PageLayer>
  );
}

export default App;
