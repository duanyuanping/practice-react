import React from './react';
import ReactDOM from './react-dom';

function Show({ num }) {
  // console.log(num)
    return <h1>{num}</h1>
}

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      num: 0
    }
  }

  hello() {

    // console.log(this.state.num)
    this.setState({
      num: this.state.num + 1
    })
  }

  componentDidMount() {
    this.setState({
      num: this.state.num + 1
    })
    this.setState({
      num: this.state.num + 1
    })
  }

  render() {
    const num = this.state.num
    // console.log(num)
    return (
      <div className="App" onClick={() => this.hello()}>
        <Show num={num}></Show>
        {/* <h1>{num}</h1> */}
      </div>
    );
  }
}


ReactDOM.render(
  <App />,
  document.getElementById( 'root' )
);

