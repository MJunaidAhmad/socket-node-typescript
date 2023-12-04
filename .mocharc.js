// # https://mochajs.org/#configuring-mocha-nodejs

if (!process.env.FIRESTORE_EMULATOR_HOST) {
  const FIRESTORE_EMULATOR_HOST_DEFAULT = "localhost:18080";
  console.log(`No FIRESTORE_EMULATOR_HOST env var found. Using ${FIRESTORE_EMULATOR_HOST_DEFAULT}`);
  process.env.FIRESTORE_EMULATOR_HOST = FIRESTORE_EMULATOR_HOST_DEFAULT;
}

if (!process.env.PUBSUB_EMULATOR_HOST) {
  const PUBSUB_EMULATOR_HOST = "localhost:18085";
  console.log(`No PUBSUB_EMULATOR_HOST env var found. Using ${PUBSUB_EMULATOR_HOST}`);
  process.env.PUBSUB_EMULATOR_HOST = PUBSUB_EMULATOR_HOST;
}

// Disable IAP authentication, so it would be easier to work with tests
// IAP authentication is explicitly enabled for corresponding tests
process.env.IAP_AUTHN_ENABLED = "false";

module.exports = {
  "check-leaks": true,
  "enable-source-maps": true,
  exit: true,
  recursive: true,
  require: ["ts-node/register", "test/mocha-hooks.ts"],
  spec: ["test/**/*.spec.ts"],
  timeout: "10s",
  ui: "bdd",
};
