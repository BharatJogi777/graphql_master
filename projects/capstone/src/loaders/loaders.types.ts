import { RequestLoaders } from './loaders';

export interface GraphqlContext {
  req: unknown;
  res: unknown;
  loaders: RequestLoaders;
}
