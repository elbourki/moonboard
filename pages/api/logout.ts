import { withSessionRoute } from "../../lib/iron";

export default withSessionRoute(async function (req, res) {
  if (req.method !== "POST") return res.status(405).end();
  req.session.destroy();
  res.send({ ok: true });
});
