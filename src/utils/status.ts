import type { WaterStatus } from '../types';

export function calcStatus(avg: number): WaterStatus {
  if (avg >= 4) return 'boa';
  if (avg >= 2.5) return 'atencao';
  return 'critica';
}
