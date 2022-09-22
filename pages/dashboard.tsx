import type { NextPage } from "next";
import { withSessionSsr } from "../lib/iron";
import { supabase, Channel, Subscription } from "../lib/supabase";
import { Channels } from "../components/channels";
import { Subscriptions } from "../components/subscriptions";

const Dashboard: NextPage<{
  channels: Channel[];
  subscriptions: Subscription[];
}> = ({ channels, subscriptions }) => {
  return (
    <>
      <Channels channels={channels} />
      <Subscriptions subscriptions={subscriptions} />
    </>
  );
};

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user || null;

    if (!user)
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };

    const { data: channels } = await supabase
      .from<Channel>("channels")
      .select("channel")
      .eq("uid", user.uid);

    const { data: subscriptions } = await supabase
      .from<Subscription>("subscriptions")
      .select("id,network,topic,channels,sent")
      .eq("uid", user.uid);

    return { props: { user, channels, subscriptions } };
  }
);

export default Dashboard;
