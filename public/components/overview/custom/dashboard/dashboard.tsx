import React from 'react';
import { getPlugins } from '../../../../kibana-services';
import { I18nProvider } from '@osd/i18n/react';
import { withErrorBoundary } from '../../../common/hocs/error-boundary/with-error-boundary';

const Dashboard = () => {
  return (
    <I18nProvider>
      <div>
        <h1>Dashboard Custom</h1>
      </div>
    </I18nProvider>
  );
};
export const DashboardCustom = withErrorBoundary(Dashboard)  ;
