import { dbConnect } from "../auth/mongo";
import { Item } from "../auth/mongo";

// To retrieve auction items
export const POST = async (req) => {
    await dbConnect();
    try {
        const { itemowner } = await req.json();

        // Check if item exists
        const Items = await Item.find({ itemowner: itemowner });
        
        if (Items.length <= 0) {
            return new Response("No items.", { status: 401 });
        }

        return new Response(JSON.stringify(Items), { status: 200 });
    } catch (error) {
        console.log(error)
        return new Response("Internal server error", { status: 500 });
    }
};
