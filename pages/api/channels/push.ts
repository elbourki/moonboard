import { withSessionRoute } from "../../../lib/iron";
import { beamsClient } from "../../../lib/pusher";
import { Channel, supabase } from "../../../lib/supabase";

export default withSessionRoute(async function (req, res) {
  if (!req.session.user) return res.status(401).end();
  if (req.method === "POST") return res.send({ uid: req.session.user.uid });
  if (req.method !== "GET") return res.status(405).end();
  const { user_id } = req.query;
  if (user_id != req.session.user.uid) return res.status(400).end();
  const beamsToken = beamsClient.generateToken(user_id);
  await supabase.from<Channel>("channels").upsert([
    {
      uid: req.session.user.uid,
      channel: "push",
      attributes: {
        user_id,
      },
    },
  ]);
  res.send(JSON.stringify(beamsToken));
});
