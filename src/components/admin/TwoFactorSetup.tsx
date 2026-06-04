"use client";
import { useState, useEffect } from "react";
import QRCode from "qrcode";

type Stage = "loading" | "disabled" | "enabling" | "verifying" | "enabled" | "showing-backup-codes";

export default function TwoFactorSetup() {
  const [stage, setStage]               = useState<Stage>("loading");
  const [secret, setSecret]             = useState("");
  const [qrDataUrl, setQrDataUrl]       = useState("");
  const [provisioningURI, setURI]       = useState("");
  const [code, setCode]                 = useState("");
  const [error, setError]               = useState("");
  const [loading, setLoading]           = useState(false);
  const [backupCodes, setBackupCodes]   = useState<string[]>([]);
  const [backupCount, setBackupCount]   = useState(0);
  const [disablePassword, setDisPwd]    = useState("");

  // Fetch current 2FA status
  useEffect(() => {
    fetch("/api/admin/auth", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "status-2fa" }),
    }).then(r => r.json()).then(d => {
      setBackupCount(d.backupCodesCount || 0);
      setStage(d.enabled ? "enabled" : "disabled");
    }).catch(() => setStage("disabled"));
  }, []);

  async function beginSetup() {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "begin-2fa" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSecret(data.secret);
      setURI(data.uri);
      const qr = await QRCode.toDataURL(data.uri, { width: 280, margin: 2 });
      setQrDataUrl(qr);
      setStage("verifying");
    } catch (e: any) {
      setError(e?.message || "Could not begin setup");
    }
    setLoading(false);
  }

  async function confirmAndEnable() {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "enable-2fa", secret, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBackupCodes(data.backupCodes || []);
      setStage("showing-backup-codes");
    } catch (e: any) {
      setError(e?.message || "Code didn't match");
    }
    setLoading(false);
  }

  async function disable2FA() {
    if (!disablePassword) { setError("Enter your admin password to confirm"); return; }
    if (!confirm("Disable 2FA? Your account will be less secure.")) return;
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "disable-2fa", password: disablePassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStage("disabled");
      setDisPwd(""); setCode(""); setSecret("");
    } catch (e: any) { setError(e?.message || "Could not disable"); }
    setLoading(false);
  }

  function copyAll() {
    navigator.clipboard.writeText(backupCodes.join("\n")).catch(() => {});
    alert("Backup codes copied to clipboard. Paste them somewhere safe!");
  }

  // ═════ STAGE: Loading ═════
  if (stage === "loading") {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center text-gray-500">
        Loading 2FA status…
      </div>
    );
  }

  // ═════ STAGE: Enabled — show option to disable ═════
  if (stage === "enabled") {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-green-900/50 flex items-center justify-center text-2xl">
            🔐
          </div>
          <div>
            <h3 className="text-white font-bold">2FA is enabled</h3>
            <p className="text-xs text-gray-500">Your account is protected with two-factor authentication.</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 text-sm">
          <p className="text-gray-300">
            <strong className="text-green-400">{backupCount}</strong> backup codes remaining.
            {backupCount < 3 && (
              <span className="text-yellow-400"> ⚠ Running low — regenerate by disabling and re-enabling 2FA.</span>
            )}
          </p>
        </div>

        <details>
          <summary className="cursor-pointer text-sm text-red-400 hover:underline">⚠ Disable 2FA</summary>
          <div className="mt-3 space-y-3 bg-red-950/30 border border-red-900/50 rounded-lg p-4">
            <p className="text-xs text-red-300">
              Disabling 2FA means anyone who knows your password can log in.
              Only do this if you've lost access to your authenticator app.
            </p>
            <input
              type="password" value={disablePassword} onChange={e => setDisPwd(e.target.value)}
              placeholder="Enter your admin password to confirm"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm"
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button onClick={disable2FA} disabled={loading || !disablePassword}
              className="w-full py-2 rounded-lg bg-red-900 hover:bg-red-800 text-white font-semibold text-sm disabled:opacity-50">
              {loading ? "Disabling..." : "Disable 2FA"}
            </button>
          </div>
        </details>
      </div>
    );
  }

  // ═════ STAGE: Showing backup codes (one-time) ═════
  if (stage === "showing-backup-codes") {
    return (
      <div className="bg-gray-900 border-2 border-green-700 rounded-xl p-6 space-y-4">
        <div className="text-center">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-white font-bold text-lg">2FA Enabled!</h3>
          <p className="text-sm text-gray-400 mt-1">Save your backup codes — you'll need them if you lose your phone.</p>
        </div>

        <div className="bg-black/50 border border-yellow-700 rounded-lg p-4">
          <p className="text-xs text-yellow-400 font-bold uppercase tracking-wider mb-2">⚠ Show this only once</p>
          <p className="text-xs text-gray-400 mb-3">
            Each code works once. Store them in a password manager or print and lock away.
          </p>
          <div className="grid grid-cols-2 gap-2 font-mono text-sm">
            {backupCodes.map(c => (
              <div key={c} className="bg-gray-800 px-3 py-2 rounded text-center text-white tracking-wider">
                {c}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={copyAll}
            className="flex-1 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-semibold text-sm">
            📋 Copy all codes
          </button>
          <button onClick={() => { setStage("enabled"); setBackupCount(backupCodes.length); }}
            className="flex-1 py-2.5 rounded-lg text-white font-semibold text-sm"
            style={{ background: "#3AAFE5" }}>
            I've saved them ✓
          </button>
        </div>
      </div>
    );
  }

  // ═════ STAGE: Verifying — show QR + code input ═════
  if (stage === "verifying") {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
        <div>
          <h3 className="text-white font-bold mb-1">Step 1 — Scan QR code</h3>
          <p className="text-sm text-gray-400 mb-4">
            Open Google Authenticator, 1Password, Authy, or your password manager and scan this code.
          </p>
          <div className="flex justify-center bg-white rounded-lg p-4">
            {qrDataUrl && <img src={qrDataUrl} alt="2FA QR code" width={280} height={280} />}
          </div>
          <details className="mt-3 text-xs text-gray-500">
            <summary className="cursor-pointer">Can't scan? Enter the secret manually</summary>
            <code className="block mt-2 bg-gray-800 px-3 py-2 rounded text-gray-300 font-mono break-all">
              {secret}
            </code>
          </details>
        </div>

        <div className="border-t border-gray-800 pt-5">
          <h3 className="text-white font-bold mb-1">Step 2 — Enter the 6-digit code</h3>
          <p className="text-sm text-gray-400 mb-3">Your app shows a fresh code every 30 seconds.</p>
          <input
            type="text" value={code} onChange={e => setCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
            placeholder="000000" autoFocus inputMode="numeric"
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-center text-2xl tracking-[0.5em] font-mono"
          />
          {error && <p className="text-xs text-red-400 mt-2">{error}</p>}

          <div className="flex gap-2 mt-4">
            <button onClick={() => { setStage("disabled"); setError(""); setCode(""); }}
              className="flex-1 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold text-sm">
              Cancel
            </button>
            <button onClick={confirmAndEnable} disabled={loading || code.length !== 6}
              className="flex-1 py-2.5 rounded-lg text-white font-semibold text-sm disabled:opacity-50"
              style={{ background: "#3AAFE5" }}>
              {loading ? "Verifying…" : "Enable 2FA →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═════ STAGE: Disabled — option to enable ═════
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-yellow-900/50 flex items-center justify-center text-2xl">
          🔓
        </div>
        <div>
          <h3 className="text-white font-bold">2FA is not enabled</h3>
          <p className="text-xs text-gray-500">Add an extra layer of security with two-factor authentication.</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 space-y-2 text-sm text-gray-400">
        <p><strong className="text-white">How it works:</strong></p>
        <ul className="list-disc pl-5 space-y-1 text-xs">
          <li>You'll scan a QR code with Google Authenticator, 1Password, Authy, or any TOTP app</li>
          <li>Next login: enter password + 6-digit code from your app</li>
          <li>You get 10 backup codes in case you lose your phone</li>
          <li>Takes 60 seconds to set up</li>
        </ul>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <button onClick={beginSetup} disabled={loading}
        className="w-full py-3 rounded-lg text-white font-semibold transition-opacity disabled:opacity-60"
        style={{ background: "#3AAFE5" }}>
        {loading ? "Starting…" : "🔐 Enable Two-Factor Authentication →"}
      </button>
    </div>
  );
}
