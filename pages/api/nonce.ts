import { withSessionRoute } from "../../lib/iron";
import { generateNonce } from "siwe";

export default withSessionRoute(async function (req, res) {
  if (req.method !== "GET") return res.status(405).end();
  req.session.nonce = generateNonce();
  await req.session.save();
  res.send({ nonce: req.session.nonce });
});
