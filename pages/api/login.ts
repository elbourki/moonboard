import { withSessionRoute } from "../../lib/iron";
import { SiweMessage } from "siwe";

export default withSessionRoute(async function (req, res) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const { message, signature } = req.body;
    const siweMessage = new SiweMessage(message);
    const { data: fields } = await siweMessage.verify({ signature });

    if (fields.nonce !== req.session.nonce)
      return res.status(422).json({ message: "Invalid nonce." });

    await req.session.save();
    req.session.user = {
      uid: fields.address,
    };
    await req.session.save();
    res.send({ ok: true });
  } catch {
    return res.status(401).end();
  }
});
