import { createContext } from "react";
import { Web3Auth } from "@web3auth/web3auth";

export const Web3AuthContext = createContext<Web3Auth | null>(null);
