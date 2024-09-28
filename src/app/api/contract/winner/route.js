import { getAuctionWinner } from '../auction';

export default async function handler(req, res) {
    const { itemId } = req.query;

    if (req.method === 'GET') {
        try {
            const winnerData = await getAuctionWinner(itemId);
            res.status(200).json(winnerData);
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
