import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { handleErrors } from "../../lib/fetch";
import * as PusherPushNotifications from "@pusher/push-notifications-web";
import { BellIcon } from "@heroicons/react/24/outline";

export default function ConnectPush() {
  const router = useRouter();

  const enable = () => {
    const beamsClient = new PusherPushNotifications.Client({
      instanceId: process.env.NEXT_PUBLIC_PUSHER_INSTANCE!,
    });
    const beamsTokenProvider = new PusherPushNotifications.TokenProvider({
      url: "/api/channels/push",
    });
    toast.promise(
      beamsClient
        .start()
        .then(() =>
          fetch("/api/channels/push", {
            method: "POST",
          })
            .then(handleErrors)
            .then((r) => r.json())
        )
        .then((r) => beamsClient.setUserId(r.uid, beamsTokenProvider))
        .then(() => router.replace(router.asPath)),
      {
        loading: "Enabling push notifications...",
        success: <b>Notifications enabled successfully!</b>,
        error: <b>Could not enable notifications.</b>,
      }
    );
  };

  return (
    <>
      <p className="text-sm mb-2">
        Allow our application to send you push notifications to enable the
        integration
      </p>
      <div className="text-dark-soft text-sm mb-4">
        If a permission prompt does not appear, you may have to enable the
        notification permission in the top left of your address bar and refresh.
      </div>
      <button
        className="bg-dark-kinda border border-dark-almost rounded font-semibold px-2 py-1 text-sm inline-flex items-center gap-1 btn"
        onClick={enable}
      >
        <BellIcon width="1em" height="1em" />
        Enable push notifications
      </button>
    </>
  );
}
