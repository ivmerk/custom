import { commonInitialWidth } from './initial-width';

export const commonColumns = {
  timestamp: {
    id: 'timestamp',
    isSortable: true,
    defaultSortDirection: 'desc',
    initialWidth: commonInitialWidth.timestamp,
  },
  'agent.id': {
    id: 'agent.id',
    initialWidth: commonInitialWidth['agent.id'],
  },
  'agent.name': {
    id: 'agent.name',
    initialWidth: commonInitialWidth['agent.name'],
  },
  'rule.description': {
    id: 'rule.description',
  },
  'rule.level': {
    id: 'rule.level',
    initialWidth: commonInitialWidth['rule.level'],
  },
  'rule.id': {
    id: 'rule.id',
    initialWidth: commonInitialWidth['rule.id'],
  },
  'data.user': {
    id: 'data.user',
  },
  'data.action': {
    id: 'data.action',
  },
  'data.dstip': {
    id: 'data.dstip',
  },
} as const;
