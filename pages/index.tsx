import type { NextPage } from "next";
import { useState } from "react";
import { withSessionSsr } from "../lib/iron";

const Home: NextPage<{ login: () => void }> = ({ login }) => {
  return (
    <div className="text-center max-w-xl self-center flex-grow flex flex-col justify-center items-center">
      <h1 className="text-4xl font-extrabold mb-3">Real-time web3 alerts</h1>
      <p className="text-dark-soft text-lg">
        Monitor on-chain activity for events of interest and get instant alerts
        delivered via email, text, and messaging platforms.
      </p>
      <button
        onClick={login}
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
