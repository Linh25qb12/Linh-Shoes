'use client';

import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form"

export default function RegisterPage() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const storeId = apiUrl?.split('/')[4];
    const {
        register,
        formState: { errors },
        handleSubmit
    } = useForm<any>()

    const router = useRouter();
    const onSubmit: SubmitHandler<any> = async (data) => {
        try {
            const response = await fetch('api/auth/register', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...data, storeId: storeId }),
            });

            await response.json();
            const loginResonse = await fetch('api/auth/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await loginResonse.json();

            if(result.status === 'success') {
                
                router.push('/');
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="antialiased bg-gray-200 text-gray-900 font-sans">
            <div className="flex items-center h-screen w-full">
                <div className="w-full bg-white rounded shadow-lg p-8 m-4 md:max-w-sm md:mx-auto">
                    <span className="block w-full text-xl uppercase font-bold mb-4">Register</span>
                    <form className="mb-4" onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4 md:w-full">
                            <label htmlFor="name" className="block text-sm mb-1">Name</label>
                            <input
                                className="w-full border rounded p-2 outline-none focus:shadow-outline"
                                aria-invalid={errors.name ? "true" : "false"}
                                type="name"
                                {...register("name")}
                                placeholder="Name"
                            />
                        </div>
                        <div className="mb-4 md:w-full">
                            <label htmlFor="email" className="block text-sm mb-1">Email *</label>
                            <input
                                className="w-full border rounded p-2 outline-none focus:shadow-outline"
                                aria-invalid={errors.email ? "true" : "false"}
                                type="email"
                                {...register("email", { required: true })}
                                placeholder="Email"
                            />
                            {errors.email?.type === "required" && (
                                <p role="alert" style={{ fontSize: 12, color: 'red', paddingTop: 5 }}>Email is required</p>
                            )}
                        </div>
                        <div className="mb-6 md:w-full">
                            <label htmlFor="password" className="block text-sm mb-1">Password *</label>
                            <input
                                className="w-full border rounded p-2 outline-none focus:shadow-outline"
                                type="password"
                                {...register("password", { required: true })}
                                aria-invalid={errors.password ? "true" : "false"}
                                placeholder="Password"
                            />
                            {errors.password?.type === "required" && (
                                <p role="alert" style={{ fontSize: 12, color: 'red', paddingTop: 5 }}>Password is required</p>
                            )}
                        </div>
                        <div className="flex justify-between">
                            <button onClick={() => router.push('/')} className="bg-white text-blue-400 text-sm rounded">Back to Home page</button>
                            <input value='Submit' type="submit" className="bg-green-500 hover:bg-green-700 text-white uppercase text-sm font-semibold px-4 py-2 rounded" />
                        </div>
                        <button className="bg-white py-2 text-black text-sm rounded">Already have account? Login <span onClick={() => router.push('/login')} className="text-blue-400 text-sm">here.</span></button>
                    </form>
                </div>
            </div>
        </div>
    )
};