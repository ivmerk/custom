import { DashboardPanelState } from '../../../../../../../src/plugins/dashboard/public/application';
import { EmbeddableInput } from '../../../../../../../src/plugins/embeddable/public';

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

const buildSearchSourceAndRefs = (indexPatternId: string) => ({
  searchSource: {
    query: { language: 'kuery', query: '' },
    filter: [],
    index: indexPatternId,
  },
  references: [
    {
      name: 'kibanaSavedObjectMeta.searchSourceJSON.index',
      type: 'index-pattern',
      id: indexPatternId,
    },
  ],
});

const countAgg = (schema = 'metric', customLabel?: string) => ({
  id: '1',
  enabled: true,
  type: 'count',
  schema,
  params: customLabel ? { customLabel } : {},
});

const termsAgg = (
  id: string,
  field: string,
  schema: string,
  size: number,
  customLabel?: string
) => ({
  id,
  enabled: true,
  type: 'terms',
  schema,
  params: {
    field,
    size,
    order: 'desc',
    orderBy: '1',
    otherBucket: false,
    otherBucketLabel: 'Other',
    missingBucket: false,
    missingBucketLabel: 'Missing',
    ...(customLabel ? { customLabel } : {}),
  },
});

const dateHistogramAgg = (
  id: string,
  schema: string,
  timeRange: { from: string; to: string; mode?: string },
  opts: { useNormalizedOpenSearchInterval?: boolean; customLabel?: string } = {}
) => ({
  id,
  enabled: true,
  type: 'date_histogram',
  schema,
  params: {
    field: 'timestamp',
    timeRange,
    useNormalizedOpenSearchInterval: opts.useNormalizedOpenSearchInterval ?? true,
    scaleMetricValues: false,
    interval: 'auto',
    drop_partials: false,
    min_doc_count: 1,
    extended_bounds: {},
    ...(opts.customLabel ? { customLabel: opts.customLabel } : {}),
  },
});

const PIE_PARAMS = {
  type: 'pie' as const,
  addTooltip: true,
  addLegend: true,
  legendPosition: 'right',
  isDonut: true,
  labels: {
    show: false,
    values: true,
    last_level: true,
    truncate: 100,
  },
};

// ---------------------------------------------------------------------------
// Visualization state builders
// ---------------------------------------------------------------------------

const getVisStatePie = (indexPatternId: string, id: string, title: string, field: string) => ({
  id,
  title,
  type: 'pie',
  params: PIE_PARAMS,
  uiState: {},
  data: {
    ...buildSearchSourceAndRefs(indexPatternId),
    aggs: [countAgg(), termsAgg('2', field, 'segment', 5)],
  },
});

const getVisStateAlertsEvolutionOverTime = (indexPatternId: string, ruleGroup: string) => ({
  id: `dynamic-alerts-evolution-${ruleGroup}`,
  title: 'Alerts evolution over time',
  type: 'histogram',
  params: {
    type: 'histogram',
    grid: { categoryLines: false },
    categoryAxes: [
      {
        id: 'CategoryAxis-1',
        type: 'category',
        position: 'bottom',
        show: true,
        style: {},
        scale: { type: 'linear' },
        labels: { show: true, filter: true, truncate: 100 },
        title: {},
      },
    ],
    valueAxes: [
      {
        id: 'ValueAxis-1',
        name: 'LeftAxis-1',
        type: 'value',
        position: 'left',
        show: true,
        style: {},
        scale: { type: 'linear', mode: 'normal' },
        labels: { show: true, rotate: 0, filter: false, truncate: 100 },
        title: { text: 'Count' },
      },
    ],
    seriesParams: [
      {
        show: true,
        type: 'histogram',
        mode: 'stacked',
        data: { label: 'Count', id: '1' },
        valueAxis: 'ValueAxis-1',
        drawLinesBetweenPoints: true,
        lineWidth: 2,
        showCircles: true,
      },
    ],
    addTooltip: true,
    addLegend: true,
    legendPosition: 'right',
    times: [],
    addTimeMarker: false,
    labels: { show: false },
    thresholdLine: {
      show: false,
      value: 10,
      width: 1,
      style: 'full',
      color: '#E7664C',
    },
  },
  uiState: {},
  data: {
    ...buildSearchSourceAndRefs(indexPatternId),
    aggs: [
      countAgg(),
      termsAgg('3', 'agent.name.keyword', 'group', 5),
      dateHistogramAgg('2', 'segment', { from: 'now-7d', to: 'now' }),
    ],
  },
});

const getVisStateAgentAlertsOverTime = (indexPatternId: string, ruleGroup: string) => ({
  id: `dynamic-agent-alerts-over-time-${ruleGroup}`,
  title: 'Alerts evolution over time',
  type: 'area',
  params: {
    type: 'area',
    grid: {
      categoryLines: true,
      style: { color: '#eee' },
      valueAxis: 'ValueAxis-1',
    },
    categoryAxes: [
      {
        id: 'CategoryAxis-1',
        type: 'category',
        position: 'bottom',
        show: true,
        style: {},
        scale: { type: 'linear' },
        labels: { show: true, filter: true, truncate: 100 },
        title: {},
      },
    ],
    valueAxes: [
      {
        id: 'ValueAxis-1',
        name: 'LeftAxis-1',
        type: 'value',
        position: 'left',
        show: true,
        style: {},
        scale: { type: 'linear', mode: 'normal' },
        labels: { show: true, rotate: 0, filter: false, truncate: 100 },
        title: { text: 'Events' },
      },
    ],
    seriesParams: [
      {
        show: 'true',
        type: 'area',
        mode: 'stacked',
        data: { label: 'Events', id: '1' },
        drawLinesBetweenPoints: true,
        showCircles: true,
        interpolate: 'cardinal',
        valueAxis: 'ValueAxis-1',
      },
    ],
    addTooltip: true,
    addLegend: true,
    legendPosition: 'right',
    times: [],
    addTimeMarker: false,
  },
  uiState: {},
  data: {
    ...buildSearchSourceAndRefs(indexPatternId),
    aggs: [
      countAgg('metric', 'Events'),
      termsAgg('3', 'rule.description.keyword', 'group', 10, 'Rule'),
      dateHistogramAgg('2', 'segment', {
        from: 'now-1h',
        to: 'now',
        mode: 'quick',
      }),
    ],
  },
});

const getVisStateEventsTable = (indexPatternId: string, ruleGroup: string) => ({
  id: `dynamic-events-table-${ruleGroup}`,
  title: 'Events',
  type: 'table',
  params: {
    perPage: 10,
    showPartialRows: false,
    showMetricsAtAllLevels: false,
    showTotal: false,
    totalFunc: 'sum',
    percentageCol: '',
  },
  uiState: {},
  data: {
    ...buildSearchSourceAndRefs(indexPatternId),
    aggs: [
      countAgg(),
      dateHistogramAgg('2', 'bucket', { from: 'now-1M', to: 'now' }, { customLabel: 'timestamp' }),
      termsAgg('3', 'agent.name.keyword', 'bucket', 5, 'agent.name'),
      termsAgg('4', 'rule.description.keyword', 'bucket', 5, 'rule.description'),
      termsAgg('5', 'rule.level', 'bucket', 5, 'rule.level'),
      termsAgg('6', 'rule.id.keyword', 'bucket', 5, 'rule.id'),
      termsAgg('7', 'rule.groups.keyword', 'bucket', 5, 'rule.groups'),
    ],
  },
});

// ---------------------------------------------------------------------------
// Panel builder helper
// ---------------------------------------------------------------------------

const panel = (
  id: string,
  x: number,
  y: number,
  w: number,
  h: number,
  savedVis: ReturnType<typeof getVisStatePie>
) => ({
  gridData: { w, h, x, y, i: id },
  type: 'visualization',
  explicitInput: { id, savedVis },
});

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const getDashboardPanels = (
  indexPatternId: string,
  ruleGroup: string,
  pinnedAgent?: boolean
): {
  [panelId: string]: DashboardPanelState<EmbeddableInput & { [k: string]: unknown }>;
} => {
  if (pinnedAgent) {
    return {
      a1: panel(
        'a1',
        0,
        0,
        12,
        10,
        getVisStatePie(
          indexPatternId,
          `dynamic-agent-top-rule-descriptions-${ruleGroup}`,
          'Top 5 rule descriptions',
          'rule.description.keyword'
        )
      ),
      a2: panel(
        'a2',
        12,
        0,
        12,
        10,
        getVisStatePie(
          indexPatternId,
          `dynamic-agent-top-rule-levels-${ruleGroup}`,
          'Top 5 rule levels',
          'rule.level'
        )
      ),
      a3: panel('a3', 24, 0, 24, 10, getVisStateAgentAlertsOverTime(indexPatternId, ruleGroup)),
      a4: panel('a4', 0, 10, 48, 18, getVisStateEventsTable(indexPatternId, ruleGroup)),
    };
  }

  return {
    g1: panel(
      'g1',
      0,
      0,
      16,
      10,
      getVisStatePie(
        indexPatternId,
        `dynamic-top-rule-descriptions-${ruleGroup}`,
        'Top 5 rule descriptions',
        'rule.description.keyword'
      )
    ),
    g2: panel(
      'g2',
      16,
      0,
      16,
      10,
      getVisStatePie(
        indexPatternId,
        `dynamic-top-rule-levels-${ruleGroup}`,
        'Top 5 rule levels',
        'rule.level'
      )
    ),
    g3: panel('g3', 32, 0, 16, 10, getVisStateAlertsEvolutionOverTime(indexPatternId, ruleGroup)),
    g4: panel('g4', 0, 10, 48, 18, getVisStateEventsTable(indexPatternId, ruleGroup)),
  };
};
