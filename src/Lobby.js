import React, { Component } from 'react';
import './Lobby.css';
import { CodeBlock } from './CodeBlock'
class TestComponent extends React.Component {
    render() {
        console.log(this.props)
        return <div />
    }
}
const post = (jsonData, callback = () => { }) => {
    console.warn(jsonData)
    fetch(HOST, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: jsonData
    }).then(res => console.log(res)).then(callback())
}
const HOST = "http://192.168.31.9:3003/log"
export class Lobby extends Component {
    constructor(props) {
        super(props)
        this.state = {
            inputValue: "",
            history: [{ id: 0 }],
            inputLang: "text",
        }
        this.freshList = this.freshList.bind(this)
        this.keyUp = this.keyUp.bind(this)
        this.changeOption = this.changeOption.bind(this)
        this.commit = this.commit.bind(this)
    }
    freshList() {
        fetch(HOST + "?order=id.desc&limit=20").then(res => res.json()).
            then(body => {
                // body.array.forEach(element => {
                //     console.warn(element)
                // });
                let urls = window.location.pathname.split('/')
                let uname = urls[urls.length - 1]
                let history = this.state.history;
                // console.warn(body[0].user_name === uname)
                if (history[0].id !== 0 &&
                    body[0].id !== history[0].id &&
                    uname !== body[0].user_name) {
                    this.notifyMe(body[0].user_name + ": " + body[0].content)
                }
                this.setState({ history: body })
            })
    }
    keyUp(event) {
        if (event.key === 'Enter') {
            this.commit()
        }
    }
    commit() {
        this.addItem(this.state.inputValue)
        this.setState({
            inputValue: '',
            inputLang: "text"
        })
    }
    changeOption(event) {
        this.setState({ inputLang: event.target.value })
    }
    notifyMe(msg) {
        // Let's check if the browser supports notifications
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        }

        // Let's check whether notification permissions have already been granted
        else if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            var notification = new Notification(msg);
        }

        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== "denied") {
            Notification.requestPermission(function (permission) {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    var notification = new Notification(msg);
                }
            });
        }

    }
    componentDidMount() {
        setInterval(this.freshList, 200);
    }
    componentDidUpdate() {
        // this.notifyMe()
    }
    addItem(item) {
        // this.setState({
        //     history: [...this.state.history, item]
        // })
        let urls = window.location.pathname.split('/')
        let uname = urls[urls.length - 1]

        let jsonData = JSON.stringify({
            user_name: uname || 'Anonymous',
            content: item.trimRight(),
            lang: this.state.inputLang
        })
        post(jsonData, this.freshList)
    }
    render() {
        return <div>
            <h1>Chaos Lobby</h1>
            <div className="Lobby-pad">
                <b>{
                    this.state.history.map((e, idx) => {
                        return <div key={idx}><span className="User-name">{e.user_name}:</span>
                            <div className="Content-list">{
                                e.lang === "text" ?
                                   <pre>{ e.content || ""}</pre> : <CodeBlock language={this.state.inputLang}>{e.content}</CodeBlock>
                            }</div>
                        </div>
                    })
                }</b>
            </div>
            <div className="Text-field">
                <textarea rows="4" cols="50" placeholder="input here"
                    value={this.state.inputValue}
                    onChange={(event) => {
                        this.setState({ inputValue: event.target.value })
                    }}
                    onKeyUp={this.keyUp}
                ></textarea>
                <br></br>
                <button onClick={this.commit}>Commit</button>
                <select value={this.state.inputLang}
                    onChange={this.changeOption}
                >
                    <option value="text">Text</option>
                    <option value="java">Java</option>
                </select>
            </div>
            {/* <CodeBlock language="">{this.state.inputValue}</CodeBlock> */}
        </div >
    }
}