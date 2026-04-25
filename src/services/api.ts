import axios from 'axios';
import type { CityIndex, CreateEvaluationDto, FeedItem, HistoryData, Neighborhood, Alert } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
});

export const getNeighborhoods = () =>
  api.get<Neighborhood[]>('/neighborhoods').then((r) => r.data);

export const getCityIndex = () =>
  api.get<CityIndex>('/evaluations/city-index').then((r) => r.data);

export const getFeed = (limit = 20, offset = 0) =>
  api.get<FeedItem[]>(`/feed?limit=${limit}&offset=${offset}`).then((r) => r.data);

export const getAlerts = () =>
  api.get<Alert[]>('/alerts/active').then((r) => r.data);

export const getHistory = (period: '24h' | '7d' | '30d', neighborhoodId?: string) =>
  api
    .get<HistoryData>(
      `/history?period=${period}${neighborhoodId ? `&neighborhoodId=${neighborhoodId}` : ''}`,
    )
    .then((r) => r.data);

export const createEvaluation = (dto: CreateEvaluationDto) =>
  api.post('/evaluations', dto).then((r) => r.data);
