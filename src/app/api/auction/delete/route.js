import { dbConnect, Item } from "@/app/api/mongo";

// To delete an item
export const GET = async (req) => {
    await dbConnect();
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        // Delete item
        const result = await Item.deleteOne({_id: id});
        if (!result.deletedCount > 0) {
            return new Response("Failed to delete item", { status: 401 });
        }

        return new Response(JSON.stringify(result), { status: 200 });
    } catch (error) {
        return new Response("Internal server error", { status: 500 });
    }
};