import React, { useState, useEffect, useMemo } from 'react';
import { getPlugins } from '../../../kibana-services';
import { I18nProvider } from '@osd/i18n/react';
import { ViewMode } from '../../../../../../src/plugins/embeddable/public';
import { SearchResponse } from '../../../../../../src/core/server';
import { withErrorBoundary } from '../../common/hocs/error-boundary/with-error-boundary';
import { DiscoverNoResults } from '../../common/no-results/no-results';
import { LoadingSearchbarProgress } from '../../common/loading-searchbar-progress/loading-searchbar-progress';
import { IndexPattern } from '../../../../../../src/plugins/data/common';
import {
  AlertsDataSourceRepository,
  PatternDataSource,
  tParsedIndexPattern,
  useDataSource,
} from '../../common/data-source';
import { createRuleGroupDataSource } from '../../common/data-source/pattern/alerts/dynamic';
import {
  ErrorFactory,
  ErrorHandler,
  HttpError,
} from '../../../react-services/error-management';
import { WzSearchBar } from '../../common/search-bar';
import useSearchBar from '../../common/search-bar/use-search-bar';
import { SampleDataWarning } from '../../visualize/components';
import { useReportingCommunicateSearchContext } from '../../common/hooks/use-reporting-communicate-search-context';
import { getDynamicDashboardPanels } from './dashboard/dynamic';
import '../custom/dashboard/custom_dashboard_filters.scss';

const plugins = getPlugins();
const DashboardByRenderer = plugins.dashboard.DashboardContainerByValueRenderer;

interface DynamicDashboardProps {
  ruleGroup: string;
}

const DynamicDashboardComponent: React.FC<DynamicDashboardProps> = ({ ruleGroup }) => {
  const DataSource = useMemo(() => createRuleGroupDataSource(ruleGroup), [ruleGroup]);
  const AlertsRepository = useMemo(() => new AlertsDataSourceRepository(), []);

  const {
    filters,
    setFilters,
    fetchFilters,
    fixedFilters,
    isLoading: isDataSourceLoading,
    dataSource,
    fetchData,
  } = useDataSource<tParsedIndexPattern, PatternDataSource>({
    DataSource,
    repository: AlertsRepository,
  });

  const [results, setResults] = useState<SearchResponse>({} as SearchResponse);

  const { searchBarProps, fingerprint, autoRefreshFingerprint } = useSearchBar({
    indexPattern: dataSource?.indexPattern as IndexPattern,
    filters,
    setFilters,
  });
  const { query, dateRangeFrom, dateRangeTo } = searchBarProps;

  useReportingCommunicateSearchContext({
    isSearching: isDataSourceLoading,
    totalResults: results?.hits?.total ?? 0,
    indexPattern: dataSource?.indexPattern,
    filters: fetchFilters,
    query: query,
    time: { from: dateRangeFrom, to: dateRangeTo },
  });

  useEffect(() => {
    if (isDataSourceLoading) {
      return;
    }
    fetchData({
      query,
      dateRange: { from: dateRangeFrom, to: dateRangeTo },
    })
      .then(results => {
        setResults(results);
      })
      .catch(error => {
        const searchError = ErrorFactory.create(HttpError, {
          error,
          message: 'Error fetching data',
        });
        ErrorHandler.handleError(searchError);
      });
  }, [
    JSON.stringify(fetchFilters),
    JSON.stringify(query),
    dateRangeFrom,
    dateRangeTo,
    fingerprint,
    autoRefreshFingerprint,
  ]);

  return (
    <>
      <I18nProvider>
        {isDataSourceLoading && !dataSource ? (
          <LoadingSearchbarProgress />
        ) : (
          <>
            <WzSearchBar
              appName={`dynamic-${ruleGroup}-searchbar`}
              {...searchBarProps}
              fixedFilters={fixedFilters}
              showDatePicker={true}
              showQueryInput={true}
              showQueryBar={true}
            />
            {dataSource && results?.hits?.total === 0 ? (
              <DiscoverNoResults />
            ) : null}
            <div
              className={
                dataSource && results?.hits?.total > 0 ? '' : 'wz-no-display'
              }
            >
              <SampleDataWarning />
              <div className="custom-dashboard-responsive">
                <DashboardByRenderer
                  input={{
                    viewMode: ViewMode.VIEW,
                    panels: getDynamicDashboardPanels(
                      AlertsRepository.getStoreIndexPatternId(),
                      ruleGroup,
                      Boolean(dataSource?.getPinnedAgentFilter()?.length),
                    ),
                    isFullScreenMode: false,
                    filters: fetchFilters ?? [],
                    useMargins: true,
                    id: `dynamic-dashboard-${ruleGroup}`,
                    timeRange: { from: dateRangeFrom, to: dateRangeTo },
                    title: `${ruleGroup} dashboard`,
                    description: `Dashboard for ${ruleGroup} alerts`,
                    query: query,
                    refreshConfig: {
                      pause: false,
                      value: 15,
                    },
                    hidePanelTitles: false,
                    lastReloadRequestTime: fingerprint,
                  }}
                />
              </div>
            </div>
          </>
        )}
      </I18nProvider>
    </>
  );
};

export const DynamicDashboard = withErrorBoundary(DynamicDashboardComponent);
