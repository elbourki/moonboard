import ConnectDiscord from "../components/channels/discord";
import ConnectEmail from "../components/channels/email";
import ConnectPhone from "../components/channels/sms";
import ConnectTelegram from "../components/channels/telegram";

export const channels = [
  {
    id: "sms",
    name: "Text messages",
    icon: "/channels/sms.svg",
    component: ConnectPhone,
  },
  {
    id: "email",
    name: "Email",
    icon: "/channels/email.svg",
    component: ConnectEmail,
  },
  {
    id: "telegram",
    name: "Telegram",
    icon: "/channels/telegram.svg",
    component: ConnectTelegram,
  },
  {
    id: "discord",
    name: "Discord",
    icon: "/channels/discord.svg",
    component: ConnectDiscord,
  },
];
