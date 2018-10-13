/**
 * Created by Zaedred on 9/6/2017.
 */
import React, { Component } from 'react';
import { withGraphQL } from 'camelot-unchained/lib/graphql/react';
import { accessLevelString } from 'camelot-unchained/lib/webAPI/helpers';
import { AccessType } from 'camelot-unchained/lib/webAPI/definitions';

import { ScaleLoader } from 'react-spinners';

class ServerList extends Component {

    handleViewMOTDChange = (channelID, name) => {
        this.props.onViewMOTD(true, channelID, name);
    }

    handleViewPopulationChange = (name) => {
        this.props.onViewPopulation(true, name);
    }

    handleViewInfoClick(channelID, name) {
        this.handleViewPopulationChange(name);
        this.handleViewMOTDChange(channelID, name);
    }

    renderServers() {

        return this.props.graphql.data.connectedServices.servers && this.props.graphql.data.connectedServices.servers.map(({ channelID, name, status, accessLevel }) => {
            
            var statusColor = "";
            if (status === "Online") {
                statusColor = "badge-success";
            } else {
                statusColor = "badge-danger";
            }

            return (
                <tr key={channelID}>
                    <td>{name}</td>
                    <td>{accessLevelString(AccessType[accessLevel])}</td>
                    <td><span className={"badge " + statusColor}>{status}</span></td>
                    <td>
                        <button type="button" className="btn btn-primary btn-sm btn-small" onClick={() => this.handleViewInfoClick(channelID, name)}>Info</button> 
                    </td>
                </tr>
            );
        });
    }

    componentDidMount() {
        this.interval = setInterval(() => this.props.graphql.refetch(), 300000)
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {

        if (this.props.graphql.data === null) {
            return (
                <div className='text-center react-spinner'>
                    <ScaleLoader color='silver' loading={this.props.graphql.loading} />
                </div>
            );
        } else if (this.props.graphql.data !== null) {
            return (
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Server Name</th>
                                <th>Access</th>
                                <th>Status</th>
                                <th>Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderServers()}
                        </tbody>
                    </table>
                </div>
            );
        } else {
            return <div className='text-center'>Unable to load server list information from the CU API.</div>;
        }

        
    }
}

export default withGraphQL(
    {
        query: `
        query FetchServersQuery {
            connectedServices {
                servers {
                channelID
                host
                name
                status
                apiHost
                accessLevel
                }
            }
        }
        `
    }
)(ServerList);