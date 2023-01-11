import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

var SIZE = 4;
var BLUESCORE = 0;
var REDSCORE = 0;

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
function getSize() {
  var size = 4;
  return SIZE;
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
    const size = this.state.size;
    for(let row = 0; row < size; row++){
      let boardRow = [];
      for(let col = 0; col < size; col++){
        boardRow.push(<span key={(row * size) + col}>{this.renderSquare((row * size) + col)}</span>);
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
      history: [
        {
          squares: Array((SIZE)^2).fill(null)
        }
      ],
      stepNumber: 0,
      blueTurn: true,
      SMove: true
    };
    this.updateMove = this.updateMove.bind(this);
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    var isblueTurn = this.state.blueTurn;
    squares[i] = this.state.SMove ? "S" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      blueTurn: !this.state.blueTurn
    });
    if (updatescore(squares, i, isblueTurn)) {
      return;
    }
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }
  
  updateMove(vaule){ 
    // Changing state 
    this.setState({
      SMove: vaule
    });
  } 

  render() {    
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = (
      <div>     
        <input type="radio" id="moveS" name="move" value="S" defaultChecked onChange={() => this.updateMove(true)}/>
        <label htmlFor="moveS">S</label>
        <br/>
        <br/>
        <input type="radio" id="moveO" name="move" value="O" onChange={() => this.updateMove(false)}/>
        <label htmlFor="moveO">O</label>
      </div>
    );

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.blueTurn ? "Blue" : "Red");
    }
    
    var tablewidth = 34*SIZE +"px";
    console.log(tablewidth);
    
    const score = (
    <div>
      <table className="scoretable" style={{width:tablewidth}}>
        <thead>
          <tr>
            <th>Blue Score</th>
            <th>Red Score</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{BLUESCORE}</td>
            <td>{REDSCORE}</td>
          </tr>
        </tbody>
      </table>  
    </div>
    );

    return (
      <div className="game">
        <div className="game-board">
          <div>{score}</div>
          <br/>
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div><b>{status}</b></div>
          <ol>{moves}</ol>
        </div>
      </div>
      
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function  updatescore(squares, newmove, isBlueturn) {
  var boardsize = SIZE;
  var point = 0;
  const lines = [];
  //lines.push([4, 5, 6]);
  if(squares[newmove] == "S"){
    if((newmove+1) % boardsize != 0 && (newmove+2) % boardsize != 0){
      validForList([newmove, newmove+1, newmove+2]);
      validForList([newmove, newmove+boardsize+1, newmove+(2*boardsize)+2]);
      if(newmove >= 2*boardsize){
        console.log(">= "+2*boardsize);
        validForList([newmove-(2*boardsize)+2, newmove-boardsize+1, newmove]);
      }
    }
    
    if(newmove % boardsize != 0 && (newmove-1) % boardsize != 0){
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
  else if(squares[newmove] == "O"){
    console.log((newmove+1) % boardsize);
    if((newmove+1) % boardsize != 0){
      if(newmove % boardsize != 0){
        validForList([newmove-1, newmove, newmove+1]);
      }
    }
    if(newmove < boardsize || newmove > boardsize^2-boardsize){
        validForList([newmove-boardsize, newmove, newmove+boardsize]);
      if((newmove+1) % boardsize != 0){
        if(newmove % boardsize != 0){
          validForList([newmove-boardsize-1, newmove, newmove+boardsize+1]);
          validForList([newmove-boardsize+1, newmove, newmove+boardsize-1]);
         }
      }
    }

  }  
  console.log(lines);
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] == "S" && squares[b] == "O" && squares[c] == "S") {
      point++;
    }
  }
  (isBlueturn ? BLUESCORE += point : REDSCORE += point);
  return 0;
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

function calculateWinner(squares, newmove) {
  
}
