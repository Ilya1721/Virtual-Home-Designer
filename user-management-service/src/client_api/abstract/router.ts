export interface AbstractRouter {
  connectRouter(connect: (router: any) => void): void;
}