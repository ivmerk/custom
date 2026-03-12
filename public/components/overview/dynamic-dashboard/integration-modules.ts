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
  /** Hide from the navigation sidebar (app still accessible via URL) */
  hidden?: boolean;
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
    id: 'cisco-ios',
    title: 'Cisco Routers / Cisco Switches',
    ruleGroup: 'cisco_ios',
    euiIconType: 'securityAnalyticsApp',
    order: 52,
    hidden: true,
  },
  {
    id: 'cisco-ftd',
    title: 'Cisco Firepower',
    ruleGroup: 'cisco_ftd',
    euiIconType: 'securityAnalyticsApp',
    order: 53,
    hidden: true,
  },
  {
    id: 'cisco-asa',
    title: 'Cisco ASA',
    ruleGroup: 'cisco_asa',
    euiIconType: 'securityAnalyticsApp',
    order: 54,
    hidden: true,
  },
  {
    id: 'junos',
    title: 'Juniper Security Gateways',
    ruleGroup: 'junos',
    euiIconType: 'securityAnalyticsApp',
    order: 55,
    hidden: true,
  },
  {
    id: 'paloalto',
    title: 'Palo Alto Networks NGFW',
    ruleGroup: 'paloalto',
    euiIconType: 'securityAnalyticsApp',
    order: 56,
    hidden: true,
  },
  {
    id: 'fortigate',
    title: 'FortiGate NGFW',
    ruleGroup: 'fortigate',
    euiIconType: 'securityAnalyticsApp',
    order: 57,
    hidden: true,
  },
];
