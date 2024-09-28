import { Item, dbConnect } from '../../mongo';
import { getOnGoingAuctionsNames, getOnGoingAuctionsData } from '../auction';

// export default async function handler(req, res) {
//     if (req.method === 'GET') {
//         try {
//             const auctionsData = await getOnGoingAuctionsData();
//             res.status(200).json(auctionsData);
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({ success: false, error: error.message });
//         }
//     } else {
//         res.setHeader('Allow', ['GET']);
//         res.status(405).end(`Method ${req.method} Not Allowed`);
//     }
// }

export const GET = async (req) => {
    await dbConnect();
    try {
        let ids = [];
        try {
            const auctions = await getOnGoingAuctionsNames();
            ids = auctions;
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: error.message });
        }

        let items = [];

        ids.forEach(async id => {
            const item = await Item.findOne({_id: ObjectId(id)});
            items.push({name: item.itemname, price: item.startprice});
        });

        if (items.length <= 0) {
            return new Response("No ongoing auctions", { status: 401 });
        }

        return new Response(JSON.stringify(items), { status: 200 });
    } catch (error) {
        return new Response("Internal server error", { status: 500 });
    }
}
