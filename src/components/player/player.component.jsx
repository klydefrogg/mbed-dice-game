import React, {Component} from 'react';
import './player.compnent.css';

export class Player extends Component {
    render() {
        let classList = "card player";
        if (this.props.myTurn === true) {
            classList = classList + " currentPlayer";
        }
        if (this.props.winner) {
            classList = classList + " winner";
        }
        return (
            <div className={classList}>
                <h3 className="card-header player-number">Player {this.props.ord}</h3>
                <div className="card-body">
                    <h2 className="score">{this.props.score||0}</h2>
                </div>
            </div>
        );
    }
}