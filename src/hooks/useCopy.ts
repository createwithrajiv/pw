import { useCallback, useEffect, useRef, useState } from 'react';
import { copyText } from '@/utils/clipboard';

/** Copy-to-clipboard with a transient `copied` flag that auto-resets. */
export function useCopy(resetMs = 2000) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const copy = useCallback(
    async (text: string) => {
      const ok = await copyText(text);
      if (ok) {
        setCopied(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), resetMs);
      }
      return ok;
    },
    [resetMs],
  );

  useEffect(() => () => clearTimeout(timer.current), []);

  return { copied, copy };
}
