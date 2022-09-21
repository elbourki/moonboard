export default function ConnectDiscord() {
  return (
    <>
      <p className="text-sm mb-4">
        Authorize our application to finish setting up the discord integration
      </p>
      <a
        className="bg-dark-kinda border border-dark-almost rounded font-semibold px-2 py-1 text-sm inline-flex items-center gap-1 btn"
        href={`https://discord.com/oauth2/authorize?response_type=token&client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&scope=guilds.join%20identify`}
      >
        <svg width="1em" height="1em" viewBox="0 0 24 24">
          <g
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          >
            <path d="M10 14a3.5 3.5 0 0 0 5 0l4-4a3.5 3.5 0 0 0-5-5l-.5.5"></path>
            <path d="M14 10a3.5 3.5 0 0 0-5 0l-4 4a3.5 3.5 0 0 0 5 5l.5-.5"></path>
          </g>
        </svg>
        Authorize access
      </a>
    </>
  );
}
