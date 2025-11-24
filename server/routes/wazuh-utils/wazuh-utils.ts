/*
 * Wazuh app - Module for Wazuh utils routes
 * Copyright (C) 2015-2022 Wazuh, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
import { WazuhUtilsCtrl } from '../../controllers';
import { IRouter } from 'opensearch_dashboards/server';
import { schema } from '@osd/config-schema';
import {
  CUSTOMIZATION_ENDPOINT_PAYLOAD_UPLOAD_CUSTOM_FILE_MAXIMUM_BYTES,
  EpluginSettingType,
} from '../../../common/constants';

export function WazuhUtilsRoutes(router: IRouter, services) {
  const ctrl = new WazuhUtilsCtrl();

}
