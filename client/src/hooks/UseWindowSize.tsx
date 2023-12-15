import { useEffect, useState } from "react";

function useWindowSize() {
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    function handleResize() {
      setHeight(window.innerHeight);
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return { height, width };
}

export default useWindowSize;
