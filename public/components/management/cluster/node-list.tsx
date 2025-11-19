import React, { Component } from 'react';
import {
  EuiPanel,
  EuiFlexGroup,
  EuiFlexItem,
  EuiToolTip,
  EuiButtonIcon,
  EuiTitle,
} from '@elastic/eui';
import { i18n } from '@osd/i18n';
import { withErrorBoundary } from '../../common/hocs';
import { TableWzAPI } from '../../common/tables';
import { WzRequest } from '../../../react-services';
import { SEARCH_BAR_WQL_VALUE_SUGGESTIONS_COUNT } from '../../../../common/constants';

const searchBarWQLFieldSuggestions = [
  {
    label: 'ip',
    description: i18n.translate('management.cluster.nodes.searchBar.ip', {
      defaultMessage: 'filter by IP address',
    })
  },
  {
    label: 'name',
    description: i18n.translate('management.cluster.nodes.searchBar.name', {
      defaultMessage: 'filter by name',
    })
  },
  {
    label: 'type',
    description: i18n.translate('management.cluster.nodes.searchBar.type', {
      defaultMessage: 'filter by type',
    })
  },
  {
    label: 'version',
    description: i18n.translate('management.cluster.nodes.searchBar.version', {
      defaultMessage: 'filter by version',
    })
  },
];

export const NodeList = withErrorBoundary(
  class NodeList extends Component {
    constructor(props) {
      super(props);
      this.columns = [
        {
          field: 'name',
          name: i18n.translate('management.cluster.nodes.columns.name', {
            defaultMessage: 'Name',
          }),
          searchable: true,
          sortable: true,
          truncateText: true,
        },
        {
          field: 'version',
          name: i18n.translate('management.cluster.nodes.columns.version', {
            defaultMessage: 'Version',
          }),
          searchable: true,
          sortable: true,
        },
        {
          field: 'ip',
          name: i18n.translate('management.cluster.nodes.columns.ip', {
            defaultMessage: 'IP address',
          }),
          searchable: true,
          sortable: true,
        },
        {
          field: 'type',
          name: i18n.translate('management.cluster.nodes.columns.type', {
            defaultMessage: 'Type',
          }),
          searchable: true,
          sortable: true,
        },
      ];
      this.state = {
        nodes: [],
        loading: false,
      };
    }
    render() {
      return (
        <EuiPanel>
          <EuiFlexGroup responsive={false} alignItems='center' gutterSize='s'>
            <EuiFlexItem grow={false}>
              <EuiToolTip
                content={i18n.translate('management.cluster.nodes.goBack', {
                  defaultMessage: 'Go back',
                })}
                position='bottom'
              >
                <EuiButtonIcon
                  color='primary'
                  size='m'
                  display='empty'
                  iconType='arrowLeft'
                  aria-label='Back'
                  onClick={() => this.props.goBack()}
                />
              </EuiToolTip>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiTitle>
                <h2>
                  {i18n.translate('management.cluster.nodes.title', {
                    defaultMessage: 'Cluster nodes',
                  })}
                </h2>
              </EuiTitle>
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiFlexGroup>
            <EuiFlexItem>
              <TableWzAPI
                title={i18n.translate('management.cluster.nodes.tableTitle', {
                  defaultMessage: 'Nodes',
                })}
                endpoint='/cluster/nodes'
                tableColumns={this.columns}
                tableInitialSortingField='name'
                tablePageSizeOptions={[10, 25, 50, 100]}
                downloadCsv
                showReload
                searchTable
                searchBarWQL={{
                  suggestions: {
                    field(currentValue) {
                      return searchBarWQLFieldSuggestions;
                    },
                    value: async (currentValue, { field }) => {
                      try {
                        const response = await WzRequest.apiReq(
                          'GET',
                          '/cluster/nodes',
                          {
                            params: {
                              distinct: true,
                              limit: SEARCH_BAR_WQL_VALUE_SUGGESTIONS_COUNT,
                              select: field,
                              sort: `+${field}`,
                              ...(currentValue
                                ? { q: `${field}~${currentValue}` }
                                : {}),
                            },
                          },
                        );
                        return response?.data?.data.affected_items.map(
                          item => ({
                            label: item[field],
                          }),
                        );
                      } catch (error) {
                        return [];
                      }
                    },
                  },
                }}
                tableProps={{
                  tableLayout: 'auto',
                }}
              />
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiPanel>
      );
    }
  },
);
