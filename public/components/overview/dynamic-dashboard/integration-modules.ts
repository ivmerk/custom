/**
 * Registry of integration modules.
 * Each entry generates an OSD application and a module in ModulesDefaults.
 * To add a new integration, add an entry here — no other files need to change.
 */
export interface IntegrationModule {
  /** Unique identifier used in URL tab param and app id */
  id: string;
  /** Display title in sidebar and breadcrumbs */
  title: string;
  /** The rule.groups value to filter alerts by */
  ruleGroup: string;
  /** EUI icon type or React component for sidebar icon */
  euiIconType: string;
  /** Sidebar ordering (within the integrations category) */
  order: number;
}

export const integrationModules: IntegrationModule[] = [
  {
    id: 'scopd',
    title: 'Scopd',
    ruleGroup: 'scopd',
    euiIconType: 'indexRollupApp',
    order: 51,
  },
  {
    id: 'suricata',
    title: 'Suricata',
    ruleGroup: 'suricata',
    euiIconType: 'securityAnalyticsApp',
    order: 52,
  },
  {
    id: 'paloalto',
    title: 'Palo Alto',
    ruleGroup: 'paloalto',
    euiIconType: 'securityAnalyticsApp',
    order: 53,
  },
];
