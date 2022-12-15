pragma solidity >=0.7.0 <0.9.0;

contract TicTacToe {

    // Host player
    address host;
    // Connected player
    address enemy;

    // Moves counter
    uint8 move;

    // The state of each square in field
    enum SquareState {
        Empty, X, O
    }

    // Play field
    SquareState[3][3] field;

    // Modifier checks if input pos os in bounds
    modifier isInBounds(uint x, uint8 y) {
        require(x >= 0 && x <= 2 && y >= 0 && y <= 2);
        _;
    }

    // Checks if current player can make turn according to game rules
    modifier canMakeMove() {
        require(msg.sender == host || msg.sender == enemy);
        require(!isGameOver());
        require(msg.sender == currentPlayerAdress());
        _;
    }

    // Event for logging playest turns
    event PlayerMakeTurn(SquareState turn, uint xpos, uint ypos);

    constructor(address player) public {
        require(player != address(0));

        host = msg.sender;
        enemy = player;
    }

    function makeMove(uint8 xpos, uint8 ypos) canMakeMove() isInBounds(xpos, ypos) public {
        require(field[xpos][ypos] == SquareState.Empty);

        if (msg.sender == host) {
            field[xpos][ypos] = SquareState.O;
            move++;
            emit PlayerMakeTurn(field[xpos][ypos], xpos, ypos);
        }
        if (msg.sender == enemy) {
            field[xpos][ypos] = SquareState.X;
            move++;
            emit PlayerMakeTurn(field[xpos][ypos], xpos, ypos);
        }
    }

    // Display address of a winner if game hasn't finishet yet or it's finished with draw return 0 address
    function winner() public view returns(address) {
        SquareState win = winnerSign();
        if (win == SquareState.X) {
            return enemy;
        }
        if (win == SquareState.O) {
            return host;
        }
        return address(0);
    }

    // Address of player who makes current turn
    function currentPlayerAdress() public view returns(address) {
        if (move % 2 == 0) {
            return enemy;
        } else {
            return host;
        }
    }

    // Checks if game should be over or not according to the game rules
    function isGameOver() public view returns(bool) {
        return (winnerSign() != SquareState.Empty || move > 8);
    }

    function winnerSign() public view returns(SquareState) {
        // Rows
        if (field[0][0] != SquareState.Empty && field[0][0] == field[0][1] && field[0][0] == field[0][2]) {
            return field[0][0];
        }
        if (field[1][0] != SquareState.Empty && field[1][0] == field[1][1] && field[1][0] == field[1][2]) {
            return field[1][0];
        }
        if (field[2][0] != SquareState.Empty && field[2][0] == field[2][1] && field[2][0] == field[2][2]) {
            return field[2][0];
        }

        // Columns
        if (field[0][0] != SquareState.Empty && field[0][0] == field[1][0] && field[0][0] == field[2][0]) {
            return field[0][0];
        }
        if (field[0][1] != SquareState.Empty && field[0][1] == field[1][1] && field[0][0] == field[2][1]) {
            return field[0][1];
        }
        if (field[0][2] != SquareState.Empty && field[0][2] == field[1][2] && field[0][2] == field[2][2]) {
            return field[0][2];
        }

        // Diagonals
        if (field[0][0] != SquareState.Empty && field[0][0] == field[1][1] && field[0][0] == field[2][2]) {
            return field[0][0];
        }
        if (field[0][2] != SquareState.Empty && field[0][2] == field[1][1] && field[0][2] == field[2][0]) {
            return field[0][2];
        }

        return SquareState.Empty;
    }

    function setField(SquareState[3][3] memory newField) external {
        field = newField;
    }

    function setMoves(uint8 newMoves) external {
        move = newMoves;
    }

    function getMoves() public view returns(uint8) {
        return move;
    }
    
    // To display play field in the console
    function fieldToString() public view returns (string memory) {
        return string(abi.encodePacked("\n",
            rowToString(0), "\n",
            rowToString(1), "\n",
            rowToString(2), "\n"
        ));
    }

    function rowToString(uint8 ypos) private view returns (string memory) {
        return string(abi.encodePacked(
            tileToString(0, ypos), "|",
            tileToString(1, ypos), "|",
            tileToString(2, ypos)
        ));
    }

    function tileToString(uint8 xpos, uint8 ypos) private view isInBounds(xpos, ypos) returns (string memory) {

        if (field[xpos][ypos] == SquareState.Empty) {
            return " ";
        } else if (field[xpos][ypos] == SquareState.X) {
            return "X";
        } else if (field[xpos][ypos] == SquareState.O) {
            return "O";
        }
    }
}