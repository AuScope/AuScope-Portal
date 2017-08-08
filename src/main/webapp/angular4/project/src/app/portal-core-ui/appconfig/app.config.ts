import { InjectionToken } from '@angular/core';

export let APP_CONFIG = new InjectionToken<AppConfig>('app.config');

/**
 * Configuration for the application.
 */
export interface AppConfig {
  getCSWRecordUrl: string;
}



