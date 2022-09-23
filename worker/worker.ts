import { ApiPromise, WsProvider } from "@polkadot/api";
import {
  EventRecord,
  FunctionMetadataLatest,
} from "@polkadot/types/interfaces";
import { Block, Channel, Subscription, supabase } from "../lib/supabase";
import type { Vec } from "@polkadot/types";
import { AnyTuple, CallBase } from "@polkadot/types/types";
import { courier } from "../lib/courier";
import { Recipient } from "@trycourier/courier/lib/send/types";
import { endpoints, topics } from "./data";
import { ReferendumData } from "./extractors";

const processRecipient = ({ channel, attributes }: Channel): Recipient => {
  if (channel === "discord")
    return {
      discord: {
        user_id: attributes.id,
      },
    };
  else if (channel === "sms")
    return {
      phone_number: attributes.number,
    };
  else if (channel === "telegram")
    return {
      webhook: {
        url: `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_SECRET}/sendMessage`,
        headers: {
          "Content-Type": "application/json",
          "Chat-Id": attributes.id,
        },
        profile: "expanded",
      },
    };
  else
    return {
      email: attributes.email,
    };
};

const alertSubscribers = async (
  topic: typeof topics[number],
  data: ReferendumData
) => {
  const { data: subscriptions } = await supabase
    .from<Subscription>("subscriptions")
    .select("uid,channels")
    .eq("topic", topic.topic)
    .eq("network", data.network);
  if (!subscriptions) return;
  const { data: channels } = await supabase
    .from<Channel>("channels")
    .select("uid,channel,attributes")
    .in(
      "uid",
      subscriptions.map((s) => s.uid)
    );
  if (!channels) return;
  const recipients = subscriptions
    .map((s) =>
      channels
        .filter((c) => s.uid === c.uid && s.channels.includes(c.channel))
        .map(processRecipient)
    )
    .flat();
  if (!recipients.length) return;
  console.log(`Sending to ${recipients.length} recipients`);
  await courier.send({
    message: {
      to: recipients,
      template: process.env.COURIER_TEMPLATE!,
      data: {
        title: topic.title(data),
        content: topic.content(data),
      },
    },
  });
  await supabase.rpc("increment", { sub_topic: topic.topic });
};

const handleEvent =
  (
    api: ApiPromise,
    network: keyof typeof endpoints,
    method: CallBase<AnyTuple, FunctionMetadataLatest>
  ) =>
  async ({ event }: EventRecord) => {
    const topic = topics.find((topic) => {
      if (!(topic.section === event.section && topic.method == event.method))
        return false;
      if (
        topic.extrinsics &&
        !(
          topic.extrinsics.method === method.method &&
          topic.extrinsics.section === method.section
        )
      )
        return false;
      return true;
    });
    if (!topic) return;
    const data = await topic.extractor(api, network, event);
    console.log(`New event: ${topic.topic}`, data);
    alertSubscribers(topic, data);
  };

async function listener(network: keyof typeof endpoints) {
  const provider = new WsProvider(endpoints[network]);
  const api = await ApiPromise.create({ provider });
  await api.rpc.chain.subscribeFinalizedHeads(async (header) => {
    const apiAt = await api.at(header.hash);
    const block = await api.rpc.chain.getBlock(header.hash);
    const allEvents = (await apiAt.query.system.events()) as Vec<EventRecord>;

    console.log(`Chain is at block: #${header.number}`);
    supabase.from<Block>("blocks").upsert([
      {
        network,
        block: header.number.toNumber(),
        time: new Date(),
      },
    ]);

    block.block.extrinsics.forEach(({ method }, index) => {
      allEvents
        .filter(({ phase }) => index === (phase.value.toPrimitive() || 0))
        .forEach(handleEvent(api, network, method));
    });
  });
}

async function worker() {
  listener("moonbeam");
  listener("moonriver");
}

worker().catch((error) => {
  console.error(error);
  process.exit(-1);
});
