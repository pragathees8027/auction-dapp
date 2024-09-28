import { dbConnect } from "../../mongo";
import { Item } from "../../mongo";

// To Create a new item
export const POST = async (req) => {
    await dbConnect();
    try {
        const { itemname, itemprice, startdate, starttime, itemowner } = await req.json();

        if (!itemname || !itemprice || !startdate || !starttime || !itemowner) {
            return new Response("Missing fields, please fill all the fields", { status: 401 });
        }

        if (itemprice <= 0) {
            return new Response("Price cannot be zero", { status: 401 });
        }

        // Check if the item already exists
        const existinItem = await Item.findOne({ itemname: itemname, itemowner: itemowner, available: true });
        if (existinItem) {
            return new Response("Item already registered", { status: 401 });
        }
        
        const dateTime = new Date(`${startdate}T${starttime}`);

        if (isNaN(dateTime.getDate())) {
            return new Response("Invalid date or time", { status: 400 });
        }
      

        // Create a new item
        const item = await Item.create({
            itemname: itemname,
            itemprice: itemprice,
            datetime: dateTime,
            itemowner: itemowner,
            available: true,
        });
        
        return new Response(JSON.stringify(item), { status: 200 });
    } catch (error) {
        console.log(error)
        return new Response("Internal server error", { status: 500 });
    }
};
