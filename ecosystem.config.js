module.exports = {
  apps: [
    {
      name: "Worker",
      script: "worker/dist/worker/worker.js",
      node_args: "-r dotenv/config",
    },
  ],
};
