const hre = require("hardhat");

async function main() {
  console.log("Starting deployment...");

  const Voting = await hre.ethers.getContractFactory("Voting");

  const voting = await Voting.deploy();

  await voting.waitForDeployment();

  const address = await voting.getAddress();

  console.log("Voting Contract Deployed!");
  console.log("------------------------------------------------");
  console.log(` Contract Address: ${address}`);
  console.log("------------------------------------------------");
  console.log("SAVE THIS ADDRESS! You need it for the Backend .env");
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//npx hardhat compile
//npx hardhat run scripts/deploy.js --network amoy
//npx hardhat run scripts/deploy.js --network sepolia