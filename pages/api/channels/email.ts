import { withSessionRoute } from "../../../lib/iron";
import { Channel, supabase } from "../../../lib/supabase";

export default withSessionRoute(async function (req, res) {
  if (req.method !== "POST") return res.status(405).end();
  if (!req.session.user) return res.status(401).end();
  const { email } = req.body;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).end();
  await supabase.from<Channel>("channels").upsert([
    {
      uid: req.session.user.uid,
      channel: "email",
      attributes: {
        email,
      },
    },
  ]);
  res.send({ ok: true });
});
