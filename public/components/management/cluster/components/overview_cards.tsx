import React from 'react';
import { i18n } from '@osd/i18n';
import {
  EuiFlexItem,
  EuiButtonEmpty,
  EuiCard,
  EuiDescriptionList,
  EuiSpacer,
  EuiToolTip,
  EuiFlexGroup,
  EuiTitle,
} from '@elastic/eui';
import { getDashboardPanels } from '../dashboard/dashboard_panels';
import { ViewMode } from '../../../../../../../src/plugins/embeddable/public';
import '../dashboard/cluster_dashboard.scss';
import { getPlugins } from '../../../../kibana-services';
import { DiscoverNoResults } from '../../../common/no-results/no-results';
import { tFilter, tParsedIndexPattern } from '../../../common/data-source';
import { formatUINumber } from '../../../../react-services/format-number';

interface OverviewCardsProps {
  goAgents: () => void;
  goNodes: () => void;
  goConfiguration: () => void;
  configuration: any;
  status: any;
  version: any;
  nodesCount: number;
  nodeList: any[];
  agentsCount: number;
  searchBarProps: any;
  results: any;
  indexPattern: tParsedIndexPattern;
  clusterName?: string;
  filters: tFilter[];
  lastReloadRequestTime: number;
}

const plugins = getPlugins();

const DashboardByRenderer = plugins.dashboard.DashboardContainerByValueRenderer;

export const OverviewCards = ({
  goAgents,
  goNodes,
  goConfiguration,
  configuration,
  status,
  version,
  nodesCount,
  nodeList,
  agentsCount,
  searchBarProps,
  results,
  indexPattern,
  clusterName,
  filters,
  lastReloadRequestTime,
}: OverviewCardsProps) => {
  return (
    <>
      <EuiFlexGroup responsive gutterSize='s'>
        <EuiFlexItem>
          <EuiCard
            textAlign='left'
            title={
              <EuiFlexGroup
                alignItems='center'
                gutterSize='s'
                justifyContent='flexStart'
                responsive={false}
                wrap
              >
                <EuiFlexItem grow={false}>
                  <EuiTitle size='s'>
                    <h2>
                      {i18n.translate('management.cluster.overview.details.title', {
                        defaultMessage: 'Details',
                      })}
                    </h2>
                  </EuiTitle>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiButtonEmpty
                    color='primary'
                    size='s'
                    onClick={goConfiguration}
                    iconType='visPie'
                  >
                    {i18n.translate('management.cluster.overview.viewOverview', {
                      defaultMessage: 'View Overview',
                    })}
                  </EuiButtonEmpty>
                </EuiFlexItem>
              </EuiFlexGroup>
            }
          >
            <EuiSpacer size='m' />
            <EuiDescriptionList
              type='responsiveColumn'
              compressed
              listItems={[
                {
                  title: i18n.translate('management.cluster.overview.ipAddress', {
                    defaultMessage: 'IP address',
                  }),
                  description: configuration?.nodes[0] || '-',
                },
                {
                  title: i18n.translate('management.cluster.overview.running', {
                    defaultMessage: 'Running',
                  }),
                  description: status ?? i18n.translate('management.cluster.overview.no', {
                    defaultMessage: 'no',
                  }),
                },
                {
                  title: i18n.translate('management.cluster.overview.version', {
                    defaultMessage: 'Version',
                  }),
                  description: version ?? '-',
                },
              ]}
              titleProps={{
                className: 'cluster-descriptionList-title',
              }}
              descriptionProps={{
                className: 'color-grey cluster-descriptionList-description',
              }}
            />
          </EuiCard>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiCard
            textAlign='left'
            title={
              <span className='euiTitle euiTitle--small euiCard__title'>
                {i18n.translate('management.cluster.overview.information.title', {
                  defaultMessage: 'Information',
                })}
              </span>
            }
          >
            <EuiSpacer size='m' />
            <EuiDescriptionList
              type='column'
              compressed
              listItems={[
                {
                  title: (
                    <EuiToolTip
                      content={i18n.translate('management.cluster.overview.clickToOpenNodes', {
                        defaultMessage: 'Click to open the list of nodes',
                      })}
                      position='left'
                    >
                      <EuiButtonEmpty
                        color='primary'
                        flush='left'
                        onClick={goNodes}
                        style={{ height: 'auto' }}
                      >
                        {i18n.translate('management.cluster.overview.nodes', {
                          defaultMessage: 'Nodes',
                        })}
                      </EuiButtonEmpty>
                    </EuiToolTip>
                  ),
                  description: (
                    <EuiToolTip
                      content={i18n.translate('management.cluster.overview.clickToOpenNodes', {
                        defaultMessage: 'Click to open the list of nodes',
                      })}
                      position='right'
                    >
                      <EuiButtonEmpty
                        color='primary'
                        flush='left'
                        onClick={goNodes}
                        style={{ height: 'auto' }}
                      >
                        {formatUINumber(nodesCount)}
                      </EuiButtonEmpty>
                    </EuiToolTip>
                  ),
                },
                {
                  title: (
                    <EuiToolTip
                      content={i18n.translate('management.cluster.overview.clickToOpenAgents', {
                        defaultMessage: 'Click to open the list of agents',
                      })}
                      position='left'
                    >
                      <EuiButtonEmpty
                        color='primary'
                        flush='left'
                        onClick={goAgents}
                        style={{ height: 'auto' }}
                      >
                        {i18n.translate('management.cluster.overview.agents', {
                          defaultMessage: 'Agents',
                        })}
                      </EuiButtonEmpty>
                    </EuiToolTip>
                  ),
                  description: (
                    <EuiToolTip
                      content={i18n.translate('management.cluster.overview.clickToOpenAgents', {
                        defaultMessage: 'Click to open the list of agents',
                      })}
                      position='right'
                    >
                      <EuiButtonEmpty
                        color='primary'
                        flush='left'
                        onClick={goAgents}
                        style={{ height: 'auto' }}
                      >
                        {formatUINumber(agentsCount)}
                      </EuiButtonEmpty>
                    </EuiToolTip>
                  ),
                },
              ]}
              titleProps={{
                className: 'cluster-descriptionList-title',
              }}
              descriptionProps={{
                className: 'cluster-descriptionList-description',
              }}
            />
          </EuiCard>
        </EuiFlexItem>
      </EuiFlexGroup>
      {results?.hits?.total > 0 ? (
        <div className='ct-dashboard-responsive'>
          <DashboardByRenderer
            input={{
              viewMode: ViewMode.VIEW,
              panels: getDashboardPanels(indexPattern, nodeList, clusterName),
              isFullScreenMode: false,
              filters: filters,
              useMargins: true,
              id: 'ct-dashboard-tab',
              timeRange: {
                from: searchBarProps?.dateRangeFrom,
                to: searchBarProps?.dateRangeTo,
              },
              title: i18n.translate('management.cluster.overview.dashboardTitle', {
                defaultMessage: 'Cluster Timelions dashboard',
              }),
              description: i18n.translate('management.cluster.overview.dashboardDescription', {
                defaultMessage: 'Dashboard of the Cluster Timelions',
              }),
              query: searchBarProps.query,
              refreshConfig: {
                pause: false,
                value: 15,
              },
              hidePanelTitles: false,
              lastReloadRequestTime,
            }}
          />
        </div>
      ) : (
        <DiscoverNoResults
          message={i18n.translate('management.cluster.overview.noResultsMessage', {
            defaultMessage: 'There are no results for selected time range. Try another one.',
          })}
        />
      )}
    </>
  );
};
