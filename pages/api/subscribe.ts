import { networks } from "../../data/networks";
import { topics } from "../../data/topics";
import { channels as allChannels } from "../../data/channels";
import { withSessionRoute } from "../../lib/iron";
import { Subscription, supabase } from "../../lib/supabase";

export default withSessionRoute(async function (req, res) {
  if (req.method !== "POST") return res.status(405).end();
  if (!req.session.user) return res.status(401).end();
  const { network, topic, channels } = req.body;
  if (
    !networks.find((n) => n.id === network) ||
    !topics.find((t) => t.id === topic) ||
    channels.find((c: string) => !allChannels.find((e) => e.id === c))
  )
    return res.status(400).end();
  await supabase.from<Subscription>("subscriptions").insert([
    {
      uid: req.session.user.uid,
      network,
      topic,
      channels,
    },
  ]);
  res.send({ ok: true });
});
