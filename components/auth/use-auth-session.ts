"use client";

import { useEffect, useState } from "react";
import { AuthSession } from "@/types/domain";

type SessionResponse = {
  data: AuthSession | null;
};

let cachedSession: AuthSession | null | undefined;
let sessionRequest: Promise<AuthSession | null> | null = null;
const listeners = new Set<(session: AuthSession | null) => void>();

function publish(session: AuthSession | null) {
  cachedSession = session;

  for (const listener of listeners) {
    listener(session);
  }
}

async function loadSession(signal?: AbortSignal) {
  if (cachedSession !== undefined) {
    return cachedSession;
  }

  if (!sessionRequest) {
    sessionRequest = fetch("/api/auth/session", {
      credentials: "include",
      signal
    })
      .then(async (response) => {
        if (!response.ok) {
          return null;
        }

        const payload = (await response.json()) as SessionResponse;
        return payload.data;
      })
      .catch(() => null)
      .then((session) => {
        publish(session);
        return session;
      })
      .finally(() => {
        sessionRequest = null;
      });
  }

  return sessionRequest;
}

export function useAuthSession() {
  const [session, setSession] = useState<AuthSession | null>(cachedSession ?? null);
  const [loading, setLoading] = useState(cachedSession === undefined);

  useEffect(() => {
    const controller = new AbortController();
    listeners.add(setSession);

    if (cachedSession === undefined) {
      void loadSession(controller.signal).finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });
    }

    return () => {
      controller.abort();
      listeners.delete(setSession);
    };
  }, []);

  return { session, loading };
}
