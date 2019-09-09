import React, { Component }  from 'react';
import './App.css';
import { Dice } from './components/dice/dice.component';
import { Players } from './components/players/players.component';

export default class App extends Component {
  constructor(props) {
    
    super(props);
    this.state = {
      players: [
        {
          ord: 1,
          score: 0,
          winner: false,
          turns: 0
        },
        {
          ord: 2,
          score: 0,
          winner: false,
          turns: 0
        },
        {
          ord: 3,
          score: 0,
          winner: false,
          turns: 0
        },
        {
          ord: 4,
          score: 0,
          winner: false,
          turns: 0
        }
      ],
      dice: [
        {
          ord: 1,
          value: window.randomInt(1,6),
          rolling: false,
          frozen: false,
          selected: false
        },
        {
          ord: 2,
          value: window.randomInt(1,6),
          rolling: false,
          frozen: false,
          selected: false
        },
        {
          ord: 3,
          value: window.randomInt(1,6),
          rolling: false,
          frozen: false,
          selected: false
        },
        {
          ord: 4,
          value: window.randomInt(1,6),
          rolling: false,
          frozen: false,
          selected: false
        }, 
        {
          ord: 5,
          value: window.randomInt(1,6),
          rolling: false,
          frozen: false,
          selected: false
        }
      ],
      gameStarted: false,
      playerTurn: -1,
      playerRoll: 0,
      playerChoosing: false,
      nextPlayer: false,
      numSelected: 0,
      numFrozen: 0,
      diceRolling: 0,
      maxRounds: 4,
      gameOver: false,
      isSimulation: false,
      simulationDelay: 500
    }
  }
  componentDidMount() {
    window.playGame = ()=>this.simulation();
  }

  startGame(simulation) {
    const firstPlayer = window.randomInt(1,4);
    this.setState({gameStarted:true, playerTurn:firstPlayer, isSimulation: simulation?simulation:false});
  }

  rollDie(ord){
    let counter = window.randomInt(10, 20);
    let interval = setInterval(() => {
        counter--;
        if (counter>0) {
            this.updateDie(ord, window.randomInt(1, 6));
        } else {
            clearInterval(interval);
            this.updateDie(ord, window.randomInt(1, 6), true);
        }
    }, 50);
  }

  rollDice(){
    let _state = {...this.state};
    _state.numSelected = 0;
    _state.numFrozen = 0;
    _state.playerChoosing = false;
    for (let i = 0; i<_state.dice.length; i++) {
      if (_state.dice[i].frozen !== true && _state.dice[i].selected !== true) {
        _state.diceRolling++;
        _state.dice[i].rolling = true;
        this.rollDie(i+1);
      } else {
        _state.dice[i].selected = false;
        _state.dice[i].frozen = true;
        _state.numFrozen = _state.numFrozen + 1;
      }
    }
    _state.playerRoll = _state.playerRoll + 1;
    this.setState(_state);
  }
  
  updateDie(ord, value, endRoll) {
    let _state = {...this.state};

    _state.dice[ord - 1].rolling = false;
    _state.dice[ord - 1].value = value;

    if (endRoll) {
      _state.dice[ord - 1].rolling = false;
      _state.diceRolling--;
    }
    
    this.setState(_state, ()=>{if (this.state.diceRolling === 0) {
      this.rollEnded();
    }});
  }

  dieClick(e) {
    let ord = e.target.props.ord;
    let _state = {...this.state};
    _state.dice[ord - 1].selected = !_state.dice[ord - 1].selected;
    _state.numSelected = _state.numSelected + ( _state.dice[ord - 1].selected? 1 : -1 );
    this.setState(_state);
  }

  rollEnded() {
    let diceRemaining = 0;
    for (let i = 0; i<this.state.dice.length; i++) {
      if (!this.state.dice[i].frozen) {
        diceRemaining++;
      }
    }
    if (diceRemaining > 1) {
      this.setState({playerChoosing: true});
      if (this.state.isSimulation) {
        this.autoChooseDice();
      }
    } else {
      this.setState({nextPlayer: true});
      if (this.state.isSimulation) {
        setTimeout(()=>this.endTurn(), this.state.simulationDelay);
      }
    }
  }

  addScore( callback ) {
    if (callback === undefined) {
      callback = ()=>{};
    }
    let turnScore = 0;
    let _state = {...this.state};
    for (let i = 0; i<_state.dice.length; i++) {
      var dieValue = _state.dice[i].value;
      if (dieValue === 4) {
        dieValue = 0;
      }
      
      turnScore = turnScore + dieValue;
      _state.dice[i].frozen = false;
      _state.dice[i].selected = false;
      _state.dice[i].value = 1;
    }
    _state.players[_state.playerTurn - 1].score = _state.players[_state.playerTurn - 1].score + turnScore;
    _state.numFrozen = 0;
    _state.players[_state.playerTurn - 1].turns = _state.players[_state.playerTurn - 1].turns + 1;
    this.setState(_state, callback);
  }

  toNextPlayer() {
    let _state = {...this.state};
    let playerTurn = _state.playerTurn + 1;
    if (playerTurn > 4) playerTurn = 1;
    _state.nextPlayer = false;
    _state.playerChoosing = false;
    _state.playerTurn = playerTurn;
    _state.playerRoll = 0;
    if (_state.players[playerTurn - 1].turns >= _state.maxRounds) {
      _state.gameOver = true;
      let winner = 0;
      for (let i = 1; i < _state.players.length; i++) {
        if (_state.players[i].score < _state.players[winner].score) {
          winner = i;
        }
      }
      for (let i = 0; i < _state.players.length; i++) {
        if (_state.players[i].score === _state.players[winner].score) {
          _state.players[i].winner = true;
        }
      }
      _state.playerTurn = -1;
    }
    this.setState(_state);
    if (!_state.gameOver && this.state.isSimulation) {
      setTimeout(()=>this.rollDice(), this.state.simulationDelay);
    }
  }
  getRound(){
    let currentRound = 1;
    try {
      currentRound = Math.min(this.state.players[Math.max(0, this.state.playerTurn - 1)].turns+1, this.state.maxRounds);
    } catch (err) {
      //
    }
    return (
      <div>Round {currentRound} of {this.state.maxRounds}</div>
    );
  }
  endTurn() {
    this.addScore( this.toNextPlayer );
  }

  simulation() {
    this.startGame(true);
    setTimeout(()=>this.rollDice(), this.state.simulationDelay);
  }

  autoChooseDice() {
    let _state = {...this.state};
    let numSelected = 0, numUnfrozen = 5;
    let lowest = 7, lowestIndex = -1;
    for (let i = 0; i < _state.dice.length; i++) {
      let die = _state.dice[i];
      if (die.frozen) numUnfrozen--;
      if (!die.frozen && (die.value === 4 || die.value <= 2)) {
        die.selected = true;
        numSelected++;
      } else if (!die.frozen) {
        if (die.value < lowest) {
          lowestIndex = i;
          lowest = die.value
        }
      }
    }
    if (numSelected === 0 && numUnfrozen > 1) {
      _state.dice[lowestIndex].selected = true;
      numSelected++;
    }
    this.setState(_state);
    if (numSelected > 0 && numSelected < numUnfrozen) {
      setTimeout(()=>this.rollDice(), this.state.simulationDelay);
    } else {
      setTimeout(()=>this.endTurn(), this.state.simulationDelay);
    }
  }
  render() {
    //not started
    if (!this.state.gameStarted) {
      return (
        <div className="container">
          <div className="jumbotron">
            <h1 className="display-4">Dice Game!</h1>
            <p className="lead">In this game players roll dice and try to collect the lowest score. A 4 counts as zero, all other
            numbers count as face value. A player’s score is the total spots showing on the dice when she
            finishes her turn (excluding fours because they’re zero). The object of the game is to get the lowest
            score possible.</p>
            <hr className="my-4" />
            <p>The game is played as follows between 4 players:</p>
            <ul>
            <li>Play starts with one person randomly being chosen to start rolling and proceeds in
            succession until all players have rolled.</li>
            <li>The player rolls all five dice, then must keep at least one dice but may keep more at her
            discretion (She can stop on her first roll if she so wishes).</li>
            <li>Those dice which are not kept are rolled again and each round she must keep at least one
            more until all the dice are out.</li>
            <li>Once each player has rolled the player who scored the lowest wins.</li>
            <li>Repeat for three more rounds in succession so that the next person starts rolling first (at
            the end each player will have started).</li>
            </ul>
            <p>After all four rounds have been completed the player with the lowest combined score wins.</p>
            <p className="lead">
              <button className="btn btn-primary btn-lg" onClick={()=>{this.startGame()}}>Let's Play</button>&nbsp;
              <button className="btn btn-secondary btn-lg" onClick={()=>{this.simulation()}}>Let's Simulate</button>
            </p>
          </div>
        </div>
      )
    } else if (this.state.playerChoosing) {
      return (
        <div className="App">
            <Players players={this.state.players} currentPlayer={this.state.playerTurn}></Players>
            <div className="jumbotron">
              <p className="lead">Select at least one die to keep, then roll again OR end your turn and keep all the dice that are showing.</p>
              <p className="lead">
                <button className="btn btn-primary btn-lg" disabled={(this.state.numSelected > 0 && this.state.numSelected + this.state.numFrozen < 5) ? false : "disabled"} onClick={()=>this.rollDice()}>Roll Again</button>
                <button className="btn btn-primary btn-lg float-right" onClick={()=>this.endTurn()}>End Turn</button>
              </p>
            </div>
            <Dice currentRoll={this.state.playerRoll} diceList={this.state.dice} rollDice={()=>{this.rollDice()}} dieClick={(e)=>{this.dieClick(e)}}></Dice>
            <div className="round">{this.getRound()}</div>
        </div>
      );
    } else if (this.state.nextPlayer) {
      return (
        <div className="App">
            <Players players={this.state.players} currentPlayer={this.state.playerTurn}></Players>
            <div className="jumbotron">
              <p className="lead">Your turn is over.</p>
              <p className="lead">
              <button className="btn btn-primary btn-lg float-right" onClick={()=>this.endTurn()}>Next Player</button>
              </p>
            </div>
            <Dice currentRoll={this.state.playerRoll} diceList={this.state.dice} rollDice={()=>{this.rollDice()}} dieClick={(e)=>{this.dieClick(e)}}></Dice>
            <div className="round">{this.getRound()}</div>
        </div>
      );
    } else if (this.state.gameOver) {
      let winners = this.state.players.filter(itm=>{return itm.winner});
      return (
        <div className="App">
            <Players players={this.state.players} currentPlayer={this.state.playerTurn}></Players>
            <div className="jumbotron">
              <h1 className="lead">Winner!</h1>
              {
                winners.map(winner=>{return (<h3 key={"player"+winner.ord}>Player {winner.ord}!</h3>)})
              }
            </div>
        </div>
      );
    } else {
      return (
        <div className="App">
          <Players players={this.state.players} currentPlayer={this.state.playerTurn}></Players>
          <Dice currentRoll={this.state.playerRoll} diceList={this.state.dice} rollDice={()=>{this.rollDice()}} dieClick={(e)=>{this.dieClick(e)}}></Dice>
          <div className="round">{this.getRound()}</div>
        </div>
      );
    }
  }
}

