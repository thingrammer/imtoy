import React, { Component } from 'react';
import Highlight from 'react-highlight'
import "./atom-one-dark.css"
export class CodeBlock extends Component {
    render() {
        return <div>
            {/* <Highlight innerHTML={true}>{'<p>Hello world</p>'}</Highlight> */}
            <Highlight className="Code-block" language={this.props.language}>
                {this.props.children}
            </Highlight>
        </div>
    }
}