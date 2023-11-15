import type { NextApiRequest, NextApiResponse } from "next";

// Define a type for the successful response
type SuccessfulResponse = {
  amount: number;
};

// Define a type for the error response
type ErrorResponse = {
  error: string;
};

function getRandomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<SuccessfulResponse | ErrorResponse>) {
  // Retrieve wallet address from query parameters
  const walletAddress = req.query.walletAddress as string | undefined;

  // Check if wallet address is provided
  if (!walletAddress) {
    res.status(400).json({ error: "Missing wallet address" });
    return;
  }

  // Generate a random mint amount and return it
  const randomMintAmount = getRandomInteger(1, 1000);
  res.status(200).json({ amount: randomMintAmount });
}
