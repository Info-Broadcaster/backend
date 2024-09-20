import { useEffect, useState } from "react";
import PageLayer from "./PageLayer";
import InputLabel from "./components/InputLabel";
import { useParams } from "react-router-dom";
import axios from "axios";
import Spinner from "./components/Spinner";
import TagList from "./components/TagList";
import DisplayFlag from "./components/DisplayFlag";

export default function Edition() {
  const { link, lang } = useParams();
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [theme, setTheme] = useState(["Cinéma", "Musique", "Sport"]);
  const [isLoading, setIsLoading] = useState(true);
  const isDebugMode = false;

  useEffect(() => {
    console.log("la langue est ", lang);
    setIsLoading(true);
    if (!isDebugMode) {
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
    } else {
      setContent("Mode debug activé");
      setIsLoading(false);
    }
  }, [link, lang, isDebugMode]);

  return (
    <PageLayer title="Edition">
      <DisplayFlag flagCode={lang} />
      <div className="py-10">{/* <SnackBar /> */}</div>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="flex w-full flex-col gap-5">
          <InputLabel label="Lien" value={link} disabled={true} />
          <InputLabel
            label="Titre de l'article"
            setValue={(e) => setSubject(e.target.value)}
            value={subject}
          />
          <InputLabel
            label="Contenu"
            setValue={(e) => setContent(e.target.value)}
            value={content}
            textarea={true}
          />
          <div className="flex items-center justify-center w-full gap-5">
            <span className="w-1/6">
              <label>Catégories</label>
            </span>
            <TagList tags={theme} />
          </div>
        </div>
      )}
    </PageLayer>
  );
}
