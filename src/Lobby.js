import React, { Component } from 'react';
import './Lobby.css';
import { CodeBlock } from './CodeBlock';
import { notifyMe, getUname, HOST, idelete, post, patch } from './utils';
import { IssuePad } from './IssueWidgets';
export class Lobby extends Component {
    constructor(props) {
        super(props)
        this.state = {
            inputValue: "",
            history: [{ id: 0 }],
            inputLang: "text",
            channel: "chaos"
        }
        this.freshList = this.freshList.bind(this)
        this.keyUp = this.keyUp.bind(this)
        this.changeOption = this.changeOption.bind(this)
        this.commit = this.commit.bind(this)
        this.setChannel = this.setChannel.bind(this)
    }
    resolve(idx) {
        patch(idx, this.freshList);
    }

    freshList() {
        fetch(
            HOST + "?order=id.desc&limit=20" +
            (this.state.channel === "" ?
                "" : "&channel=eq." + this.state.channel)
        ).then(res => res.json()).
            then(body => {
                let uname = getUname();
                let history = this.state.history;
                let notifyFlag = body.length > 0 &&
                    history.length > 0 &&
                    history[0].id !== 0 &&
                    body[0].id !== history[0].id &&
                    uname !== body[0].user_name &&
                    this.state.channel === body[0].channel &&
                    history[0].channel === body[0].channel &&
                    body.length > history.length;
                if (notifyFlag) {
                    notifyMe(body[0].user_name + ": " + body[0].content)
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

    setChannel(event) {
        this.setState({
            channel: event.target.textContent
        })
    }
    componentDidMount() {
        setInterval(this.freshList, 200);

    }
    addItem(item) {

        let urls = window.location.pathname.split('/')
        let uname = urls[urls.length - 1]

        let jsonData = JSON.stringify({
            user_name: uname || 'Anonymous',
            content: item.trimRight(),
            lang: this.state.inputLang,
            channel: this.state.channel
        })
        post(jsonData, this.freshList)
    }
    deleteItem(id) {
        idelete(id)
    }
    checkIssue = () => {
        this.setState({
            channel: 'issue'
        })
    }
    render() {
        const group_tabs = ["chaos", "qa", "dev"]
        return <div>
            <h1>Chaos Lobby</h1>
            <div className="Group-pad">
                <div className="Channel-title">Channel</div>
                {
                    group_tabs.map((e, idx) => this.state.channel === e ?
                        <div key={idx} onClick={this.setChannel} className="Group-tab Group-tab-selected">{e}</div> :
                        <div key={idx} onClick={this.setChannel} className="Group-tab">{e}</div>
                    )}
                {this.state.channel !== 'issue' ?
                    <div className="Issue-tag" onClick={this.checkIssue}>Issue</div> :
                    <div className="Issue-tag Group-tab-selected" onClick={this.checkIssue}>Issue</div>
                }
            </div>
            {
                this.state.channel === 'issue' ? <IssuePad /> :
                    <div className="Lobby-pad">
                        <b>{
                            this.state.history.map(e => {
                                let idx = e.id
                                return <div key={e.id}>
                                    <span className="User-name">{e.user_name}---</span>
                                    <span className="Log-time">{new Date(e.log_time).toLocaleString('en-US', { hour12: false })}</span>
                                    {e.solved === true ?
                                        <span className="Solved">{"Resolved By " + e.solver}</span>
                                        : <span onClick={
                                            () => this.resolve(idx)
                                        } className="Unsolved">{"Unresolved"}</span>}
                                    {getUname() === "admin" ?
                                        <span className="Delete-button" onClick={() => this.deleteItem(e.id)}>
                                            DEL
                                    </span> : null}
                                    <div className="Content-list">{
                                        e.lang === "text" ?
                                            <pre className="Text-content">{e.content || ""}</pre> :
                                            <CodeBlock language={this.state.inputLang}>{e.content}</CodeBlock>
                                    }</div>
                                </div>
                            })
                        }</b>
                    </div>
            }
            <div className="Text-field">
                <textarea rows="8" cols="70" placeholder="input here"
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