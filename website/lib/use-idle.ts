import { useEffect, useState } from "react";
import { whenIdle } from "./when-idle.ts";

export function useIdle(timeout?: number) {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    return whenIdle(() => setIdle(true), timeout);
  }, [timeout]);

  return idle;
}
