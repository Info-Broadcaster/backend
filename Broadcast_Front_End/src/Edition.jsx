import { useEffect, useState } from "react";
import PageLayer from "./PageLayer";
import InputLabel from "./components/InputLabel";
import { useParams } from "react-router-dom";
import axios from "axios";
import TagList from "./components/TagList";
import DisplayFlag from "./components/DisplayFlag";
import AdvancedSpinner from "./components/AdvancedSpinner";

export default function Edition() {
  const { link, lang } = useParams();
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [theme, setTheme] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [isError, setIsError] = useState(false);
  const isDebugMode = true;

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
          setContent(response.data.data.summarized);
          setSubject(response.data.data.title);
          setTheme(response.data.data.themes);
          if (response.data.status === "error") {
            // setIsError(true);
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
      <div className="py-10">{/* <SnackBar /> */}</div>
      {isLoading ? (
        <div className="flex justify-center items-center flex-col gap-4 ">
          <AdvancedSpinner />
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          <span>Génération de l'article en cours...</span>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-5">
          <DisplayFlag flagCode={lang} />
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
