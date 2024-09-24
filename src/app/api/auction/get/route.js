import { dbConnect } from "../../mongo";
import { Item } from "../../mongo";

// To retrieve auction items
export const POST = async (req) => {
    await dbConnect();
    try {
        // Check if the auction exists
        const auctionItems = await Item.find({ available: true });
        if (auctionItems.length <= 0) {
            return new Response("No items to auction.", { status: 401 });
        }

        return new Response(JSON.stringify(auctionItems), { status: 200 });
    } catch (error) {
        console.log(error)
        return new Response("Internal server error", { status: 500 });
    }
};
