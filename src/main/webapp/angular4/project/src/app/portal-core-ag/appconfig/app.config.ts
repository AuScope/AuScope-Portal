import { InjectionToken } from '@angular/core';

export let APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export interface AppConfig {
  getCSWRecordUrl: string;
  TILE_SIZE: number
}



