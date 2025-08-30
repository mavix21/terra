import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TerraModule", (m) => {
  const terra = m.contract("Terra");

  m.call(terra, "incBy", [5n]);

  return { terra };
});
