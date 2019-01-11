import React from 'react';

import './installed.mod.item.css';

import SocketContext from "./socket.context";

export default class InstalledModItem extends React.Component {
    static contextType = SocketContext;

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div className="row mod-info-row">
                <div className="col-auto mr-auto">
                    <span className="mod-key">[{this.props.mod.key}]</span>
                    <br/>
                    <span className="mod-name">{this.props.mod.name}</span>
                    {' by '}
                    <span className="mod-owner">{this.props.mod.owner}</span>
                </div>
                <div
                    className="col-auto"
                    title={this.props.mod.disabled ? "Disabled" : "Enabled"}
                    >
                    <div className="form-check checkbox-slider--b">
                        <label>
                            <input
                                type="checkbox"
                                checked={this.props.mod.disabled ? "" : "checked"}
                                onChange={this.handleEnableClick} />
                            <span>&nbsp;</span>
                        </label>
                    </div>
                </div>
            </div>
        );
    }

    handleEnableClick = () => {
        const socket = this.context;

        if (this.props.mod.disabled) {
            socket.emit('carrot enable', { mod_key: [this.props.mod.key] });
        } else {
            socket.emit('carrot disable', { mod_key: [this.props.mod.key] });
        }
    }
}