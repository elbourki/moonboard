import { channels } from "../data/channels";
import { Channel } from "./channel";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { handleErrors } from "../lib/fetch";
import { useEffect } from "react";

export const Channels = (props: { channels: { channel: string }[] }) => {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash?.substring(1));
    if (params.get("access_token"))
      toast.promise(
        fetch("/api/channels/discord", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: params.get("access_token"),
          }),
        })
          .then(handleErrors)
          .then(() => router.replace(router.asPath.split("#")[0]))
          .then(() => router.replace(router.asPath)),
        {
          loading: "Linking Discord...",
          success: <b>Discord linked successfully!</b>,
          error: <b>Could not link Discord.</b>,
        }
      );
  }, [router]);

  const isConnected = (channel: string) => {
    return !!props.channels.find((c) => c.channel === channel);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Channels</h1>
      <p className="text-dark-soft font-normal text-sm mt-1 mb-6">
        Configure how you want to receive your alerts
      </p>
      <div>
        {channels.map((channel) => (
          <Channel
            key={channel.id}
            channel={channel}
            isConnected={isConnected(channel.id)}
          />
        ))}
      </div>
    </div>
  );
};
