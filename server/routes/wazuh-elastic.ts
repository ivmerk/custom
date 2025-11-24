/*
 * Wazuh app - Module for Wazuh-Elastic routes
 * Copyright (C) 2015-2022 Wazuh, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
import { WazuhElasticCtrl } from '../controllers';
import { IRouter } from 'opensearch_dashboards/server';
import { schema } from '@osd/config-schema';
import {
  WAZUH_SAMPLE_ALERTS_CATEGORY_SECURITY,
  WAZUH_SAMPLE_ALERTS_CATEGORY_AUDITING_POLICY_MONITORING,
  WAZUH_SAMPLE_ALERTS_CATEGORY_THREAT_DETECTION,
} from '../../common/constants';

export function WazuhElasticRoutes(router: IRouter) {

}
