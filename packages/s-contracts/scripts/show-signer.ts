import { createWalletClient, http } from "viem";
import { liskSepolia } from "viem/chains";

async function main() {
  const pk = (process.env.DEPLOYER_PRIVATE_KEY ?? "")
    .trim()
    .replace(/^"+|"+$/g, "");
  if (!pk) {
    console.error("DEPLOYER_PRIVATE_KEY is not set.");
    process.exit(1);
  }
  const normalized = pk.startsWith("0x") ? pk : "0x" + pk;
  // @ts-ignore - viem accepts hex pk string
  const wallet = createWalletClient({
    account: normalized as any,
    chain: liskSepolia,
    transport: http("https://rpc.sepolia-api.lisk.com"),
  });
  const address = wallet.account!.address;
  console.log("Signer address:", address);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
