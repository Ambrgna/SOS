import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import "bootstrap-icons/font/bootstrap-icons.css";

var SIZE = 4;
var BLUESCORE = 0;
var REDSCORE = 0;
var RESET = true;
var ISSIMPLE = false;
var ISBLUECOMP = false;
var ISREDCOMP = true;
var BLUEICON;
var REDICON;
var WINNER;
var GAMEOVER = false;
var ISBLUETURN = true;

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: SIZE,
    };
  }  
  
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  
  render() {
    let boardSquares = [];
    for(let row = 0; row < SIZE; row++){
      let boardRow = [];
      for(let col = 0; col < SIZE; col++){
        boardRow.push(<span key={(row * SIZE) + col}>{this.renderSquare((row * SIZE) + col)}</span>);
      }
      boardSquares.push(<div className="board-row" key={row}>{boardRow}</div>);
    }

    return (
      <div>
        {boardSquares}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array((SIZE*SIZE)).fill(null),
      stepNumber: 0,
      blueTurn: true,
      SMove: true,
	  resetgame: false
    };
    this.updateMove = this.updateMove.bind(this);
    this.handleChange = this.handleChange.bind(this); 
  }
 
  handleClick(i) {
    const squares = this.state.squares.slice();
    var isblueTurn = this.state.blueTurn;
	if((isblueTurn && !ISBLUECOMP) || (!isblueTurn && !ISREDCOMP))
	{
	  if (WINNER != null || squares[i]) {
		return;
	  }
	  squares[i] = this.state.SMove ? "S" : "O";
	  this.setState({
        squares: squares,
	  });
	  if (updatescore(squares, i, isblueTurn)) {
		return;
	  }
	  else
	  {
		//ISBLUETURN = !ISBLUETURN;
		this.setState({
		blueTurn: !this.state.blueTurn
		});
	  }
	}
  }
  
  componentDidUpdate(prevProps, prevState){
	if(ISBLUECOMP && ISREDCOMP && !GAMEOVER && !this.state.resetgame && !ISSIMPLE){
	  this.compvscomp();
	}
    if(prevProps.blueTurn !== this.state.blueTurn && (((ISBLUECOMP ^ ISREDCOMP) === 1) || ISSIMPLE) && !GAMEOVER && !this.state.resetgame){
      this.computermove();
	}
	if(prevState.squares !== this.state.squares && this.state.resetgame){
      this.resetGame();
	}
  }
  
  updateMove(vaule){ 
    // Changing state 
    this.setState({
      SMove: vaule
    });
  } 
  
  handleChange(event) {
	var value;
	
	if(event.target.value == 1){
		value = true;
	}
	else{
		value = false;
	}
    this.setState({
      SMove: value
    });
	
  }
  
  computermove() {
    const squares = this.state.squares.slice();
		
	if((this.state.blueTurn && ISBLUECOMP) || (!this.state.blueTurn && ISREDCOMP))
	{
	  computerturn(squares, this.state.blueTurn);
	  this.setState({
		squares: squares,
		blueTurn: !this.state.blueTurn
	  });
	}  
  }
  
  compvscomp() {
    const squares = this.state.squares.slice();
	  
	for(let i = 0; i < (SIZE*SIZE)/2; i++){
	  computerturn(squares, true);
	  computerturn(squares, false);
	}
	this.setState({
	  squares: squares
	});
	  
  }
  
  resetGame() {
	  console.log("reset");
	
    const squares = this.state.squares.slice();
	
	BLUEICON = "bi playericons blueplay ";
	REDICON = "bi playericons redplay ";
	WINNER = null;
	GAMEOVER = false;
	
	this.setState({
	  resetgame: false
    });
	
	BLUEICON += ((parseInt(document.querySelector('input[name="bluecomputer"]:checked').value) === 1) ? "bi-pc-display-horizontal" : "bi-person-fill");
	REDICON += ((parseInt(document.querySelector('input[name="redcomputer"]:checked').value) === 1) ? "bi-pc-display-horizontal" : "bi-person-fill");
	
	ISSIMPLE = ((parseInt(document.querySelector('input[name="isSimple"]:checked').value) === 1) ? true : false);
	ISBLUECOMP = ((parseInt(document.querySelector('input[name="bluecomputer"]:checked').value) === 1) ? true : false);
	ISREDCOMP = ((parseInt(document.querySelector('input[name="redcomputer"]:checked').value) === 1) ? true : false);
		
	BLUESCORE = 0;
	REDSCORE = 0;
	RESET = false;
  }
  
  resetStates() {
	this.setState({
      squares: Array((SIZE*SIZE)).fill(null),
      stepNumber: 0,
      blueTurn: true,
      SMove: true,
	  resetgame: true
    });
	RESET = false;
	//ISBLUETURN = true;
  }

  render() {
	const squares = this.state.squares.slice();
	var boardwidth = (34*SIZE);
	var Sstate = "btn btn-outline-success btn-sm moves align-middle bottom ";
	var Ostate = "btn btn-outline-success btn-sm moves align-middle top ";
	Sstate += this.state.SMove ? "active" : "inactive";
	Ostate += !this.state.SMove ? "active" : "inactive";
	
	if(RESET){
	  this.resetStates();
	}

    const moves = (
	  <div className="vertical-center">
		  <label className={Sstate}>
			<input type="radio" id="Sradio" name="move" value="1" onClick={this.handleChange} hidden/> S
		  </label><br/>
		  <label className={Ostate}>
			<input type="radio" id="Oradio" name="move" value="0" onClick={this.handleChange} hidden/> O
		  </label>
      </div>
    );

    let status;
    if (WINNER !== null) {
      status = WINNER;
    } else {
      status = "Next player: " + (this.state.blueTurn ? "Blue" : "Red");
    }
    
  const score = (
    <div>
      <table className="scoretable">
        <thead>
          <tr>
            <th style={{width:boardwidth/2 +"px"}}><i className={BLUEICON}></i></th>
            <th style={{width:boardwidth/2 +"px"}}><i className={REDICON}></i></th>
          </tr>
        </thead>
        <tbody>
          <tr className="scorefont">
            <td>{BLUESCORE}</td>
            <td>{REDSCORE}</td>
          </tr>
        </tbody>
      </table>  
    </div>
  );
	

    return (
		<div className="game center" style={{width:boardwidth+80 +"px"}}>
		  <div className="row">
			<div className="col-sm-auto">
			  <div>{score}</div>
			</div>
			<div className="w-100"></div>
			<div className="col-sm-auto">
			  <div className="status">{status}</div>
			</div>
			<div className="w-100"></div>
			<div className="col-sm-auto">
			  <div className="game-board">
				<Board
				  squares={squares}
				  onClick={i => this.handleClick(i)}
				/>
			  </div>
			</div>
			<div className="col-sm-auto move-container">
			  <div className="vertical-center" style={{height:boardwidth +"px"}}>{moves}</div>
			</div>
		  </div>		
		</div>      
    );
  }
}

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bluecomputer: false,
      redcomputer: true,
	  isSimple: false
    };
    this.handleChange = this.handleChange.bind(this);
  }

  formPreventDefault(e) {
    e.preventDefault();
  }
  
  handleChange(event) {
	var value;
	var name = event.target.name;
	var stateChange = {};

	if(event.target.value == 1){
		value = true;
	}
	else{
		value = false;
	}
	stateChange[name] = value;
    this.setState( stateChange );  
	
  }
  
  render() {   
  	var bluehumanlabel = "btn btn-outline-primary settings-input-group ";
	var bluecomputerlabel = "btn btn-outline-primary settings-input-group "; 
  	var redhumanlabel = "btn btn-outline-danger settings-input-group ";
	var redcomputerlabel = "btn btn-outline-danger settings-input-group ";
	var simplelabel = "btn btn-outline-warning settings-input-group ";
	var generallabel = "btn btn-outline-warning settings-input-group ";
	
	bluehumanlabel += !this.state.bluecomputer ? "active" : "inactive";
	bluecomputerlabel += this.state.bluecomputer ? "active" : "inactive";
	redhumanlabel += !this.state.redcomputer ? "active" : "inactive";
	redcomputerlabel += this.state.redcomputer ? "active" : "inactive";
	simplelabel += !this.state.isSimple ? "active" : "inactive";
	generallabel += this.state.isSimple ? "active" : "inactive";
	
	const boardsize = (
		<div className="input-group input-group-sm mb-3 bs-group">
		  <div className="input-group-prepend ">
			<span className="input-group-text prepend " id="inputGroup-sizing-sm">Board Size</span>
		  </div>
		  <input type="number" className="form-control text" id="boardsize" defaultValue={SIZE} min="4"></input>
		</div>
	);
	
	const gametype = (
	  <div className="input-group input-group-sm mb-3">
		<label className={simplelabel}>
		  <input type="radio" id="gametype" name="isSimple" value="0" defaultChecked onChange={this.handleChange} hidden/> General
		</label>
		<label className={generallabel}>
		  <input type="radio" id="gametype" name="isSimple" value="1" onChange={this.handleChange} hidden/> Simple
		</label>
	  </div>
    );
	
	const bluecomputer = (
	  <div className="input-group input-group-sm mb-3">
		<label className={bluehumanlabel}>
		  <input type="radio" id="blueplayer" name="bluecomputer" value="0" defaultChecked onChange={this.handleChange} hidden/> Human
		</label>
		<label className={bluecomputerlabel}>
		  <input type="radio" id="bluecomputer" name="bluecomputer" value="1" onChange={this.handleChange} hidden/> Computer
		</label>
	  </div>
    );
	
	const redcomputer = (
	  <div className="input-group input-group-sm mb-3">
		<label className={redhumanlabel}>
		  <input type="radio" id="redplayer" name="redcomputer" value="0" onChange={this.handleChange} hidden/> Human
		</label>
		<label className={redcomputerlabel}>
		  <input type="radio" id="redcomputer" name="redcomputer" value="1" defaultChecked onChange={this.handleChange} hidden/> Computer
		</label>
	  </div>
    );
	
    return (
		<form action="" onSubmit={this.formPreventDefault}>
			<div className="row justify-center">
				<div className="col-sm-auto">{boardsize}</div>
				<div className="col-sm-auto">{gametype}</div>
				<div className="w-100"></div>
				<div className="col-sm-auto">{bluecomputer}</div>
				<div className="col-sm-auto">{redcomputer}</div>
				<div className="w-100"></div>
				<div className="input-group-append col-sm-auto ">
					<input className="btn btn-outline-secondary float-right btn-sm settings-input-group" type="submit" value="New Game" onClick={newGame}/>
				</div>
			</div>
			<br></br>
		</form>
    );
  }
}

// ========================================

const settings = ReactDOM.createRoot(document.getElementById("settings"));
const root = ReactDOM.createRoot(document.getElementById("root"));
settings.render(<Settings />);
root.render(<Game />);

function findscore(squares, newmove, isBlueturn) {
  var boardsize = SIZE;
  var point = 0;
  //var scored = false;
  const lines = [];
  //lines.push([4, 5, 6]);
  if(squares[newmove] === "S"){
    if((newmove+1) % boardsize !== 0 && (newmove+2) % boardsize !== 0){
      validForList([newmove, newmove+1, newmove+2]);
      validForList([newmove, newmove+boardsize+1, newmove+(2*boardsize)+2]);
      if(newmove >= 2*boardsize){
        validForList([newmove-(2*boardsize)+2, newmove-boardsize+1, newmove]);
      }
    }
    
    if(newmove % boardsize !== 0 && (newmove-1) % boardsize !== 0){
      validForList([newmove-2, newmove-1, newmove]);
      validForList([newmove-(2*boardsize)-2, newmove-boardsize-1, newmove]);
      if(newmove <= boardsize^2-2*boardsize){
        validForList([newmove+(2*boardsize)-2, newmove+boardsize-1, newmove]);
      }
    }
    
    
    //SOS going up/down
    validForList([newmove, newmove+boardsize, newmove+(2*boardsize)]);
    validForList([newmove-(2*boardsize), newmove-boardsize, newmove]);    
  }
  else if(squares[newmove] === "O"){
    if((newmove+1) % boardsize !== 0){
      if(newmove % boardsize !== 0){
        validForList([newmove-1, newmove, newmove+1]);
      }
    }
    if(newmove < boardsize || newmove > boardsize^2-boardsize){
        validForList([newmove-boardsize, newmove, newmove+boardsize]);
      if((newmove+1) % boardsize !== 0){
        if(newmove % boardsize !== 0){
          validForList([newmove-boardsize-1, newmove, newmove+boardsize+1]);
          validForList([newmove-boardsize+1, newmove, newmove+boardsize-1]);
         }
      }
    }

  }
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] === "S" && squares[b] === "O" && squares[c] === "S") {
      point++;
	  //scored = true;
    }
  }
  
  return point;
  
  function validForList(numbers) {
    var valid = true;
    for (let i = 0; i < numbers.length; i++) {
      if(numbers[i]<0 || numbers[i]>=(boardsize*boardsize)){
        valid = false;
      }
    }
    if(valid){
      lines.push(numbers);
    }
  }
}

function updatescore(squares, newmove, isBlueturn) {
  var point = findscore(squares, newmove, isBlueturn);
	
  (isBlueturn ? BLUESCORE += point : REDSCORE += point);

  if((ISSIMPLE && point > 0) || squares.includes(null) !== true)
  {
	calculateWinner();
  }
  
  if(point > 0)
	return true;
	
}

function computerturn(squares, isBlueturn) {
  var point = 0;
  var test;
  var moves = ['S', 'O'];
  var move;
  var scored = false;
  var sindex;
  var boardsize = SIZE*SIZE;
  
  if(squares.includes(null) === true){
	  for(let i = 0; i < boardsize; i++){
		test = squares.slice();
		if(test[i] === null && scored === false){
			for(let j = 0; j <= 1; j++){
				test[i] = moves[j];
				point = findscore(test, i, isBlueturn);
				if(point > 0){
					squares[i] = moves[j];
					updatescore(squares, i, isBlueturn); 
					scored = true;
				}
			}
		}
	  }
	  
	  if(scored === false){
		  sindex = getRandomInt(boardsize);
		  for(let k = 0; k < boardsize; k++){
			if(test[sindex] !== null && sindex < boardsize){ 
			  sindex++;
			}
			if(sindex === boardsize){
			  sindex = 0;
			}
		  }
		  if(sindex === 0 || sindex === SIZE-1 || sindex === (SIZE*SIZE - SIZE) || sindex === (SIZE*SIZE - 1)){
			  move = 'S';
		  }
		  else
		  {
			 move = moves[getRandomInt(2)]
		  }
		squares[sindex] = move;
	  }
	  else
	  {
		computerturn(squares, isBlueturn);
	  }
  }
  else
  {
	calculateWinner();
  }
	  
}

function calculateWinner() {
	if(BLUESCORE !== REDSCORE){
		WINNER = BLUESCORE > REDSCORE ? "Winner: Blue!" : "Winner: Red!";
	}
	else
	{
		WINNER = "Draw Game!";
	}
	
	GAMEOVER = true;
	
}

function newGame() {
	const boardsize = parseInt(document.getElementById("boardsize").value);
	RESET = true;
	if(boardsize > 3){
	  SIZE = boardsize;
	  root.render(<Board />);
	  root.render(<Game />);
	}
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

