import { tDataGridColumn } from '../../../common/data-grid';
import { commonColumns } from '../../common/data-grid-columns';

export const customColumns: tDataGridColumn[] = [
  commonColumns.timestamp,
  commonColumns['agent.name'],
  commonColumns['rule.level'],
  commonColumns['rule.id'],
  commonColumns['rule.description'],
];
