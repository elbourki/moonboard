import { Block, supabase } from "../lib/supabase";
import { networks } from "../data/networks";
import Image from "next/image";
import { useMap } from "usehooks-ts";
import { useEffect } from "react";

export function Blocks() {
  const [blocks, actions] = useMap<string, number>();

  useEffect(() => {
    supabase
      .from<Block>("blocks")
      .select("network,block")
      .then(({ data }) =>
        data?.forEach((block) => actions.set(block.network, block.block))
      );
    const sub = supabase
      .from<Block>("blocks")
      .on("UPDATE", (payload) => {
        actions.set(payload.new.network, payload.new.block);
      })
      .subscribe();
    return () => {
      sub.unsubscribe();
    };
  }, []);

  return (
    <div className="flex gap-2 h-7.5">
      {networks.map((network) =>
        blocks.has(network.id) ? (
          <a
            className="border border-dark-almost rounded text-dark-soft px-2 py-1 text-sm flex items-center gap-1 btn"
            href={`https://moonbeam.subscan.io/block/${blocks.get(network.id)}`}
            target="_blank"
            rel="noreferrer"
            key={network.id}
          >
            <Image
              alt={network.name}
              width={20}
              height={20}
              src={network.logo}
            />
            <span>#{blocks.get(network.id)}</span>
          </a>
        ) : null
      )}
    </div>
  );
}
