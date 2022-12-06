import { Request, Response } from "express";

// import { ExecutionParams } from 'subscriptions-transport-ws'

// interface CustomExecutionParams extends ExecutionParams {
//   context: {
//     accountId?: string | number
//   }
// }

export interface Context {
  req: Request;
  res: Response;
}
