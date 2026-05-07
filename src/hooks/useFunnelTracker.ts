import { useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "qfe_session_id";

function getSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id =
        (crypto as any)?.randomUUID?.() ??
        `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

export type FunnelEventType =
  | "form_view"
  | "step_view"
  | "step_complete"
  | "step_back"
  | "field_focus"
  | "submit_success"
  | "submit_error"
  | "abandon";

export function useFunnelTracker() {
  const lastSentRef = useRef<string>("");

  const track = useCallback(
    (
      eventType: FunnelEventType,
      payload: {
        stepIndex: number;
        stepId?: string;
        insuranceType?: string;
        metadata?: Record<string, unknown>;
      }
    ) => {
      // Dedupe rapid duplicate step_view events
      const sig = `${eventType}:${payload.stepIndex}:${payload.stepId ?? ""}`;
      if (eventType === "step_view" && lastSentRef.current === sig) return;
      lastSentRef.current = sig;

      const session_id = getSessionId();
      // Fire-and-forget — never block UI
      void (async () => {
        try {
          await supabase.from("quote_funnel_events").insert([
            {
              session_id,
              insurance_type: payload.insuranceType ?? null,
              step_index: payload.stepIndex,
              step_id: payload.stepId ?? null,
              event_type: eventType,
              metadata: (payload.metadata ?? {}) as Record<string, unknown>,
            },
          ]);
        } catch {
          /* ignore */
        }
      })();
    },
    []
  );

  return { track };
}
