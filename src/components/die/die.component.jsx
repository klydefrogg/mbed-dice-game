import React, { Component } from 'react';
import './die.component.css';

export class Die extends Component {
    
    render() {
        
        let classList = "die die-" + this.props.value;
        let notClickable = false;
        if (this.props.rolling) {
            notClickable = true;
            classList = classList + " die-rolling";
        }
        if (this.props.frozen) {
            notClickable = true;
            classList = classList + " die-frozen";
        }
        if (this.props.selected) {
            classList = classList + " die-selected";
        }
        if (notClickable) {
            return ( 
                <div className={ classList }></div>
            );
        } else {
            return (
                <div className={ classList } onClick={ (e)=>{ e.target = this; this.props.dieClick(e);}}></div>
            )
        }

        
        
    }
}
