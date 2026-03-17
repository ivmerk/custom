import {tDataGridColumn} from  '../../../common/data-grid';
import {commonColumns} from '../../common/data-grid-columns';

export const customColumns: tDataGridColumn[] = [
  commonColumns.timestamp,
  commonColumns['data.dstip'],
  commonColumns['data.action'],
  commonColumns['rule.id'],
  commonColumns['data.user'],
];
