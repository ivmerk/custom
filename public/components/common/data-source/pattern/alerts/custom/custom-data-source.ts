import {AlertsDataSource} from '../alerts-data-source';
import { tFilter } from '../../../types';

const GROUP_KEY = 'rule.groups';
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
          type: 'phrase',
          key: GROUP_KEY,
          value: 'dlp',
          controlledBy: DATA_SOURCE_FILTER_CONTROLLED_CUSTOM_RULE,
        },
        query: {
          bool: {
            filter: [
              { term: { 'rule.groups': 'dlp' } },
              { exists: { 'field': 'rule.mitre.id' } }
            ]
          }
        },
        $state: {
          store: 'appState'
        }
      }
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
