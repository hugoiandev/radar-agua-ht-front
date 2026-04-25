export type WaterStatus = 'boa' | 'atencao' | 'critica';

export interface Neighborhood {
  id: string;
  name: string;
  slug: string;
  index: number | null;
  status: WaterStatus | null;
  totalEvaluations: number;
}

export interface CityIndex {
  index: number | null;
  status: WaterStatus | null;
  totalEvaluations: number;
}

export interface FeedItem {
  id: string;
  odor: number;
  color: number;
  taste: number;
  tags: string[];
  comment: string | null;
  createdAt: string;
  avgIndex: number;
  neighborhood: { id: string; name: string; slug: string };
}

export interface Alert {
  id: string;
  message: string;
  triggeredAt: string;
  neighborhood: { name: string; slug: string };
}

export interface HistoryPoint {
  time: string;
  index: number;
  count: number;
}

export interface HistoryData {
  period: string;
  points: HistoryPoint[];
  trend: 'melhora' | 'piora' | 'estavel';
  totalEvaluations: number;
}

export interface CreateEvaluationDto {
  neighborhoodId: string;
  odor: number;
  color: number;
  taste: number;
  tags: string[];
  comment?: string;
  recaptchaToken: string;
}
