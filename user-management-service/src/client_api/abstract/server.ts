import { AbstractRouter } from "./router";

export interface AbstractServer {
  start(port: number): Promise<void>;
  dispose(): Promise<void>;
  connectRouters(userRouter: AbstractRouter): void;
}