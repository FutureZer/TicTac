pragma solidity >=0.7.0 <0.9.0;

library Types {
    enum SquareState {
        Empty, X, O
    }
}

interface ITicTacToe {

    function setField(Types.SquareState[3][3] memory) external;

    function setMoves(uint8 newMoves) external;

    function isGameOver() external view returns(bool);
}

// Restart game 
contract TicTacRefresh {

    address ticTacContract;

    constructor(address _ticTacContract) public {
        ticTacContract = _ticTacContract;
    }

    function refresh() public {
        ITicTacToe contr = ITicTacToe(ticTacContract);
        require(contr.isGameOver());
        contr.setMoves(0);
        Types.SquareState[3][3] memory newField;
        contr.setField(newField);
    }
}