import hre from "hardhat";
import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";

async function main() {
    const [owner, opponent] = await hre.ethers.getSigners();

    const ticFactory = await hre.ethers.getContractFactory("TicTacToe");
    const ticContract = await ticFactory.deploy(opponent.address);

    await ticContract.deployed();

    console.log(
        `Game started as ${ticContract.address}: ${owner.address} vs ${opponent.address}`
    );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
