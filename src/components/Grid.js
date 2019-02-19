import React, { Component } from 'react';
import '../App.css';

class Grid extends Component {
    state = {
        grid: new Array(15).fill([]).map(each => each = new Array(15).fill(0))
    }
    
    render() {
        return (
            <div class="root">
                <div className="btn-container">
                    <button className="btn">Start a New Game</button>
                </div>
                <div className="grid-container">
                    {this.state.grid.map(each => {
                        return (
                            <div className="row1">
                                {each.map(cell => {
                                    return (
                                        <div className="cell1">
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