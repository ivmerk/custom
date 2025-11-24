/*
 * Wazuh app - Module for Wazuh reporting routes
 * Copyright (C) 2015-2022 Wazuh, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
import { WazuhReportingCtrl } from '../controllers';
import { IRouter } from 'opensearch_dashboards/server';
import { schema } from '@osd/config-schema';

export function WazuhReportingRoutes(router: IRouter) {
  const ctrl = new WazuhReportingCtrl();
}
