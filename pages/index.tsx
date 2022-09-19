import classNames from "classnames";
import type { NextPage } from "next";
import Router from "next/router";
import { useContext, useState } from "react";
import { withSessionSsr } from "../lib/iron";
import { Web3AuthContext } from "../lib/web3auth";

const Home: NextPage = () => {
  const web3auth = useContext(Web3AuthContext);
  const [loading, setLoading] = useState(false);

  const connect = async () => {
    if (!web3auth) return;
    await web3auth.connect();
    setLoading(true);
    web3auth
      .authenticateUser()
      .then(({ idToken }) =>
        fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: idToken }),
        })
      )
      .then(() => Router.push("/dashboard"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="text-center max-w-xl self-center flex-grow flex flex-col justify-center items-center">
      <h1 className="text-4xl font-extrabold mb-3">Real-time web3 alerts</h1>
      <p className="text-dark-soft text-lg">
        Monitor on-chain activity for events of interest and get instant alerts
        delivered via email, text or messaging platforms.
      </p>
      <button
        onClick={connect}
        disabled={loading || !web3auth}
        className={classNames(
          "bg-dark-kinda border border-dark-almost rounded font-semibold px-4 py-1 mt-6 btn",
          {
            loading,
          }
        )}
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
