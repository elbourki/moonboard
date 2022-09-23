import Router from "next/router";
import { ReactElement } from "react";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { Blocks } from "./blocks";

export default function Layout({
  children,
  user,
}: {
  children: ReactElement;
  user: null | any;
}) {
  const logout = async () => {
    await fetch("/api/logout", {
      method: "POST",
    });
    await Router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col max-w-4xl mx-auto">
      <nav className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2 select-none">
          <svg className="text-lg" width="1em" height="1em" viewBox="0 0 32 32">
            <path
              fill="currentColor"
              d="M1 16C1 7.716 7.716 1 16 1c8.284 0 15 6.716 15 15c0 8.284-6.716 15-15 15c-8.284 0-15-6.716-15-15ZM14.456 3.09C8.004 3.855 3 9.344 3 16c0 2.855.92 5.496 2.481 7.64a3.5 3.5 0 0 1 5.236 4.241c1.166.52 2.422.872 3.74 1.028A17.947 17.947 0 0 1 9 16v-.035a3.5 3.5 0 0 0 1.367-6.856c-.037.087-.072.174-.107.262c.46.703.74 1.623.74 2.63c0 1.523-.639 2.848-1.578 3.523a2.552 2.552 0 0 1-.754.377a3.501 3.501 0 0 1 1.348-6.862c.086.104.168.215.244.332a18.026 18.026 0 0 1 4.196-6.28ZM27.99 21.035a3.5 3.5 0 0 0-3.661 4.948a13.037 13.037 0 0 0 3.66-4.948ZM17 5.5a1.5 1.5 0 1 0-3 0a1.5 1.5 0 0 0 3 0Zm8 6a2.5 2.5 0 1 0-5 0a2.5 2.5 0 0 0 5 0ZM16.5 24a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5Z"
            ></path>
          </svg>
          <span className="font-bold">Moonboard</span>
        </div>
        {user && (
          <button
            onClick={logout}
            className="bg-dark-kinda border border-dark-almost rounded font-semibold px-2 py-1 text-sm flex items-center gap-1 btn"
          >
            <ArrowRightOnRectangleIcon width="1em" height="1em" />
            <span>Logout</span>
          </button>
        )}
      </nav>
      <main className="flex-grow flex flex-col">{children}</main>
      <footer className="p-4 flex justify-between items-center">
        <span className="text-sm text-dark-soft">
          © {new Date().getFullYear()} Moonboard. All Rights Reserved.
        </span>
        <Blocks />
      </footer>
    </div>
  );
}
