const GIS_SRC = "https://accounts.google.com/gsi/client";

let scriptPromise: Promise<void> | null = null;

/** Lazily load the Google Identity Services script once. */
export function loadGoogleScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = GIS_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Identity Services"));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

/**
 * Initialise GIS and render the official Google button into `container`.
 * Calls `onCredential` with the returned Google ID token (JWT).
 */
export async function renderGoogleButton(
  container: HTMLElement,
  onCredential: (idToken: string) => void
): Promise<void> {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error("VITE_GOOGLE_CLIENT_ID is not set");
  }
  await loadGoogleScript();
  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: (response: { credential: string }) => onCredential(response.credential),
  });
  window.google.accounts.id.renderButton(container, {
    theme: "filled_black",
    size: "large",
    shape: "pill",
    text: "signin_with",
    width: 280,
  });
}
