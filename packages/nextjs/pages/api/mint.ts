import Cors from "cors";
import type { NextApiRequest, NextApiResponse } from "next";

// Initialize the cors middleware
const cors = Cors({
  methods: ["GET", "HEAD", "POST"], // Adjust methods according to your needs
  origin: "*", // This allows all origins. Adjust as needed for security.
});

// Define a type for the middleware function
type MiddlewareFn = (req: NextApiRequest, res: NextApiResponse, next: (result: unknown) => void) => void;

// Helper method to enable CORS Requests
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: MiddlewareFn): Promise<unknown> {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: unknown) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// Define a type for the mint data structure
type Mint = {
  address: string;
  amount: number;
};

function getRandomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Mint[]>) {
  // Run the middleware
  await runMiddleware(req, res, cors);
  // Hardcoded data representing random mints
  const randomMints = [
    { address: "0xc455Bc958a7a85F8b8bE0FE724C7bE2C6461C5f0", amount: getRandomInteger(1, 1000) },
    { address: "0xC10159052889Eec241187dEbf10d77A0a57De656", amount: getRandomInteger(1, 1000) },
    { address: "0x2fC444C618bBd17EDa2F289b501B32f96BF7f6EB", amount: getRandomInteger(1, 1000) },
  ];

  // Return the array of random mints
  res.status(200).json(randomMints);
}
