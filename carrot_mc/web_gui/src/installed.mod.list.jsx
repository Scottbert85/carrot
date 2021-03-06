import React from 'react';

import InstalledModItem from "./installed.mod.item";

import './installed.mod.list.css';
import SocketContext from "./socket.context";

export default class InstalledModList extends React.Component {
    static contextType = SocketContext;

    constructor(props) {
        super(props);

        this.state = {
            carrotRead: false,
            carrotStatus: null,
            carrotLoaded: false,
            availableMcVersions: this.props.metadata.mc_versions,
            modpackName: "",
            selectedMcVersion: this.props.metadata.default_mc_version
        };
    }

    render() {
        return (
            <div className="container mod-list">
                <div className="row">
                    <div className="col">
                        <div className="btn-group installed-mods-toolbar" role="group">
                            <button
                                type="button"
                                className="btn btn-outline-success"
                                onClick={this.handleRefreshClick}>
                                Refresh
                            </button>

                            {this.isCarrotInitialized() && !this.props.webListOpen &&
                            <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={this.handleInstallMoreClick}>
                                Install more
                            </button>}
                        </div>
                    </div>
                </div>

                {this.state.carrotRead &&
                 !this.isCarrotInitialized() &&
                <div className="row">
                    <div className="col">
                        <span>No repository detected. Please choose a name and Minecraft version below to create one.</span>
                        <br/>
                        <br/>

                        <div className="input-group init-repo">
                            <div className="input-group-prepend">
                                <span className="input-group-text">Repo/modpack name</span>
                            </div>
                            <input
                                type="text"
                                className="form-control modpack-name-box"
                                value={this.state.modpackName}
                                onChange={this.handleModpackNameChange} />
                            <select
                                className="custom-select"
                                id="mc_version-select"
                                value={this.state.selectedMcVersion}
                                onChange={this.handleMcVersionSelect}>
                                {this.props.metadata.mc_versions.map(v =>
                                    <option value={v}>{v}</option>
                                )}
                            </select>
                            <div className="input-group-append">
                                <button
                                    type="button"
                                    className="btn btn-outline-warning"
                                    onClick={this.handleInitRepoClick}>
                                    Initialize repo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>}

                {this.isCarrotInitialized() &&
                 this.state.carrotStatus.mods.length === 0 &&
                <div className="row">
                    <div className="col-auto mr-auto ml-auto">
                    No mods currently installed.
                    </div>
                </div>}

                {this.isCarrotInitialized() &&
                 this.state.carrotStatus.mods.length > 0 &&
                <div className="row">
                    <div className="col installed-mods-col">
                        {this.state.carrotStatus.mods.map(mod => <InstalledModItem key={mod.key} mod={mod} />)}
                    </div>
                </div>}
            </div>
        );
    }

    componentDidMount() {
        const socket = this.context;

        socket.on('carrot status', carrotStatus => {
            this.setState({
                carrotRead: true,
                carrotStatus: carrotStatus
            }, () => {
                if(this.props.onCarrotStatusChange) {
                    this.props.onCarrotStatusChange(carrotStatus);
                }
            });
        });

        socket.on('mod_enabled', () => {
            this.requestGetCarrot();
        });

        socket.on('mod_disabled', () => {
            this.requestGetCarrot();
        });

        this.requestGetCarrot();
    }

    handleRefreshClick = () => {
        this.requestGetCarrot();
    };

    handleInstallMoreClick = () => {
        if (this.props.onInstallMoreClick) {
            this.props.onInstallMoreClick();
        }
    };

    handleInitRepoClick = () => {
        const socket = this.context;
        socket.emit('carrot init', {
            mc_version: this.state.selectedMcVersion,
            name: this.state.modpackName
        });
    };

    handleModpackNameChange = (e) => {
        this.setState({ modpackName: e.target.value });
    };

    handleMcVersionSelect = (e) => {
        this.setState({ selectedMcVersion: e.target.value });
    };

    requestGetCarrot() {
        const socket = this.context;
        socket.emit('carrot status');
    }
    
    isCarrotInitialized() {
        return this.state.carrotRead && this.state.carrotStatus !== null;
    }
}
