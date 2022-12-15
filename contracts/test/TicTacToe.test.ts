import { expect } from "chai";
import { ethers } from "hardhat";
import "@nomicfoundation/hardhat-toolbox";

describe("TicTacToe", function () {
    async function deployGame() {
        const [owner, opponent] = await ethers.getSigners();

        const ticFactory = await ethers.getContractFactory("TicTacToe");
        const ticContract = await ticFactory.deploy(opponent.address);

        return { ticContract, owner, opponent };
    }

    it("When game started isGameOver is false", async function () {
        const { ticContract } = await deployGame();
        const isGameOver = await ticContract.isGameOver();
        expect(isGameOver).to.equals(false);
    });

    it("First move should be made by opponent (guest address)", async function () {
        const { ticContract, opponent } = await deployGame();
        const whoMakeMove = await ticContract.currentPlayerAdress();
        expect(whoMakeMove).to.equals(opponent.address);
    });

    it("First move from host will rise errror", async function () {
        const { ticContract } = await deployGame();
        try {
            await ticContract.makeMove(0, 0);
        } catch (error) {
            expect(error);
            return;
        }
        throw new Error("Host has made first move");
    });

    it("Player can't make turn twice in a row", async function () {
        const { ticContract, opponent } = await deployGame();
        try {
            await ticContract.connect(opponent).makeMove(0, 0);
            await ticContract.connect(opponent).makeMove(1, 1);
        } catch (error) {
            expect(error);
            return;
        }
        throw new Error("Player has made turn twice");
    });

    it("Player can't make turn twice in a row", async function () {
        const { ticContract, opponent } = await deployGame();
        try {
            await ticContract.connect(opponent).makeMove(0, 0);
            await ticContract.connect(opponent).makeMove(1, 1);
        } catch (error) {
            expect(error);
            return;
        }
        throw new Error("Player has made turn twice");
    });

    it("Horizontal win check", async function () {
        const { ticContract, opponent } = await deployGame();

        await ticContract.connect(opponent).makeMove(0, 0);
        await ticContract.makeMove(1, 0);
        await ticContract.connect(opponent).makeMove(0, 1);
        await ticContract.makeMove(1, 1);
        await ticContract.connect(opponent).makeMove(0, 2);

        const isGameOver = await ticContract.isGameOver();
        const winner = await ticContract.winner();

        expect(isGameOver).to.equals(true);
        expect(winner).to.equals(opponent.address);
    });

    it("Vertical win check", async function () {
        const { ticContract, opponent } = await deployGame();

        await ticContract.connect(opponent).makeMove(0, 0);
        await ticContract.makeMove(0, 1);
        await ticContract.connect(opponent).makeMove(1, 0);
        await ticContract.makeMove(1, 1);
        await ticContract.connect(opponent).makeMove(2, 0);

        const isGameOver = await ticContract.isGameOver();
        const winner = await ticContract.winner();

        expect(isGameOver).to.equals(true);
        expect(winner).to.equals(opponent.address);
    });

    it("Diagonal 1 win check", async function () {
        const { ticContract, opponent } = await deployGame();

        await ticContract.connect(opponent).makeMove(0, 0);
        await ticContract.makeMove(0, 1);
        await ticContract.connect(opponent).makeMove(1, 1);
        await ticContract.makeMove(0, 2);
        await ticContract.connect(opponent).makeMove(2, 2);

        const isGameOver = await ticContract.isGameOver();
        const winner = await ticContract.winner();

        expect(isGameOver).to.equals(true);
        expect(winner).to.equals(opponent.address);
    });

    it("Diagonal 2 win check", async function () {
        const { ticContract, opponent } = await deployGame();

        await ticContract.connect(opponent).makeMove(2, 0);
        await ticContract.makeMove(0, 1);
        await ticContract.connect(opponent).makeMove(1, 1);
        await ticContract.makeMove(0, 0);
        await ticContract.connect(opponent).makeMove(0, 2);

        const isGameOver = await ticContract.isGameOver();
        const winner = await ticContract.winner();

        expect(isGameOver).to.equals(true);
        expect(winner).to.equals(opponent.address);
    });

    it("Tie check", async function () {
        const { ticContract, opponent } = await deployGame();

        await ticContract.connect(opponent).makeMove(0, 0);
        await ticContract.makeMove(1, 1);
        await ticContract.connect(opponent).makeMove(0, 1);
        await ticContract.makeMove(0, 2);
        await ticContract.connect(opponent).makeMove(2, 0);
        await ticContract.makeMove(1, 0);
        await ticContract.connect(opponent).makeMove(1, 2);
        await ticContract.makeMove(2, 1);
        await ticContract.connect(opponent).makeMove(2, 2);

        const isGameOver = await ticContract.isGameOver();
        const winner = await ticContract.winner();

        expect(isGameOver).to.equals(true);
        expect(winner).to.equals(ethers.constants.AddressZero);
    });
});
