import { referendumContent, proposalContent } from "./content";
import { referendumData, ReferendumData, proposalData } from "./extractors";

export const endpoints = {
  moonbeam: "wss://wss.api.moonbeam.network",
  moonriver: "wss://wss.api.moonriver.moonbeam.network",
};

export const topics = [
  {
    section: "democracy",
    method: "Started",
    extractor: referendumData,
    title: (data: ReferendumData) => `Referendum #${data.id} started`,
    content: referendumContent,
    topic: "democracy:FastTracked",
    extrinsics: {
      section: "techCommitteeCollective",
      method: "close",
    },
  },
  {
    section: "democracy",
    method: "Started",
    extractor: referendumData,
    title: (data: ReferendumData) => `Referendum #${data.id} started`,
    content: referendumContent,
    topic: "democracy:Started",
  },
  {
    section: "democracy",
    method: "Passed",
    extractor: referendumData,
    title: (data: ReferendumData) => `Referendum #${data.id} passed`,
    content: referendumContent,
    topic: "democracy:Passed",
  },
  {
    section: "democracy",
    method: "Executed",
    extractor: referendumData,
    title: (data: ReferendumData) => `Referendum #${data.id} executed`,
    content: referendumContent,
    topic: "democracy:Executed",
  },
  {
    section: "democracy",
    method: "NotPassed",
    extractor: referendumData,
    title: (data: ReferendumData) => `Referendum #${data.id} not passed`,
    content: referendumContent,
    topic: "democracy:NotPassed",
  },
  {
    section: "democracy",
    method: "Voted",
    extractor: referendumData,
    title: (data: ReferendumData) => `New vote on referendum #${data.id}`,
    content: referendumContent,
    topic: "democracy:Voted",
  },
  {
    section: "democracy",
    method: "Proposed",
    extractor: proposalData,
    title: (data: ReferendumData) => `Proposal #${data.id} published`,
    content: proposalContent,
    topic: "democracy:Proposed",
  },
  {
    section: "democracy",
    method: "Seconded",
    extractor: proposalData,
    title: (data: ReferendumData) => `Proposal #${data.id} seconded`,
    content: proposalContent,
    topic: "democracy:Seconded",
  },
];
