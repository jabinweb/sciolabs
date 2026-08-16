"use client";

import { useState } from "react";
import { Input } from "@/components/crm/ui/input";
import { Label } from "@/components/crm/ui/label";
import { FormSelect } from "@/components/crm/form-select";

const PRESETS: Record<string, { host: string; port: string; secure: string }> = {
  gmail: { host: "smtp.gmail.com", port: "587", secure: "0" },
  outlook: { host: "smtp.office365.com", port: "587", secure: "0" },
  custom: { host: "", port: "587", secure: "0" },
};

function matchPreset(host: string, port: string) {
  if (host === "smtp.gmail.com") return "gmail";
  if (host === "smtp.office365.com" || host === "smtp.office.com") return "outlook";
  return host ? "custom" : "gmail";
}

export function SmtpFields({
  host,
  port,
  user,
  passPlaceholder,
  secure,
}: {
  host: string;
  port: string;
  user: string;
  passPlaceholder: string;
  secure: string;
}) {
  const initialPreset = matchPreset(host, port);
  const initial = host
    ? { host, port: port || "587", secure: secure === "1" || secure === "true" || port === "465" ? "1" : "0" }
    : PRESETS[initialPreset] ?? PRESETS.gmail;
  const [preset, setPreset] = useState(initialPreset);
  const [hostValue, setHostValue] = useState(initial.host);
  const [portValue, setPortValue] = useState(initial.port);
  const [secureValue, setSecureValue] = useState(initial.secure);

  function applyPreset(next: string) {
    setPreset(next);
    const presetValues = PRESETS[next] ?? PRESETS.custom;
    if (next !== "custom") {
      setHostValue(presetValues.host);
      setPortValue(presetValues.port);
      setSecureValue(presetValues.secure);
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-1.5 sm:col-span-2">
        <Label>Email provider</Label>
        <FormSelect
          value={preset}
          onValueChange={applyPreset}
          options={[
            { value: "gmail", label: "Gmail / Google Workspace" },
            { value: "outlook", label: "Outlook / Microsoft 365" },
            { value: "custom", label: "Custom SMTP" },
          ]}
        />
        <p className="text-xs text-muted-foreground">
          Gmail needs an App Password (Google Account → Security). Outlook uses the mailbox password or an app password.
        </p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="smtp_host">SMTP host</Label>
        <Input
          id="smtp_host"
          name="smtp_host"
          value={hostValue}
          onChange={(event) => {
            setPreset("custom");
            setHostValue(event.target.value);
          }}
          placeholder="smtp.gmail.com"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="smtp_port">Port</Label>
        <Input
          id="smtp_port"
          name="smtp_port"
          inputMode="numeric"
          value={portValue}
          onChange={(event) => {
            const next = event.target.value;
            setPortValue(next);
            if (next === "465") setSecureValue("1");
            if (next === "587") setSecureValue("0");
          }}
          placeholder="587"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="smtp_user">Username</Label>
        <Input
          id="smtp_user"
          name="smtp_user"
          autoComplete="off"
          defaultValue={user}
          placeholder="hello@discoverybible.com"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="smtp_pass">Password</Label>
        <Input
          id="smtp_pass"
          name="smtp_pass"
          type="password"
          autoComplete="new-password"
          placeholder={passPlaceholder || "App password or SMTP password"}
        />
        <p className="text-xs text-muted-foreground">Leave blank to keep the current password.</p>
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label>Encryption</Label>
        <input type="hidden" name="smtp_secure" value={secureValue} />
        <FormSelect
          value={secureValue}
          onValueChange={setSecureValue}
          options={[
            { value: "0", label: "STARTTLS (port 587 — usual)" },
            { value: "1", label: "SSL / TLS (port 465)" },
          ]}
        />
      </div>
    </div>
  );
}
