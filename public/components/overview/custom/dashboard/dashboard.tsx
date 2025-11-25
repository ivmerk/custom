import React from 'react';
import { getPlugins } from '../../../../kibana-services';
import { I18nProvider } from '@osd/i18n/react';
import { withErrorBoundary } from '../../../common/hocs/error-boundary/with-error-boundary';
import { DiscoverNoResults } from '../../../common/no-results/no-results';
import {
  AlertsDataSourceRepository,
  CustomDataSource,
  useDataSource
} from '../../../common/data-source';

const plugins = getPlugins();

const DashboardByRenderer = plugins.dashboard.DashboardContainerByValueRenderer;
  const DashboardC: React.FC = () => {
    const AlertsRepository = new AlertsDataSourceRepository();
  const {dataSource} = useDataSource({DataSource: CustomDataSource, repository: AlertsRepository});

  return (
    <I18nProvider>
      <div>
        <h1>Dashboard Custom</h1>
        <DiscoverNoResults />
      </div>
    </I18nProvider>
  );
};
export const DashboardCustom = withErrorBoundary(DashboardC);
