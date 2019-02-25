import React, { Component } from 'react';
import '../App.css';

class Grid extends Component {
    state = {
        grid: new Array(21).fill([]).map(each => each = new Array(21).fill(0)),
        snake: [],
        direction: 40,
        gaming: false,
        food: [],
        gameover: false,
        points: 0
    }

    handleClick = (evt) => {
        this.startGame();
        // starts snake incremental movement
        this.moveSnakeInterval = setInterval(this.snakeMove, 200);
        this.foodMixer();
        // key down is listening
        this.el.focus();
    }

    foodMixer = () => {
        // randomizing food as long as it does not land on a cell in the snake body
        const row = Math.floor(Math.random()*20)
        const col = Math.floor(Math.random()*20)
        if(this.checkSnakeLen(row, col) !== true) this.setState({ food: [row, col]});
        else this.foodMixer()
    }

    startGame = () => {
        // initiates the snake incrementing
        if (this.moveSnakeInterval) clearInterval(this.moveSnakeInterval);
        this.setState({ snake: [[10, 10]], gameover: false, points: 0 })
    }

    snakeMove = () => {
        let newSnake = [];
        // set in the new "head" of the snake
        switch (this.state.direction) {
            // right
            case 39:
                newSnake[0] = [this.state.snake[0][0], this.state.snake[0][1] + 1];
                break;
            // left
            case 37:
                newSnake[0] = [this.state.snake[0][0], this.state.snake[0][1] - 1];
                break;
            // down
            case 40:
                newSnake[0] = [this.state.snake[0][0] + 1, this.state.snake[0][1]];
                break;
            // up
            case 38:
                newSnake[0] = [this.state.snake[0][0] - 1, this.state.snake[0][1]];
                break;
        }
        
        newSnake = [...newSnake, ...this.state.snake.slice(1).map((s, i) => {
            // since we're starting from the second item in the list,
            // just use the index, which will refer to the previous item
            // in the original list
            return this.state.snake[i];
        })]

        this.setState({ snake: newSnake });
        
        this.checkIfAteFood(newSnake);

        // check if new snake is within grid and does not overlap
        if (!this.isValid(newSnake[0]) || !this.doesntOverlap(newSnake[0], newSnake.slice(1))) {
        // end the game
        this.endGame()
        } 
    }

    isValid = (head) => {
        //check if next move is valid/does not hit borders
        return (head[0] < 21 && head[0] > -1 && head[1] < 21 && head[1] > -1)
    }

    doesntOverlap = (head, body) => {
        // check if next move hits snake body
        if(body.length && head.length){
            for(let i = 0; i < body.length; i++){
                if(body[i][0] === head[0] && body[i][1] === head[1]){
                    return false
                }
            }
        }
        return true
    }

    checkFood = (i, j) => {
        // place new food on grid
        const { food } = this.state;
        return food[0] === i && food[1] === j;
    }

    checkIfAteFood = (newSnake) => {
        const { food } = this.state;
        if(newSnake[0][0] === food[0] && newSnake[0][1] === food[1]) {
            //add to tail
            let grownSnake = [];
            let lastSegment = newSnake.slice(newSnake.length-2)
            console.log(lastSegment)
            // set in the new "tail" of the snake if snake is only one cell long, check cell and direction
            if(newSnake.length <= 1){
                switch (this.state.direction) {
                    // right
                    case 39:
                        grownSnake[0] = [this.state.snake[0][0], this.state.snake[0][1] - 1];
                        break;
                    // left
                    case 37:
                        grownSnake[0] = [this.state.snake[0][0], this.state.snake[0][1] + 1];
                        break;
                    // down
                    case 40:
                        grownSnake[0] = [this.state.snake[0][0] - 1, this.state.snake[0][1]];
                        break;
                    // up
                    case 38:
                        grownSnake[0] = [this.state.snake[0][0] + 1, this.state.snake[0][1]];
                        break;
                }
            }
            // set tail, check last two cells if snake is longer than one cell long
            else if(newSnake.length > 1){
                if(lastSegment[0][0]<lastSegment[1][0]){
                    grownSnake = [lastSegment[1][0]+1, lastSegment[1][1]];
                }
                else if(lastSegment[0][0]>lastSegment[1][0]){
                    grownSnake = [lastSegment[1][0]-1, lastSegment[1][1]]
                }
                else if(lastSegment[0][1]<lastSegment[1][1]){
                    grownSnake=[lastSegment[0][0], lastSegment[1][1]+1]
                }
                else if(lastSegment[0][1]>lastSegment[1][1]){
                    grownSnake=[lastSegment[0][0], lastSegment[1][1]-1]
                }
            }
            grownSnake = [...newSnake, ...grownSnake]
            //add to points count
            this.setState({ snake: grownSnake, points: this.state.points+=1 })
            //mix food
            this.foodMixer();
        }
    }

    checkSnakeLen = (i, j) => {
        // fill grids according to snake cells
        return this.state.snake.reduce((acc, curr) => {
            return curr[0] === i && curr[1] === j || acc === true
        }, false)
    }

    changeDirection = ({ keyCode }) => {
        // key directions
        const { direction } = this.state;
        let checkDir = true;
        [[37, 39], [38, 40]].forEach(dir => {
            if (dir.indexOf(direction) > -1 && dir.indexOf(keyCode) > -1) {
              checkDir = false;
            }
        });

        if(checkDir) {
            this.setState({ direction: keyCode })
        }
    }

    endGame = () => {
        // end game, overlay and summary displays
        if (this.moveSnakeInterval) clearInterval(this.moveSnakeInterval);
        this.setState({ gaming: 'false', gameover: true })
    }
    
    render() {
        const { handleClick, changeDirection } = this;
        return (
            <div 
                class="root"
                onKeyDown={changeDirection}
                ref={el => (this.el = el)}
                tabIndex={-1}
                >
                <div className="btn-container">
                    <div className="head">
                        <button className="btn" onClick={handleClick}>Start a New Game</button>
                        {this.state.gaming && <div style={{ fontSize: '2em'}}>Points: {this.state.points}</div>}
                    </div>
                </div>
                <div 
                    className="grid-container">
                    {this.state.gameover && (
                        <div id="gameover-overlay">
                            <h3>Score: {this.state.points}</h3>
                            <h5>
                                Game Over! Play again?
                            </h5>
                        </div>
                    )}
                    {this.state.grid.map((row, i) => {
                        return (
                            <div className="row1">
                                {row.map((cell, j) => {
                                    return (
                                        <div 
                                            className="cell1" 
                                            row={i} 
                                            col={j} 
                                            style={this.checkSnakeLen(i, j) ? { backgroundColor: 'black' } : null }>
                                            {this.checkFood(i, j) && (<div class="food"></div>)}
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
            </div>
        );
  }
}

export default Grid;