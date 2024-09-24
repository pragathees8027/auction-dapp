import { dbConnect } from "../../mongo";
import { User } from "../../mongo";
import bcrypt from 'bcrypt'; 

// To Authenticate the user
export const POST = async (req) => {
    await dbConnect();
    try {
        const { username, password } = await req.json();
        console.log(username, password);

        if (!username || !password) {
            return new Response("Missing username or password", { status: 401 });
        }

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return new Response("Invalid username or password", { status: 401 });
        }

        // Compare password with the stored hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return new Response("Invalid username or password", { status: 401 });
        }

        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error) {
        return new Response("Internal server error", { status: 500 });
    }
};
