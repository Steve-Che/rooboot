"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const result = await signIn("credentials", {
      phone,
      password,
      redirect: false,
      callbackUrl,
    });

    if (!result || result.error) {
      setError("登录失败，请检查手机号与密码。");
      setSubmitting(false);
      return;
    }

    router.push((result.url ?? callbackUrl) as any);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, maxWidth: 360 }}>
      <label>
        手机号
        <input
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          required
          style={{ display: "block", width: "100%", marginTop: 4, padding: 8 }}
        />
      </label>

      <label>
        密码
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          style={{ display: "block", width: "100%", marginTop: 4, padding: 8 }}
        />
      </label>

      {error ? <p style={{ color: "#dc2626", margin: 0 }}>{error}</p> : null}

      <button type="submit" disabled={submitting} style={{ padding: 10 }}>
        {submitting ? "登录中..." : "登录"}
      </button>
    </form>
  );
}
