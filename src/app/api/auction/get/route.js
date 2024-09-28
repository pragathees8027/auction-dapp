import { dbConnect, Item } from "@/app/api/mongo";

// To retrieve auction items
export const GET = async (req) => {
    await dbConnect();
    try {
        const auctionItems = await Item.find({ available: true });
        if (auctionItems.length <= 0) {
            return new Response("No items to auction", { status: 401 });
        }

        return new Response(JSON.stringify(auctionItems), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response("Internal server error", { status: 500 });
    }
};
