import { endAuction } from '../auction';
import {dbConnect, Item} from '@/app/api/mongo'

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { itemId, username } = req.body;

        await dbConnect();
        const item = await Item.findOne({ _id: ObjectId(itemId)});

        if (item.itemowner != username) {
            return new Response("Only the item owner can end the auction", { status: 401 });
        }


        try {
            const tx = await endAuction(itemId);
            await Item.updateOne({ _id: ObjectId(itemId)}, { $set: { available: false }});
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
