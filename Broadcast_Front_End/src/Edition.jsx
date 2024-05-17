import { useEffect, useState } from "react";
import PageLayer from "./PageLayer";
import InputLabel from "./components/InputLabel";
import { useParams } from "react-router-dom";
import axios from "axios";
import SnackBar from "./components/SnackBar";

export default function Edition() {
  const { link } = useParams();
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("");
  const [theme, setTheme] = useState("");

  useEffect(() => {
    axios
      .post("http://localhost:443/api/dialoguewithllama/url", link)
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
  }, [link]);

  // function generate(url, body) {
  //
  // }

  return (
    <PageLayer title="Edition">
      <div className="py-10">
        <SnackBar />
      </div>
      <div className="flex w-full flex-col gap-5">
        <InputLabel label="Lien" value={link} disabled={true} />
        <InputLabel
          label="Sujet"
          setValue={(e) => setSubject(e.target.value)}
          value={subject}
        />
        <InputLabel
          label="Contenu"
          setValue={(e) => setContent(e.target.value)}
          value={content}
        />
        <InputLabel
          label="Langue"
          setValue={(e) => setLanguage(e.target.value)}
          value={language}
        />
        <InputLabel
          label="Thème"
          setValue={(e) => setTheme(e.target.value)}
          value={theme}
        />
      </div>
    </PageLayer>
  );
}
