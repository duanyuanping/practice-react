import React from './react';
import ReactDOM from './react-dom';

function Show({ num }) {
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
      return (
          <div className="App" onClick={() => this.hello()}>
              <Show num={this.state.num}></Show>
          </div>
      );
  }
}


ReactDOM.render(
  <App />,
  document.getElementById( 'root' )
);

