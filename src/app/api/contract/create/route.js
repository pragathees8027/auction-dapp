import { createAuction } from '../utils/contract';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { name, startingPrice } = req.body;

        try {
            const tx = await createAuction(name, startingPrice);
            res.status(200).json({ success: true, transaction: tx });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
