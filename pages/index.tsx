import type { NextPage } from "next";
import Router from "next/router";
import { useCallback, useState } from "react";
import { useConnect, useDisconnect, useSignMessage } from "wagmi";
import { handleErrors } from "../lib/fetch";
import { withSessionSsr } from "../lib/iron";
import toast from "react-hot-toast";
import { SiweMessage } from "siwe";

const Home: NextPage = () => {
  const {
    connectors: [connector],
    connectAsync,
  } = useConnect();
  const { signMessageAsync } = useSignMessage();
  const { disconnectAsync } = useDisconnect();
  const [loading, setLoading] = useState(false);

  const signIn = useCallback(async () => {
    if (!connector.ready) return toast.error("MetaMask not installed");
    try {
      setLoading(true);
      await toast
        .promise(
          disconnectAsync()
            .then(() =>
              connectAsync({
                connector,
              })
            )
            .then(async (e) => {
              const { nonce } = await fetch("/api/nonce")
                .then(handleErrors)
                .then((r) => r.json());
              const message = new SiweMessage({
                domain: window.location.host,
                address: e.account,
                statement: "Sign in to Moonboard.",
                uri: window.location.origin,
                version: "1",
                chainId: e.chain.id,
                nonce,
              });
              const signature = await signMessageAsync({
                message: message.prepareMessage(),
              });
              return fetch("/api/login", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ message, signature }),
              }).then(handleErrors);
            }),
          {
            loading: "Connecting via MetaMask",
            success: "MetaMask connected!",
            error: "Couldn't connect MetaMask",
          }
        )
        .then(() => Router.push("/dashboard"))
        .finally(() => setLoading(false));
    } catch (e) {
      console.log(e);
    }
  }, [connectAsync, connector, disconnectAsync, signMessageAsync]);

  return (
    <div className="text-center max-w-xl self-center flex-grow flex flex-col justify-center items-center">
      <h1 className="text-4xl font-extrabold mb-3">Real-time web3 alerts</h1>
      <p className="text-dark-soft text-lg">
        Monitor on-chain activity for events of interest and get instant alerts
        delivered via email, text, and messaging platforms.
      </p>
      <button
        onClick={signIn}
        disabled={loading}
        className="bg-dark-kinda border border-dark-almost rounded font-semibold px-4 mt-6 btn h-9"
      >
        Get started
      </button>
    </div>
  );
};

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user || null;

    if (user)
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };

    return { props: { user } };
  }
);

export default Home;
