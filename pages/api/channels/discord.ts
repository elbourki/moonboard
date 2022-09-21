import { handleErrors } from "../../../lib/fetch";
import { withSessionRoute } from "../../../lib/iron";
import { Channel, supabase } from "../../../lib/supabase";

export default withSessionRoute(async function (req, res) {
  if (req.method !== "POST") return res.status(405).end();
  if (!req.session.user) return res.status(401).end();
  const { user } = await fetch("https://discord.com/api/oauth2/@me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${req.body.access_token}`,
    },
  })
    .then(handleErrors)
    .then((r) => r.json());
  await fetch(
    `https://discord.com/api/guilds/${process.env.DISCORD_GUILD_ID}/members/${user.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
      body: JSON.stringify({
        access_token: req.body.access_token,
      }),
    }
  ).then(handleErrors);
  await supabase.from<Channel>("channels").upsert([
    {
      uid: req.session.user.uid,
      channel: "discord",
      attributes: {
        id: user.id,
      },
    },
  ]);
  res.send({ ok: true });
});
