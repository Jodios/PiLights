import React from 'react';
import './home.css';
import Html5WebSocket from 'html5-websocket';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { SketchPicker } from 'react-color';
import commands from './Commands';
import axios from 'axios';


const url = "wss://lights-socket.jodios.com/ws";
// const url = "ws://localhost:8080/ws";
const options = { constructor: Html5WebSocket };
var socketClient = undefined;

export default class Home extends React.Component {

  state = {
    background: '#fff',
    status: "command",
    current_ip: "0.0.0.0",
    current_state: "TX",
    current_city: "Dallas",
    modified_ip: "0.0.0.0",
    modified_state: "TX",
    modified_city: "Dallas",
    compliment: "hsl(0,0%,0%)",
    text_color: "hsl(120,1,65)"
  };

  async componentDidMount() {
    let ipInfo = {}
    await axios.get("https://ipapi.co/json/").then((response) => {
      ipInfo = response.data;
    }).catch((err) => {
      console.log("There was an error trying to get your ip");
    });
    this.setState({ current_city: ipInfo.city, current_ip: ipInfo.ip, current_state: ipInfo.region_code });

    socketClient = new ReconnectingWebSocket(url, "ws", options);
    console.log("Connecting to client") 
    socketClient.timeout = 1000;

    socketClient.addEventListener('open', () => {
      console.log('Connection to server established');
    });

    socketClient.addEventListener('close', () => {
      console.log('Connection closed');
    });

    socketClient.onerror = (error) => {
      if (error.code === 'EHOSTDOWN') {
        console.log('Error: server down');
      }
      console.log(`Error:\n${error}`);
    };

    socketClient.addEventListener('message', (message) => {
      let data = JSON.parse(message.data);
      if (data['color']) {
        this.setState({ background: data['hex'], status: `Color: ${data['hex']}` });
      } else if (data['command']) {
        this.setState({ status: `Command: ${data['command']}` });
      } else if (data['state']) {
        this.setState({ background: data['hex'], status: data['state'] })
      }
      this.setState({
        modified_city: data['message']['modified_city'] || "Dallas",
        modified_ip: data['message']['modified_ip'] || "0.0.0.0",
        modified_state: data['message']['modified_state'] || "TX"
      });
    });

  }

  handleChange = (color, event) => {
    let message = {
      color: `${color.rgb.r},${color.rgb.g},${color.rgb.b}`,
      hex: color.hex,
      modified_ip: this.state.current_ip,
      modified_city: this.state.current_city,
      modified_state: this.state.current_state
    };
    socketClient.send(JSON.stringify(message))
    let h = (color.hsl.h + 180) % 360;
    let lightness = ( ( color.hsl.l  * 100) + 30 )% 100;
    let textColor = `hsl(158,100%,${lightness}%)`
    this.setState({
      background: color.hex, status: `Color: ${color.hex}`,
      modified_ip: this.state.current_ip,
      modified_city: this.state.current_city,
      modified_state: this.state.current_state,
      compliment: `hsl(${h},${color.hsl.s * 100}%,${color.hsl.l * 100}%)`,
      text_color: textColor
    });
  };

  command = (command) => {
    let message = {
      command: command,
      modified_ip: this.state.current_ip,
      modified_city: this.state.current_city,
      modified_state: this.state.current_state
    }
    this.setState({
      status: `Command: ${command}`,
      modified_ip: this.state.current_ip,
      modified_city: this.state.current_city,
      modified_state: this.state.current_state
    });
    socketClient.send(JSON.stringify(message));
  }

  render() {
    return (
      <div>
        <div className="header" sticky="top" style={{ backgroundColor: this.state.background, color: this.state.text_color }}>
          <h1>{this.state.status}</h1>
          <p>{this.state.current_ip}</p>
        </div>

        <div className="wrapper">
          <div className="left">
            {commands.map(command => {
              return (
                <div key={command.command}>
                  <button style={{backgroundColor: this.state.background, color: this.state.text_color}} className="command" onClick={() => { this.command(command.command); }}>{command.name}</button><br />
                </div>
              )
            })}
          </div>
          <div className="left">
            <SketchPicker
              color={this.state.background}
              onChange={this.handleChange}
              width='90%'
              picker={{backgroundColor: "black"}}
            />
          </div>
        </div>

        <div className="footer" sticky="bottom" style={{ backgroundColor: this.state.background}}>
          <p style={{ color: this.state.text_color }}>{`Last edited by: ${this.state.modified_ip} in ${this.state.modified_city}, ${this.state.modified_state}`}</p>
        </div>

      </div>
    )
  }

}