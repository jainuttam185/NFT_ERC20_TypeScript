// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const liquidity = await hre.ethers.deployContract("Pool",
    ["0x1928496a8E34967F02eAF527Fe8A4EaC2EA8E646","0x84933aD21c5e47d390061877ad7B149e042dB983"]
  );
  await liquidity.waitForDeployment();
  console.log("Liquidity contract deployed at address: ", await liquidity.getAddress());

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
