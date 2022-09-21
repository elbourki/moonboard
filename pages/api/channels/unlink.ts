import { withSessionRoute } from "../../../lib/iron";
import { supabase, Channel } from "../../../lib/supabase";

export default withSessionRoute(async function (req, res) {
  if (req.method !== "POST") return res.status(405).end();
  if (!req.session.user) return res.status(401).end();
  await supabase.from<Channel>("channels").delete().match({
    channel: req.body.channel,
    uid: req.session.user.uid,
  });
  res.send({ ok: true });
});
