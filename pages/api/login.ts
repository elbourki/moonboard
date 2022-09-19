import { withSessionRoute } from "../../lib/iron";
import * as jose from "jose";

export default withSessionRoute(async function (req, res) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const jwks = jose.createRemoteJWKSet(
      new URL("https://authjs.web3auth.io/jwks")
    );
    const token = req.body.token;
    const payload: any = (
      await jose.jwtVerify(token, jwks, {
        algorithms: ["ES256"],
      })
    ).payload;
    req.session.user = {
      token,
      uid: `${payload.wallets[0].type}-${
        payload.wallets[0].address || payload.wallets[0].public_key
      }`,
    };
    await req.session.save();
    res.send({ ok: true });
  } catch {
    return res.status(401).end();
  }
});
