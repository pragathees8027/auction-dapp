import { dbConnect } from "../../mongo";
import { User } from "../../mongo";
import bcrypt from 'bcrypt'; 

// To Create a new user
export const POST = async (req) => {
    await dbConnect();
    try {
        const { username, password } = await req.json();
        console.log(username, password);

        if (!username || !password) {
            return new Response("Missing username or password", { status: 401 });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return new Response("username already taken", { status: 401 });
        }

        // Hash the password before saving it to the database
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user
        const user = await User.create({
            username: username,
            password: hashedPassword,
        });

        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error) {
        console.log(error)
        return new Response("Internal server error", { status: 500 });
    }
};
