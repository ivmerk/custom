import {AlertsDataSource} from '../alerts-data-source';
import { tFilter } from '../../../types';

const GROUP_KEY = 'rule.groups.dlp';
const DATA_SOURCE_FILTER_CONTROLLED_CUSTOM_RULE = 'custom.rules';
export class CustomDataSource extends AlertsDataSource{
  constructor(id: string, title: string) {
    super(id, title);
  }

  getCustomRuleFilter() {
    return [
      {
        meta: {
          index: this.id,
          negate: false,
          disabled: false,
          alias: null,
          type: 'exists',
          key: GROUP_KEY,
          value: 'exists',
          params: {
            query: null,
            type: 'phrase',
          },
          controlledBy: DATA_SOURCE_FILTER_CONTROLLED_CUSTOM_RULE,
        },
        exists: {
          field: GROUP_KEY,
        },
        $state: {
          store: 'appState',
        },
      } as tFilter,
    ];
  }
  getFixedFilters(): tFilter[] {
    return [
      ...super.getFixedFiltersClusterManager(),
      ...this.getCustomRuleFilter(),
      ...super.getFixedFilters(),
    ];
  }
}
