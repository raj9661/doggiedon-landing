import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  message?: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  return res.status(200).json({ message: "Logged out successfully" })
} 