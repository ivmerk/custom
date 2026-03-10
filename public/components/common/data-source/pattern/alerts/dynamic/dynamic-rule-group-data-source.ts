import { AlertsDataSource } from '../alerts-data-source';
import { tFilter } from '../../../types';

const GROUP_KEY = 'rule.groups';

/**
 * Factory that creates a DataSource class filtering alerts
 * by a given rule.groups value.
 */
export function createRuleGroupDataSource(ruleGroup: string) {
  const controlledBy = `dynamic.${ruleGroup}.rules`;

  return class DynamicRuleGroupDataSource extends AlertsDataSource {
    constructor(id: string, title: string) {
      super(id, title);
    }

    getRuleGroupFilter(): tFilter[] {
      return [
        {
          meta: {
            index: this.id,
            negate: false,
            disabled: false,
            alias: null,
            type: 'phrase',
            key: GROUP_KEY,
            value: ruleGroup,
            params: {
              query: ruleGroup,
              type: 'phrase',
            },
            controlledBy,
          },
          query: {
            match: {
              [GROUP_KEY]: {
                query: ruleGroup,
                type: 'phrase',
              },
            },
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
        ...this.getRuleGroupFilter(),
        ...super.getFixedFilters(),
      ];
    }
  };
}
