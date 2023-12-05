const URL = `${process.env.NEXT_PUBLIC_API_URL}/order`;

const getOrders = async (userId?: string): Promise<any[]> => {
    const res = await fetch(URL, { next: { revalidate: 0 } });

    return res.json();
};

export default getOrders;
