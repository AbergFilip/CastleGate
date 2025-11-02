import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:3000/api';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await axios.get(`${API_BASE.replace('/api', '')}/health`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Backend not accessible' });
  }
}

