import { ApiPromise } from "@polkadot/api";
import request, { gql } from "graphql-request";
import { Event } from "@polkadot/types/interfaces";
import { BN } from "@polkadot/util";
import { endpoints } from "./data";

export type ReferendumData = {
  id: number;
  network: keyof typeof endpoints;
  title?: string;
  threshold?: string;
  delay?: number;
  end?: number;
  docs?: string;
  method?: string;
  section?: string;
  proposer?: string;
  subscan_link: string;
  polkassembly_link: string;
};

export type ProposalData = {
  id: number;
  network: keyof typeof endpoints;
  title?: string;
  referendum_id?: number;
  docs?: string;
  method?: string;
  proposer?: string;
  subscan_link: string;
  polkassembly_link: string;
};

const getEventArg = (event: Event, typeName: string) => {
  const type = event.meta.fields
    .find((f) => f.typeName.eq(typeName))
    ?.type.toNumber();
  return event.data
    .find((_e, i) => event.typeDef[i].lookupIndex === type)
    ?.toString();
};

export const proposalData = async (
  _api: ApiPromise,
  network: keyof typeof endpoints,
  event: Event
) => {
  const id = parseInt(getEventArg(event, "PropIndex") || "-1");
  const data: ProposalData = {
    id,
    network,
    subscan_link: `https://${network}.subscan.io/democracy_proposal/${id}`,
    polkassembly_link: `https://${network}.polkassembly.network/proposal/${id}`,
  };
  return await request(
    `https://api.${network}.polkassembly.network/v1/graphql`,
    gql`
      query {
        posts(where: {onchain_link: {onchain_proposal_id: {_eq: ${id}}}}) {
          title
          onchain_link {
            proposer_address
            onchain_referendum_id
            onchain_proposal {
              preimage {
                metaDescription
                method
              }
            }
          }
      
        }
      }
    `
  )
    .then((r) => {
      const proposal = r.posts[0];
      data.title = proposal.title || undefined;
      data.proposer = proposal.onchain_link.proposer_address;
      data.referendum_id = proposal.onchain_link.onchain_referendum_id;
      const onchain = proposal.onchain_link.onchain_proposal[0];
      data.docs = onchain.preimage.metaDescription;
      data.method = onchain.preimage.method;
      return data;
    })
    .catch(() => data);
};

export const referendumData = async (
  api: ApiPromise,
  network: keyof typeof endpoints,
  event: Event
) => {
  const id = parseInt(getEventArg(event, "ReferendumIndex") || "-1");
  const data: ReferendumData = {
    id,
    network,
    subscan_link: `https://${network}.subscan.io/referenda/${id}`,
    polkassembly_link: `https://${network}.polkassembly.network/referendum/${id}`,
  };
  const info: any = await api.query.democracy.referendumInfoOf(new BN(id));
  if (info.isNone) return data;
  const unwrapped = info.unwrap();
  if (unwrapped.isOngoing) {
    const details = unwrapped.asOngoing;
    const image = await api.derive.democracy.preimage(details.proposalHash);
    data.threshold = details.threshold.toString();
    data.delay = details.delay.toNumber();
    data.end = details.end.toNumber();
    data.docs = image?.proposal?.meta.docs
      .map((d) => d.toString().trim())
      .join("");
    data.method = image?.proposal?.method;
    data.section = image?.proposal?.section;
    data.proposer = image?.proposer.toString();
  } else if (unwrapped.isFinished) {
    const details = unwrapped.asFinished;
    data.end = details.end.toNumber();
  }
  data.title = await request(
    `https://api.${network}.polkassembly.network/v1/graphql`,
    gql`
      query {
        posts(where: {onchain_link: {onchain_referendum_id: {_eq: ${id}}}}) {
          title
        }
      }
    `
  )
    .then((r) => r.posts[0].title || undefined)
    .catch(() => undefined);
  return data;
};
