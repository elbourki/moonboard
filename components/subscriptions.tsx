import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { NewSubscription } from "./new-subscription";
import { Subscription as ST } from "../lib/supabase";
import { Subscription } from "./subscription";

export const Subscriptions = ({ subscriptions }: { subscriptions: ST[] }) => {
  let [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Subscriptions</h1>
      <p className="text-dark-soft font-normal text-sm mt-1 mb-6">
        Choose which events you want to be notified about
      </p>
      <div className="grid grid-cols-3 gap-4">
        {subscriptions.map((s) => (
          <Subscription key={s.id} subscription={s} />
        ))}
        <div
          onClick={() => setIsOpen(true)}
          className="border border-dashed border-dark-almost rounded min-h-[160px] flex cursor-pointer p-3"
        >
          <div className="flex gap-2 items-center mt-auto opacity-60">
            <PlusIcon width="1em" height="1em" />
            <span className="text-sm">New Subscription</span>
          </div>
        </div>
      </div>
      <NewSubscription isOpen={isOpen} closeModal={() => setIsOpen(false)} />
    </div>
  );
};
