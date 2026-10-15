const form = document.getElementById("redeem-form");
const message = document.getElementById("message");
const submit = document.getElementById("submit");
let receipt = null;
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  submit.disabled = true;
  message.textContent = "Checking your code… / Comprobando el código…";
  try {
    const result = await fetch(
      "https://bpxwzslftjzzokgmrrzj.supabase.co/functions/v1/redeem-sopbuilder",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        body: JSON.stringify({
          action: "redeem",
          email: document.getElementById("email").value.trim(),
          code: document.getElementById("code").value.trim(),
          acceptTerms: document.getElementById("terms").checked,
        }),
        signal: AbortSignal.timeout(20000),
      },
    );
    const body = await result.json();
    if (!result.ok) {
      message.textContent =
        result.status === 429
          ? "Too many attempts. Try again in 15 minutes. / Demasiados intentos. Espera 15 minutos."
          : "Could not redeem. Check code and email, or contact support. / No se pudo canjear. Revisa el código y correo, o contacta con soporte.";
      return;
    }
    if (
      typeof body.receipt?.payload !== "string" ||
      typeof body.receipt?.signature !== "string"
    )
      throw new Error("Invalid response");
    receipt = body.receipt;
    document.getElementById("code").value = "";
    form.hidden = true;
    document.getElementById("success").hidden = false;
    message.textContent =
      "License ready. Save your file below. / Licencia lista. Guarda tu archivo abajo.";
    message.classList.add("success");
  } catch {
    message.textContent =
      "Connection unavailable. Retry with the same email and code: a successful redemption is recoverable. / Conexión no disponible. Reintenta con el mismo correo y código: el canje se puede recuperar.";
  } finally {
    submit.disabled = false;
  }
});
document.getElementById("save-license").addEventListener("click", () => {
  if (!receipt) return;
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(receipt, null, 2)], { type: "application/json" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "SOPBuilder-personal.soplicense";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
