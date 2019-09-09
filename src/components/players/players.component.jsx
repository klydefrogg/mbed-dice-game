import React, {Component} from 'react';
import {Player} from '../player/player.component';
import './players.component.css';

export class Players extends Component {

    render() {
        return (
            <div className="card-group players">
            {
                this.props.players.map((player, idx)=>{return <Player key={'player'+player.ord} {...player} myTurn={(idx===this.props.currentPlayer-1)?true:false}></Player>})
            }
            </div>
        );
    }
}