import React from 'react';

import WebModItem from './web.mod.item';
import SocketContext from "./socket.context";

import './web.mod.list.css';

export default class WebModList extends React.Component {
    static contextType = SocketContext;
    defaultPageSize = 20;

    constructor(props) {
        super(props);

        this.state = {
            mods: [],
            isLoadingMore: false,
            pageNum: 0,
            hasMore: true,
            searchMode: 'text'
        }
    }

    render() {
        return (
            <div className="container mod-list">
                <div className="row">
                    <div className="col">
                        <div className="input-group web-mods-toolbar" role="group">
                            {/* Search by dropdown */}
                            <div className="input-group-prepend">
                                <button type="button"
                                        className="btn btn-outline-secondary"
                                        data-toggle="dropdown"
                                        style="width: 40px">
                                    {this.state.searchMode === 'text' && <i className="far fa-file-alt" />}
                                    {this.state.searchMode === 'key' && <i className="fas fa-key" />}
                                    {this.state.searchMode === 'owner' && <i className="far fa-user" />}
                                </button>
                                <div className="dropdown-menu">
                                    <a className="dropdown-item" href="#" onClick={this.handleSearchByTextClick}>
                                        By title and description
                                    </a>
                                    <a className="dropdown-item" href="#" onClick={this.handleSearchByKeyClick}>
                                        By key
                                    </a>
                                    <a className="dropdown-item" href="#" onClick={this.handleSearchByOwnerClick}>
                                        By owner
                                    </a>
                                </div>
                            </div>

                            {/* Search input box */}
                            <input
                                type="text"
                                className="form-control" />

                            {/* Search button */}
                            <div className="input-group-append">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary">
                                    <i className="fas fa-search" />
                                </button>
                            </div>

                            {/* Close web mods browsing button */}
                            <div className="input-group-append">
                                <button
                                    type="button"
                                    className="btn btn-outline-warning"
                                    onClick={this.handleCloseWebClick}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col web-mods-col" onScroll={this.handleScroll}>
                        {this.state.mods.map(mod => <WebModItem key={mod.key} mod={mod} />)}

                        {this.state.isLoadingMore && <div className="row">
                            <div className="col loading">

                            </div>
                        </div>}
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        const socket = this.context;

        socket.on('carrot search', result => {
            const new_mods = this.state.mods.concat(result);

            this.setState({
                mods: new_mods,
                isLoadingMore: false,
                hasMore: result.length === this.defaultPageSize
            });
        });

        this.setState({ isLoadingMore: true });
        this.doSearch();
    }

    handleCloseWebClick = () => {
        this.props.onCloseClick();
    };

    handleScroll = (e) => {
        if (!this.state.isLoadingMore && this.state.hasMore) {
            const t = e.target;
            const remaining = t.scrollHeight - t.scrollTop - t.offsetHeight;

            if (remaining < 16) {
                this.setState({
                    isLoadingMore: true,
                    pageNum: this.state.pageNum + 1
                }, () => {
                    this.doSearch();
                });
            }
        }
    };

    doSearch() {
        const socket = this.context;

        socket.emit('carrot search', {
            mod_key: '', //TODO: Load from user input control
            mc_version: '1.12.2', //TODO: hardcoded version
            page_size: this.defaultPageSize,
            page_num: this.state.pageNum + 1
        });
    }

    handleSearchByTextClick = () => {
        this.setState({ searchMode: 'text' });
    };

    handleSearchByKeyClick = () => {
        this.setState({ searchMode: 'key' });
    };

    handleSearchByOwnerClick = () => {
        this.setState({ searchMode: 'owner' });
    };
}
