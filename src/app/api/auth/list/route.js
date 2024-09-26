import { dbConnect, Item } from "@/app/api/mongo";

// To retrieve auction items
export const GET = async (req) => {
    await dbConnect();
    try {
        const { searchParams } = new URL(req.url);
        const itemowner = searchParams.get('itemowner');

        if (!itemowner) {
            return new Response("Missing item owner", { status: 400 });
        }

        // Find items based on itemowner
        const Items = await Item.find({ itemowner });
        
        if (Items.length <= 0) {
            return new Response("No items.", { status: 404 });
        }

        return new Response(JSON.stringify(Items), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response("Internal server error", { status: 500 });
    }
};
