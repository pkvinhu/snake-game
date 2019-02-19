import React, { Component } from 'react';
import '../App.css';

class Grid extends Component {
    state = {
        grid: new Array(20).fill([]).map(each => each = new Array(20).fill(0)),
        snake: [[10, 10]],
        direction: '',
        gaming: false
    }

    removeTimer = () => {
        if(this.state.gaming) {
            setInterval(() => {
                this.snakeMove();
            }, 200)
        }
    }

    handleClick = (evt) => {
        this.startGame();
        this.removeTimer();
        this.foodMixer();
    }

    foodMixer = () => {
        const row = Math.ceil(Math.random()*20)
        const col = Math.ceil(Math.random()*20)
        if(this.checkSnakeLen(row, col) !== true) return [row, col]
        else return this.foodMixer()
    }

    startGame = () => {
        this.setState({ gaming: true });
    }

    snakeMove = () => {
        
    }

    checkSnakeLen = (i, j) => {
        return this.state.snake.reduce((acc, curr) => {
            return curr[0] === i && curr[1] === j || acc === true
        }, false)
    }
    
    render() {
        const { handleClick } = this;
        return (
            <div class="root">
                <div className="btn-container">
                    <button className="btn" onClick={handleClick}>Start a New Game</button>
                </div>
                <div className="grid-container">
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