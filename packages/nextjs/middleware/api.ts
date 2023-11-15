import type { NextApiRequest, NextApiResponse } from "next";

// Define a type for the middleware function
export type MiddlewareFn = (req: NextApiRequest, res: NextApiResponse, next: (result: unknown) => void) => void;

// Helper method to enable CORS Requests
function runApiMiddleware(req: NextApiRequest, res: NextApiResponse, fn: MiddlewareFn): Promise<unknown> {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: unknown) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default runApiMiddleware;
