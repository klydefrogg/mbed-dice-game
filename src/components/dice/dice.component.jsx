import React, { Component } from 'react';
import { Die } from '../die/die.component';
import './dice.component.css';

export class Dice extends Component {
    
    render() {
        if (this.props.currentRoll===0) {
            return (
                <div className="diceContainer">
                    <button className="freeDice" onClick={this.props.rollDice}>
                        <div className="dice">Click to Roll Dice</div>
                    </button>
                </div>
            );
        }
        return (
            <div className="diceContainer">
                
                <div className="freeDice">
                    <div className="dice">
                    {
                        this.props.diceList.map((die)=>{return <Die key={ "die" + die.ord} {...die} dieClick={this.props.dieClick}></Die>})
                    }
                    </div>
                </div>

            </div>
        );
    }
}

