import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import type { MfaStatus } from "@/hooks/useMfaStatus";

const rpc = vi.fn(() => Promise.resolve({ data: true, error: null }));
let auth: { user: { id: string } | null; loading: boolean } = { user: { id: "u1" }, loading: false };
let status: MfaStatus;

vi.mock("@/contexts/AuthContext", () => ({ useAuth: () => auth }));
vi.mock("@/hooks/useMfaStatus", () => ({
  useMfaStatus: () => status,
  mfaRpc: (...args: unknown[]) => rpc(...(args as [])),
}));

import MfaGate, { MfaBanner } from "./MfaGate";

const base = (over: Partial<MfaStatus>): MfaStatus => ({
  loading: false,
  mode: "off",
  currentLevel: "aal1",
  nextLevel: "aal1",
  factors: [],
  verifiedFactors: [],
  refresh: async () => {},
  ...over,
});

const verifiedFactor = { id: "f1", status: "verified" } as unknown as MfaStatus["factors"][number];

function Where() {
  return <div data-testid="where">{useLocation().pathname}</div>;
}

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/admin/*"
          element={
            <MfaGate>
              <MfaBanner />
              <div>CRM</div>
              <Where />
            </MfaGate>
          }
        />
        <Route path="/auth/mfa" element={<div>PAGE CODE</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("MfaGate (phase 1)", () => {
  beforeEach(() => {
    rpc.mockClear();
    sessionStorage.clear();
    auth = { user: { id: "u1" }, loading: false };
  });

  it("mode off, sans facteur : accès normal, ni bandeau ni journalisation", () => {
    status = base({ mode: "off" });
    renderAt("/admin");
    expect(screen.getByText("CRM")).toBeInTheDocument();
    expect(screen.queryByText(/Protégez l'accès au CRM/)).toBeNull();
    expect(rpc).not.toHaveBeenCalled();
  });

  it("compte avec facteur vérifié en aal1 : renvoie vers /auth/mfa, même en mode off", () => {
    status = base({ mode: "off", nextLevel: "aal2", factors: [verifiedFactor], verifiedFactors: [verifiedFactor] });
    renderAt("/admin");
    expect(screen.getByText("PAGE CODE")).toBeInTheDocument();
  });

  it("compte en aal2 : accès normal", () => {
    status = base({ mode: "enforce", currentLevel: "aal2", nextLevel: "aal2", factors: [verifiedFactor], verifiedFactors: [verifiedFactor] });
    renderAt("/admin");
    expect(screen.getByText("CRM")).toBeInTheDocument();
  });

  it("mode warn, sans facteur : bandeau et une seule journalisation par session", () => {
    status = base({ mode: "warn" });
    const { unmount } = renderAt("/admin/contacts");
    expect(screen.getByText(/Protégez l'accès au CRM/)).toBeInTheDocument();
    expect(rpc).toHaveBeenCalledWith("log_mfa_access", { p_path: "/admin/contacts" });
    unmount();
    renderAt("/admin");
    expect(rpc).toHaveBeenCalledTimes(1);
  });

  it("mode enforce, sans facteur : renvoie vers /admin/securite", () => {
    status = base({ mode: "enforce" });
    renderAt("/admin/contacts");
    expect(screen.getByTestId("where")).toHaveTextContent("/admin/securite");
    expect(screen.queryByText(/Protégez l'accès au CRM/)).toBeNull();
  });

  it("non connecté : laisse la page gérer la redirection vers /auth", () => {
    auth = { user: null, loading: false };
    status = base({ mode: "enforce" });
    renderAt("/admin");
    expect(screen.getByText("CRM")).toBeInTheDocument();
    expect(rpc).not.toHaveBeenCalled();
  });
});
