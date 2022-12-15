import { expect } from "chai";
import { ethers } from "hardhat";
import "@nomicfoundation/hardhat-toolbox";

describe("Interaction test between TicTacToe contract and TicTacRefreshContract", function () {
    const EmptyField = "\n | | \n | | \n | | \n";

    async function deployWithRefresh() {
        const [owner, opponent] = await ethers.getSigners();

        const ticFactory = await ethers.getContractFactory("TicTacToe");
        const ticContract = await ticFactory.deploy(opponent.address);
        const ticRefFactory = await ethers.getContractFactory("TicTacRefresh");
        const ticRefresh = await ticRefFactory.deploy(ticContract.address);

        return { ticContract, ticRefresh, owner, opponent };
    }

    it("Refresh raises error when game hasn't ended yet", async function () {
        const { ticRefresh } = await deployWithRefresh();
        try {
            await ticRefresh.refresh();
        } catch (error) {
            expect(error);
            return;
        }
        throw new Error(
            "Refresh should raise error while game hasn't been ended"
        );
    });

    it("Refresh when game ended should clean field and set move to zero", async function () {
        const { ticContract, ticRefresh, opponent } = await deployWithRefresh();

        await ticContract.connect(opponent).makeMove(0, 0);
        await ticContract.makeMove(1, 0);
        await ticContract.connect(opponent).makeMove(0, 1);
        await ticContract.makeMove(1, 1);
        await ticContract.connect(opponent).makeMove(0, 2);
        await ticRefresh.refresh();

        expect(await ticContract.getMoves()).to.equals(0);
        expect(await ticContract.fieldToString()).to.equals(EmptyField);
        expect(await ticContract.isGameOver()).to.equals(false);
    });

    it("Refresh when game is in process raises error", async function () {
        const { ticContract, ticRefresh, opponent } = await deployWithRefresh();

        await ticContract.connect(opponent).makeMove(0, 0);
        await ticContract.makeMove(1, 0);
        await ticContract.connect(opponent).makeMove(0, 1);
        await ticContract.makeMove(1, 1);
        try {
            await ticRefresh.refresh();
        } catch (error) {
            expect(error);
            return;
        }

        throw new Error(
            "Refresh should raise error while game hasn't been ended"
        );
    });
});
