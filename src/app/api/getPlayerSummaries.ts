//api/steam/getPlayerSummaries.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getPlayerSummaries } from '../services/steamService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { steamids } = req.query;
    if (!steamids) {
      return res.status(400).json({ error: 'steamids is required' });
    }
    const ids = Array.isArray(steamids) ? steamids : steamids.split(',');
    const players = await getPlayerSummaries(ids);
    return res.status(200).json({ players });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
