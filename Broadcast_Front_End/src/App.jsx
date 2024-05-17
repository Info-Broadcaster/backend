/* eslint-disable react/no-unescaped-entities */
import "./App.css";
import { useNavigate } from "react-router-dom";
import PageLayer from "./PageLayer";
import { useState } from "react";
import Button from "./components/Button";
import axios from "axios";

function App() {
  const [link, setLink] = useState("");
  const navigate = useNavigate();
  function generateArticle() {
    navigate("/edition");
    sendUrl("http://localhost:5000/url", { url: link });
  }

  function onLinkChange(event) {
    setLink(event.target.value);
  }

  function sendUrl(url, body) {
    axios
      .post(url, body)
      .then((response) => {
        console.log(response);
        if (response.data.status === "error") {
          console.error(response.data.message);
          return;
        }
      })
      .catch((error) => {
        console.error(error);
      });
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
