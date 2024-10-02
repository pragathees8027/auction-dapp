import { dbConnect, Item } from '@/app/api/mongo';

export const GET = async (req) => {
    await dbConnect();
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const winner = searchParams.get('winner');
        const bid = searchParams.get('bid');

        console.log('ping: ', {
            winner: winner,
            bid: bid,
            id: id
        });

        const setFalse = false;
        
        // Use updateOne instead of deleteOne
        const result = await Item.updateOne(
            { _id: id },
            { $set: { available: setFalse, winner: winner, bid: bid } }
        );

        console.log(result);

        // Check if any documents were modified
        if (!result.modifiedCount > 0) {
            return new Response("Error updating item data or item not found", { status: 400 });
        }

        return new Response(JSON.stringify(result), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response("Internal server error", { status: 500 });
    }
};
