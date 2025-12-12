import React, { useState, useEffect } from 'react';
import { getPlugins } from '../../../../kibana-services';
import { I18nProvider } from '@osd/i18n/react';
import { ViewMode } from '../../../../../../../src/plugins/embeddable/public';
import { SearchResponse } from '../../../../../../../src/core/server';
import { withErrorBoundary } from '../../../common/hocs/error-boundary/with-error-boundary';
import { DiscoverNoResults } from '../../../common/no-results/no-results';
import { IndexPattern } from '../../../../../../../src/plugins/data/common';
import './custom_dashboard_filters.scss';
import {
  AlertsDataSourceRepository,
  CustomDataSource,
  PatternDataSource,
  tParsedIndexPattern,
  useDataSource
} from '../../../common/data-source';
import {
  ErrorFactory,
  ErrorHandler,
  HttpError,
} from '../../../../react-services/error-management';
import { WzSearchBar } from '../../../common/search-bar';
import useSearchBar from '../../../common/search-bar/use-search-bar';
import { SampleDataWarning } from '../../../visualize/components';
import { getDashboardPanels } from './dashboard-panels';

const plugins = getPlugins();

const DashboardByRenderer = plugins.dashboard.DashboardContainerByValueRenderer;

const DashboardC: React.FC = () => {
  const AlertsRepository = new AlertsDataSourceRepository();
  const {
    filters,
    setFilters,
    fetchFilters,
    fixedFilters,
    isLoading: isDataSourceLoading,
    dataSource,
    fetchData
  } = useDataSource<tParsedIndexPattern, PatternDataSource>({
    DataSource: CustomDataSource, repository: AlertsRepository
  });
  const [results, setResults] = useState<SearchResponse>({} as SearchResponse);

  const { searchBarProps, fingerprint, autoRefreshFingerprint } = useSearchBar({
    indexPattern: dataSource?.indexPattern as IndexPattern,
    filters,
    setFilters,
  });
  const { query, dateRangeFrom, dateRangeTo } = searchBarProps;

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
    <I18nProvider>
      <>
        <WzSearchBar
          appName='custom-searchbar'
          {...searchBarProps}
          fixedFilters={fixedFilters}
          showQueryInput={true}
          showQueryBar={true}
          showSaveQuery={true}
        />
        {dataSource && results?.hits?.total === 0 ? (
          <DiscoverNoResults />
        ) : null}
        <div className="custom-dashboard-responsive" >
          <SampleDataWarning />
          <div className='custom-dashboard-filters-wrapper'>
            <DashboardByRenderer
              input={{
                viewMode: ViewMode.VIEW,
                panels: getDashboardPanels(
                  AlertsRepository.getStoreIndexPatternId(),
                  Boolean(dataSource?.getPinnedAgentFilter().length),
                ),
                isFullScreenMode: false,
                filters: fetchFilters ?? [],
                useMargins: true,
                id: 'custom-dashboard-tab-filters',
                timeRange: { from: dateRangeFrom, to: dateRangeTo },
                title: 'Custom dashboard filters',
                description: 'Dashboard of the customs filters',
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
    </I18nProvider>
  );
};
export const DashboardCustom = withErrorBoundary(DashboardC);
