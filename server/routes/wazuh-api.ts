import { IRouter } from 'opensearch_dashboards/server';
import { WazuhApiCtrl } from '../controllers';
import { schema } from '@osd/config-schema';

export function WazuhApiRoutes(router: IRouter) {
  const ctrl = new WazuhApiCtrl();

}
