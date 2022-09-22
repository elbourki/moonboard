import { ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { channels } from "../data/channels";
import { networks } from "../data/networks";
import { topics } from "../data/topics";
import { handleErrors } from "../lib/fetch";
import { Subscription as ST } from "../lib/supabase";

export const Subscription = ({ subscription }: { subscription: ST }) => {
  const router = useRouter();

  const network = networks.find((e) => subscription.network === e.id);
  const topic = topics.find((e) => subscription.topic === e.id);
  if (!network || !topic) return null;

  const unsubscribe = async () => {
    await toast.promise(
      fetch("/api/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: subscription.id }),
      })
        .then(handleErrors)
        .then(() => router.replace(router.asPath)),
      {
        loading: "Unsubscribing...",
        success: <b>Unsubscribed successfully!</b>,
        error: <b>Could not unsubscribe.</b>,
      }
    );
  };

  return (
    <div className="bg-dark-kinda border border-dark-almost rounded flex flex-col justify-between p-3 select-none min-h-[160px]">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Image
            key={network.id}
            alt={network.name}
            width={25}
            height={25}
            src={network.logo}
          />
          <div>
            <h4 className="text-sm font-semibold">{network.name}</h4>
          </div>
          <button className="ml-auto" onClick={unsubscribe}>
            <ArchiveBoxXMarkIcon width="1em" height="1em" />
          </button>
        </div>
        <p className="text-sm text-dark-soft">{topic.name}</p>
      </div>
      <div className="flex gap-2">
        <small className="mr-auto text-dark-soft">
          {subscription.sent} alerts sent
        </small>
        {channels
          .filter((c) => subscription.channels.includes(c.id))
          .map((channel) => (
            <Image
              key={channel.id}
              alt={channel.name}
              width={15}
              height={15}
              src={channel.icon}
            />
          ))}
      </div>
    </div>
  );
};
