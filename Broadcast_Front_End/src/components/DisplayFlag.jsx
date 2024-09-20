import { useEffect, useState } from "react";

export default function DisplayFlag({ flagCode }) {
  const [flag, setFlag] = useState("");
  useEffect(() => {
    if (flagCode === "fr") {
      setFlag("/france.png");
    } else if (flagCode === "en") {
      setFlag("/uk.png");
    }
  }, [flagCode]);

  return (
    <div className="flex w-full  justify-center">
      <img src={flag} alt="flag" className="h-60" />
    </div>
  );
}
