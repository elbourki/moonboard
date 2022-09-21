import { channels } from "../data/channels";
import { Channel } from "./channel";

export const Channels = (props: { channels: { channel: string }[] }) => {
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
        {channels.map((channel, i) => (
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
