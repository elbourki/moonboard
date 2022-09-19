import classNames from "classnames";
import type { NextPage } from "next";
import Image from "next/image";
import { withSessionSsr } from "../lib/iron";

const Channels = () => {
  const channels = [
    {
      name: "Text messages",
      icon: "/channels/sms.svg",
    },
    {
      name: "Email",
      icon: "/channels/email.svg",
    },
    {
      name: "Telegram",
      icon: "/channels/telegram.svg",
    },
    {
      name: "Discord",
      icon: "/channels/discord.svg",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">Channels</h1>
      <p className="text-dark-soft font-normal text-base mt-1 mb-6">
        Configure how you want to receive your alerts
      </p>
      <div>
        {channels.map((channel, i) => (
          <div
            className="bg-dark-kinda border border-dark-almost border-b-0 last:border-b gap-4 flex p-4 first:rounded-t last:rounded-b"
            key={i}
          >
            <Image
              alt={channel.name}
              width={20}
              height={20}
              src={channel.icon}
            />
            <span className="font-semibold text-sm">{channel.name}</span>
            <span
              className={classNames("ml-auto text-xs", {
                "text-[#3fcf8e]": true,
                "text-dark-soft": false,
              })}
            >
              • Connected
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Subscriptions = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">Subscriptions</h1>
      <p className="text-dark-soft font-normal text-base mt-1 mb-6">
        Choose which events you want to be notified about
      </p>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-dark-kinda border border-dark-almost rounded min-h-[170px] flex cursor-pointer p-4">
          <div className="flex gap-2 items-center mt-auto opacity-60">
            <svg width="1em" height="1em" viewBox="0 0 16 16">
              <path
                fill="currentColor"
                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"
              ></path>
            </svg>
            <span className="text-sm">New Subscription</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard: NextPage = () => {
  return (
    <>
      <Channels />
      <Subscriptions />
    </>
  );
};

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user || null;

    if (!user)
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };

    return { props: { user } };
  }
);

export default Dashboard;
