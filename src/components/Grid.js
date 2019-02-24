import React, { Component } from 'react';
import '../App.css';

class Grid extends Component {
    state = {
        grid: new Array(21).fill([]).map(each => each = new Array(21).fill(0)),
        snake: [[10, 10]],
        direction: 40,
        gaming: false,
        food: [],
        movementTracker: {},
        gameover: false,
        points: 0
    }

    // startTimer = () => {
    //     setInterval(() => {
    //         this.snakeMove();
    //     }, 200)
    // }

    handleClick = (evt) => {
        this.startGame();
        this.moveSnakeInterval = setInterval(this.snakeMove, 300);
        this.foodMixer();
    }

    foodMixer = () => {
        const row = Math.floor(Math.random()*20)
        const col = Math.floor(Math.random()*20)
        if(this.checkSnakeLen(row, col) !== true) this.setState({ food: [row, col]});
        else this.foodMixer()
    }

    startGame = () => {
        if (this.moveSnakeInterval) clearInterval(this.moveSnakeInterval);
        this.setState({ gameover: false })
        // if (this.moveFoodTimeout) clearTimeout(this.moveFoodTimeout)
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
          if (!this.isValid(newSnake[0]) || !this.doesntOverlap(newSnake[0])) {
            // end the game
            this.endGame()
          } 
    }

    isValid = (head) => {
        //check if next move is valid/does not hit borders
        if(head[0] < 0 || head[0] > 20 || head[1] < 0 || head[1] > 20){
            return false
        } else {
            return true
        }
    }

    doesntOverlap = (head) => {
        // check if next move hits snake body
        if(this.state.snake.slice(1).indexOf(head) > -1){
            return false
        } else {
            return true
        }
    }

    checkFood = (i, j) => {
        const { food } = this.state;
        return food[0] === i && food[1] === j;
    }

    checkIfAteFood = (newSnake) => {
        const { food } = this.state;
        if(newSnake[0][0] === food[0] && newSnake[0][1] === food[1]) {
            //add to head
            let grownSnake = [];
            // set in the new "head" of the snake
            switch (this.state.direction) {
                // right
                case 39:
                    grownSnake[0] = [this.state.snake[0][0], this.state.snake[0][1] + 1];
                    break;
                // left
                case 37:
                    grownSnake[0] = [this.state.snake[0][0], this.state.snake[0][1] - 1];
                    break;
                // down
                case 40:
                    grownSnake[0] = [this.state.snake[0][0] + 1, this.state.snake[0][1]];
                    break;
                // up
                case 38:
                    grownSnake[0] = [this.state.snake[0][0] - 1, this.state.snake[0][1]];
                    break;
            }
            grownSnake = [...grownSnake, ...newSnake]
            //add to points count
            this.setState({ snake: grownSnake, points: this.state.points+=1 })
            this.foodMixer();
        }
    }

    checkSnakeLen = (i, j) => {
        return this.state.snake.reduce((acc, curr) => {
            return curr[0] === i && curr[1] === j || acc === true
        }, false)
    }

    changeDirection = ({ keyCode }) => {
        console.log(keyCode)
        const { direction } = this.state;
        let checkDir = true;
        [[37, 39], [38, 40]].forEach(dir => {
            if (dir.indexOf(direction) > -1 && dir.indexOf(keyCode) > -1) {
              checkDir = false;
            }
        });
        console.log(checkDir)
        if(checkDir) {
            this.setState({ direction: keyCode })
        }
    }

    endGame = () => {
        this.setState({ gaming: 'false', gameover: true })
    }

    // componentDidMount(){
    //     if(this.state.gaming) {
    //         this.startTimer();
    //     }
    // }
    
    render() {
        const { handleClick, changeDirection } = this;
        console.log(this.state)
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