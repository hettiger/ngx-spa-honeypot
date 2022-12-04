import { InjectionToken } from '@angular/core';

type TokenRoutePath = string;

export interface SpaHoneypotConfig {

  /**
   * The »Domain« <=> »Token Route Path« Map
   *
   * Provides `spa-honeypot.token_route_path` config values used by different API domains.
   * If an API sticks to the default `token_route_path` value it can be omitted.
   */
  domainTokenRoutePathMap?: { [domain: string]: TokenRoutePath };

}

export const SPA_HONEYPOT_CONFIG = new InjectionToken<SpaHoneypotConfig>('mh.spa.honeypot.config');
