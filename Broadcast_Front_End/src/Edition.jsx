import { useState } from "react";
import PageLayer from "./PageLayer";
import InputLabel from "./components/InputLabel";

export default function Edition() {
  const [link, setLink] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("");
  const [theme, setTheme] = useState("");

  return (
    <PageLayer title="Edition">
      <div className="flex w-full flex-col gap-5">
        <InputLabel
          label="Lien"
          setValue={(e) => setLink(e.target.value)}
          value={link}
        />
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
