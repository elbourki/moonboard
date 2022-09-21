import { Disclosure, Transition } from "@headlessui/react";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useState } from "react";
import { handleErrors } from "../lib/fetch";
import Image from "next/image";

export const Channel = ({
  channel,
  isConnected,
}: {
  channel: any;
  isConnected: Boolean;
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const unlink = async () => {
    setLoading(true);
    await fetch("/api/channels/unlink", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ channel: channel.id }),
    }).then(handleErrors);
    await router.replace(router.asPath);
    setLoading(false);
  };

  return (
    <Disclosure>
      <Disclosure.Button
        className="bg-dark-kinda border border-dark-almost border-b-0 last:border-b first:rounded-t last:rounded-b gap-4 flex p-4 cursor-pointer"
        as="div"
      >
        <Image alt={channel.name} width={20} height={20} src={channel.icon} />
        <span className="font-semibold text-sm">{channel.name}</span>
        <span
          className={classNames(
            "ml-auto text-xs",
            isConnected ? "text-[#3fcf8e]" : "text-dark-soft"
          )}
        >
          {isConnected ? "• Enabled" : "Disabled"}
        </span>
      </Disclosure.Button>
      <Transition
        className="bg-dark-kinda border border-dark-almost border-b-0 last:border-b first:rounded-t last:rounded-b"
        enter="transition-[max-height] duration-500"
        enterFrom="max-h-0 overflow-hidden"
        enterTo="max-h-[300px] overflow-hidden"
        leave="transition-[max-height] duration-200"
        leaveFrom="max-h-[300px] overflow-hidden"
        leaveTo="max-h-0 overflow-hidden"
      >
        <Disclosure.Panel className="p-4">
          {isConnected ? (
            <>
              <p className="text-sm mb-4">This channel is currently enabled.</p>
              <button
                onClick={unlink}
                disabled={loading}
                className={classNames(
                  "bg-dark-kinda border border-dark-almost rounded font-semibold px-2 py-1 text-sm inline-flex items-center btn h-7.5",
                  {
                    loading,
                  }
                )}
              >
                <svg
                  width="1em"
                  height="1em"
                  className="mr-1"
                  viewBox="0 0 24 24"
                >
                  <g
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  >
                    <path d="M10 14a3.5 3.5 0 0 0 5 0l4-4a3.5 3.5 0 0 0-5-5l-.5.5"></path>
                    <path d="M14 10a3.5 3.5 0 0 0-5 0l-4 4a3.5 3.5 0 0 0 5 5l.5-.5M16 21v-2m3-3h2M3 8h2m3-5v2"></path>
                  </g>
                </svg>
                Disable channel
              </button>
            </>
          ) : (
            <channel.component />
          )}
        </Disclosure.Panel>
      </Transition>
    </Disclosure>
  );
};
