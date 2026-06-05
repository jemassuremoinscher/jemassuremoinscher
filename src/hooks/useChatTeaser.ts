import { useState, useEffect } from "react";

const STORAGE_KEY = "chat-opened";
const OPEN_EVENTS = ["open-chatbot", "chatbot-opened"] as const;

export interface UseChatTeaserOptions {
  /** Delay (ms) before showing the teaser. Default 20s. */
  showAfterMs?: number;
  /** How long the teaser stays visible (ms). Default 8s. */
  visibleForMs?: number;
  /** Pause between cycles (ms). Default 30s. */
  hiddenBetweenMs?: number;
}

/**
 * Returns true when the chat teaser ("Nouveau message") should be shown.
 * Stops permanently for the session once an open-chatbot event fires
 * (or once sessionStorage already records that the chat has been opened).
 */
export function useChatTeaser({
  showAfterMs = 20_000,
  visibleForMs = 8_000,
  hiddenBetweenMs = 30_000,
}: UseChatTeaserOptions = {}): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(STORAGE_KEY) === "1") return;

    let showTimer: number;
    let hideTimer: number;
    let cycleTimer: number;
    let stopped = false;

    const cycle = () => {
      showTimer = window.setTimeout(() => {
        if (stopped || window.sessionStorage.getItem(STORAGE_KEY) === "1") return;
        setVisible(true);
        hideTimer = window.setTimeout(() => {
          setVisible(false);
          cycleTimer = window.setTimeout(cycle, hiddenBetweenMs);
        }, visibleForMs);
      }, showAfterMs);
    };

    cycle();

    const onOpen = () => {
      stopped = true;
      window.sessionStorage.setItem(STORAGE_KEY, "1");
      setVisible(false);
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
      window.clearTimeout(cycleTimer);
    };

    OPEN_EVENTS.forEach((evt) => window.addEventListener(evt, onOpen));

    return () => {
      stopped = true;
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
      window.clearTimeout(cycleTimer);
      OPEN_EVENTS.forEach((evt) => window.removeEventListener(evt, onOpen));
    };
  }, [showAfterMs, visibleForMs, hiddenBetweenMs]);

  return visible;
}
