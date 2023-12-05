import { User } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/user`;

const getUser = async (email: string): Promise<User> => {
    const res = await fetch(`${URL}?email=${email}`);

    return res.json();
};

export default getUser;
