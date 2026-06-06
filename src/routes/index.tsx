import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { refreshCookie, bypassAccount } from "@/lib/nexusx.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NexusX — Roblox Refresher & Bypasser" },
      {
        name: "description",
        content:
          "NexusX provides a Roblox cookie refresher and account bypasser in one yellow-themed dashboard.",
      },
      { property: "og:title", content: "NexusX" },
      {
        property: "og:description",
        content: "Roblox cookie refresher & account bypasser.",
      },
    ],
  }),
  component: NexusX,
});

type RefreshVersion = "v1" | "v2";
type BypassVersion = "V1" | "V2";

function NexusX() {
  return (
    <div className="min-h-screen bg-[oklch(0.97_0.06_95)] text-[oklch(0.2_0.03_80)]">
      <header className="flex items-center justify-between border-b-2 border-[oklch(0.55_0.18_85)] bg-[oklch(0.92_0.12_92)] px-6 py-4">
        <h1 className="text-3xl font-black tracking-tight">
          Nexus<span className="text-[oklch(0.55_0.18_85)]">X</span>
        </h1>
        <a
          href="https://discord.gg/bkA4mw8dJK"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-[oklch(0.25_0.05_85)] px-5 py-2.5 font-semibold text-[oklch(0.95_0.12_92)] shadow-md transition hover:bg-[oklch(0.35_0.07_85)]"
        >
          Our Discord
        </a>
      </header>

      <main className="grid grid-cols-1 gap-0 md:grid-cols-2">
        <RefresherPanel />
        <BypasserPanel />
      </main>

      <footer className="border-t-2 border-[oklch(0.55_0.18_85)] bg-[oklch(0.92_0.12_92)] py-4 text-center text-sm font-medium">
        NexusX © {new Date().getFullYear()}
      </footer>
    </div>
  );
}

function RefresherPanel() {
  const fn = useServerFn(refreshCookie);
  const [cookie, setCookie] = useState("");
  const [version, setVersion] = useState<RefreshVersion>("v2");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!cookie.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const r = await fn({ data: { cookie: cookie.trim(), version } });
      setResult(r.result || "(empty response)");
    } catch (e: any) {
      setResult(`Error: ${e?.message ?? "unknown"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="border-b-2 border-[oklch(0.55_0.18_85)] bg-[oklch(0.97_0.08_93)] p-8 md:border-b-0 md:border-r-2">
      <h2 className="mb-1 text-2xl font-bold">NexusX Refresher</h2>
      <p className="mb-5 text-sm opacity-80">Bypass IP locks on Roblox cookies.</p>

      <div className="mb-4 flex gap-2">
        {(["v2", "v1"] as RefreshVersion[]).map((v) => (
          <button
            key={v}
            onClick={() => setVersion(v)}
            className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
              version === v
                ? "bg-[oklch(0.55_0.18_85)] text-[oklch(0.15_0.02_80)]"
                : "bg-[oklch(0.88_0.06_92)] hover:bg-[oklch(0.82_0.1_92)]"
            }`}
          >
            {v === "v2" ? "Bypass V2 (No session kick)" : "Bypass V1"}
          </button>
        ))}
      </div>

      <textarea
        value={cookie}
        onChange={(e) => setCookie(e.target.value)}
        placeholder=".ROBLOSECURITY cookie here"
        className="mb-3 h-32 w-full resize-none rounded-lg border-2 border-[oklch(0.7_0.1_88)] bg-white p-3 font-mono text-xs outline-none focus:border-[oklch(0.55_0.18_85)]"
      />

      <button
        onClick={submit}
        disabled={loading}
        className="w-full rounded-lg bg-[oklch(0.55_0.18_85)] py-3 font-bold text-[oklch(0.15_0.02_80)] shadow transition hover:bg-[oklch(0.62_0.2_85)] disabled:opacity-60"
      >
        {loading ? "Refreshing..." : "Refresh Cookie"}
      </button>

      {result && (
        <div className="mt-4">
          <div className="mb-1 text-sm font-semibold">Result:</div>
          <textarea
            readOnly
            value={result}
            className="h-40 w-full resize-none rounded-lg border-2 border-[oklch(0.7_0.1_88)] bg-white p-3 font-mono text-xs"
          />
          <button
            onClick={() => navigator.clipboard.writeText(result)}
            className="mt-2 rounded-md bg-[oklch(0.25_0.05_85)] px-4 py-1.5 text-sm font-semibold text-[oklch(0.95_0.12_92)] hover:bg-[oklch(0.35_0.07_85)]"
          >
            Copy
          </button>
        </div>
      )}
    </section>
  );
}

function BypasserPanel() {
  const fn = useServerFn(bypassAccount);
  const [cookie, setCookie] = useState("");
  const [version, setVersion] = useState<BypassVersion>("V1");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!cookie.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const r = await fn({ data: { cookie: cookie.trim(), version } });
      setResult(JSON.stringify(r.data, null, 2));
    } catch (e: any) {
      setResult(`Error: ${e?.message ?? "unknown"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[oklch(0.95_0.1_93)] p-8">
      <h2 className="mb-1 text-2xl font-bold">NexusX Bypasser</h2>
      <p className="mb-5 text-sm opacity-80">Account bypasser via rblxbypasser.</p>

      <div className="mb-4 flex gap-2">
        {(["V1", "V2"] as BypassVersion[]).map((v) => (
          <button
            key={v}
            onClick={() => setVersion(v)}
            className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
              version === v
                ? "bg-[oklch(0.55_0.18_85)] text-[oklch(0.15_0.02_80)]"
                : "bg-[oklch(0.88_0.06_92)] hover:bg-[oklch(0.82_0.1_92)]"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      <textarea
        value={cookie}
        onChange={(e) => setCookie(e.target.value)}
        placeholder=".ROBLOSECURITY cookie here"
        className="mb-3 h-32 w-full resize-none rounded-lg border-2 border-[oklch(0.7_0.1_88)] bg-white p-3 font-mono text-xs outline-none focus:border-[oklch(0.55_0.18_85)]"
      />

      <button
        onClick={submit}
        disabled={loading}
        className="w-full rounded-lg bg-[oklch(0.55_0.18_85)] py-3 font-bold text-[oklch(0.15_0.02_80)] shadow transition hover:bg-[oklch(0.62_0.2_85)] disabled:opacity-60"
      >
        {loading ? "Bypassing..." : "Initiate Bypass"}
      </button>

      {result && (
        <div className="mt-4">
          <div className="mb-1 text-sm font-semibold">Result:</div>
          <textarea
            readOnly
            value={result}
            className="h-40 w-full resize-none rounded-lg border-2 border-[oklch(0.7_0.1_88)] bg-white p-3 font-mono text-xs"
          />
          <button
            onClick={() => navigator.clipboard.writeText(result)}
            className="mt-2 rounded-md bg-[oklch(0.25_0.05_85)] px-4 py-1.5 text-sm font-semibold text-[oklch(0.95_0.12_92)] hover:bg-[oklch(0.35_0.07_85)]"
          >
            Copy
          </button>
        </div>
      )}
    </section>
  );
}
