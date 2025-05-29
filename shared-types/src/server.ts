export interface AbstractRequest<Body> {
  params: Record<string, string>;
  body: Body;
}

export interface AbstractResponse<Data, Error> {
  transformDataToJsonWithStatus: (status: number, data: Data) => void;
  transformErrorToJsonWithStatus: (status: number, error: Error) => void;
}

export interface AbstractRouter {
  connectRouter(connect: (router: any) => void): void;
}

export interface AbstractServer {
  start(port: number): Promise<void>;
  dispose(): Promise<void>;
  connectRouters(userRouter: AbstractRouter): void;
}
