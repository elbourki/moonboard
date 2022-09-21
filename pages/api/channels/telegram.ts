import { createHash, createHmac } from "node:crypto";
import { withSessionRoute } from "../../../lib/iron";
import { Channel, supabase } from "../../../lib/supabase";

export default withSessionRoute(async function (req, res) {
  if (req.method !== "POST") return res.status(405).end();
  if (!req.session.user) return res.status(401).end();
  const { hash, ...data } = req.body;
  const string = Object.keys(data)
    .sort()
    .map((k) => `${k}=${data[k]}`)
    .join("\n");
  const secret = createHash("sha256")
    .update(process.env.TELEGRAM_BOT_SECRET || "")
    .digest();
  if (createHmac("sha256", secret).update(string).digest("hex") !== hash)
    return res.status(400).end();
  await supabase.from<Channel>("channels").upsert([
    {
      uid: req.session.user.uid,
      channel: "telegram",
      attributes: {
        id: data.id,
      },
    },
  ]);
  res.send({ ok: true });
});
