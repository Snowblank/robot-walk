import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

enum ECommand {
    L = 'L',
    R = 'R',
    W = 'W',
}

enum EDirection {
    NORTH = "North",
    SOUTH = "South",
    WEST = "West",
    EAST = "East",

}

rl.question('Enter the command for the robot? \n', (command: string) => {
    console.log(`command: ${command}`);
    try {
        const commandList = splitCommand(command);
        const postionRobot = robotWalk(commandList);
        rl.write(`Robot Position: X: ${postionRobot.x} Y: ${postionRobot.y} Direction: ${postionRobot.direction}`)
    } catch (error) {
        console.log(`Error: ${(error as Error).message}`);
    } finally {
        rl.close();
    }
});

function splitCommand(command: string) {

    const result: string[] = [];
    for (let i = 0; i < command.length; i++) {
        const commandStr = command[i];
        switch (commandStr) {
            case ECommand.L:
                result.push(commandStr)
                break;
            case ECommand.R:
                result.push(commandStr)
                break;
            case ECommand.W:
                const amountCommandWalk = checkCommandWalk(command.slice(i, command.length))
                const commandWalk = command.slice(i, i + amountCommandWalk);
                result.push(commandWalk)
                i += amountCommandWalk - 1;
                break;
            default:
                throw new Error("unknown command")
        }
    }
    // console.log("CommandList", result);
    return result;
}

function checkCommandWalk(input: string) {
    let isFinish = false;
    let index = 0;
    while (isFinish == false) {
        if (index == 0 && typeof input[index] == 'string') {
            index++
            continue;
        }
        const inputValue = parseInt(input[index]);
        if (isNaN(inputValue)) {
            isFinish = true
        } else {
            index++
        }
    }
    return index;
}

function robotWalk(commandList: string[]) {
    const positionRobot = { x: 0, y: 0, direction: EDirection.NORTH };
    for (let i = 0; i < commandList.length; i++) {
        const targetCommand = commandList[i][0];


        switch (targetCommand) {
            case ECommand.L:
            case ECommand.R:
                positionRobot.direction = changeDirection(positionRobot.direction, targetCommand)
                break;

            case ECommand.W:
                const movePosition = move(positionRobot.direction, commandList[i]);
                positionRobot.x += movePosition.x;
                positionRobot.y += movePosition.y;
                break;

            default:
                throw new Error("not found command")
        }

    }
    // console.log("positionRobot", positionRobot)
    return positionRobot;
}

function changeDirection(currentDirection: EDirection, targetCommand: ECommand.L | ECommand.R) {
    const directionDict = {
        [EDirection.NORTH]: {
            [ECommand.L]: EDirection.WEST,
            [ECommand.R]: EDirection.EAST
        },
        [EDirection.SOUTH]: {
            [ECommand.L]: EDirection.EAST,
            [ECommand.R]: EDirection.WEST
        },
        [EDirection.WEST]: {
            [ECommand.L]: EDirection.SOUTH,
            [ECommand.R]: EDirection.NORTH
        },
        [EDirection.EAST]: {
            [ECommand.L]: EDirection.NORTH,
            [ECommand.R]: EDirection.SOUTH
        },
    }

    const result = directionDict[currentDirection][targetCommand];
    if (result == null) {
        throw new Error("not found direction")
    }
    // console.log("changeDirection-result", result)
    return result
}

function move(currentDirection: EDirection, targetCommand: string) {
    const amountWalk = parseInt(targetCommand.slice(1, targetCommand.length))

    const moveDirectionDict = {
        [EDirection.NORTH]: {
            x: 0,
            y: 1
        },
        [EDirection.SOUTH]: {
            x: 0,
            y: -1
        },
        [EDirection.WEST]: {
            x: -1,
            y: 0
        },
        [EDirection.EAST]: {
            x: 1,
            y: 0
        },
    }

    const direction = moveDirectionDict[currentDirection];
    if (direction == null) {
        throw new Error("not found direction for move")
    }

    const result = {
        x: direction.x * amountWalk,
        y: direction.y * amountWalk
    }
    return result;
}
