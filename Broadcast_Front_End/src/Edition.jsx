import { useEffect, useState } from "react";
import PageLayer from "./PageLayer";
import InputLabel from "./components/InputLabel";
import { useParams } from "react-router-dom";
import axios from "axios";
import Spinner from "./components/Spinner";

export default function Edition() {
  const { link, lang } = useParams();
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("");
  const [theme, setTheme] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("la langue est ", lang);
    setIsLoading(true);
    axios
      .post("http://localhost:443/api/dialoguewithllama/summarize", {
        url: decodeURIComponent(link),
        lang: lang,
      })
      .then((response) => {
        console.log(response.data.data);
        setContent(response.data.data);
        if (response.data.status === "error") {
          console.error(response.data.message);
          return;
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [link, lang]);

  return (
    <PageLayer title="Edition">
      <div className="py-10">{/* <SnackBar /> */}</div>
      {isLoading ? (
        <Spinner />
      ) : (
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
            textarea={true}
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
      )}
    </PageLayer>
  );
}
