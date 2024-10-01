import { useRef, useState } from "react";
import Button from "./Button";

export default function LogInForm() {
  const username = useRef("");
  const password = useRef("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleLogIn() {
    setErrorMsg("");
    setIsLoading(true);
    if (username.current === "" || password.current === "") {
      setErrorMsg("Veuillez remplir les champs");
      setIsLoading(false);
      return;
    }

    const data = {
      username: username.current,
      password: password.current,
    };

    fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        if (data.success) {
          alert("Connexion réussie");
        } else {
          alert("Nom d'utilisateur ou mot de passe incorrect");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setErrorMsg("Une erreur est survenue");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className="flex w-1/2 min-w-96 h-auto p-8 bg-gray-200 flex-col items-center justify-around shadow-lg rounded-lg gap-10">
      <h2 className="font-bold">Connexion à Rainbow</h2>
      <img src="/rainbow.png" alt="logo rainbow" height={90} width={90} />
      <input
        type="text"
        placeholder="Nom d'utilisateur"
        className={`h-12 w-80 p-2 ${
          isLoading ? "cursor-not-allowed bg-gray-300" : "cursor-pointer"
        }`}
        onChange={(e) => (username.current = e.target.value)}
      />
      <input
        type="password"
        placeholder="Mot de passe"
        className={`h-12 w-80 p-2 ${
          isLoading ? "cursor-not-allowed bg-gray-300" : "cursor-pointer"
        }`}
        onChange={(e) => (password.current = e.target.value)}
      />
      {errorMsg != "" && <span className="text-red-600">{errorMsg}</span>}
      <Button callback={handleLogIn} isLoading={isLoading}>
        Se connecter
      </Button>
    </div>
  );
}
