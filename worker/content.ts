import { ReferendumData, ProposalData } from "./extractors";

export const referendumContent = (data: ReferendumData): string =>
  [
    data.title && `**Title:** ${data.title}`,
    data.proposer && `**Proposer:** ${data.proposer}`,
    data.end && `**End:** #${data.end}`,
    data.delay && `**Delay:** ${data.delay} minutes`,
    data.threshold && `**Vote threshold:** ${data.threshold}`,
    data.method && `**Method:** ${data.section}.${data.method}`,
    data.docs && `**Description:** ${data.docs}`,
  ]
    .filter(Boolean)
    .join("  \n");

export const proposalContent = (data: ProposalData): string =>
  [
    data.title && `**Title:** ${data.title}`,
    data.referendum_id && `**Referendum ID:** #${data.referendum_id}`,
    data.proposer && `**Proposer:** ${data.proposer}`,
    data.method && `**Method:** ${data.method}`,
    data.docs && `**Description:** ${data.docs}`,
  ]
    .filter(Boolean)
    .join("  \n");
