import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { handleErrors } from "../../lib/fetch";

declare global {
  interface Window {
    onTelegramAuth: (d: any) => void;
  }
}

export default function ConnectTelegram() {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    window.onTelegramAuth = (data) => {
      toast.promise(
        fetch("/api/channels/telegram", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then(handleErrors)
          .then(() => router.replace(router.asPath)),
        {
          loading: "Linking Telegram...",
          success: <b>Telegram linked successfully!</b>,
          error: <b>Could not link Telegram.</b>,
        }
      );
    };
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?19";
    script.async = true;
    script.setAttribute("data-telegram-login", "moonboard_bot");
    script.setAttribute("data-size", "medium");
    script.setAttribute("data-radius", "4");
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    ref.current!.appendChild(script);
  }, [router]);

  return (
    <>
      <p className="text-sm mb-4">
        Log in with your account to start receiving instant alerts via Telegram:
      </p>
      <div ref={ref}></div>
    </>
  );
}
