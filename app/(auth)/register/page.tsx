'use client'
import { schema } from '@/validators/auth'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

const page = () => {
    const router = useRouter();

    const [error, setError] = useState("")

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(schema)
    })

    const onSubmit = async (values: any) => {
        setError("")
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.message ?? 'Something went wrong')
                return
            }

            router.push('/studio')
            router.refresh()
        } catch (err) {
            setError("Network error, please try again")
        }
    }

    return (
        <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-3">
                Get started
            </p>

            <h1 className="font-serif italic text-4xl leading-tight text-white mb-2">
                Begin metamorphosis
            </h1>

            <p className="text-sm text-gray-400 mb-10">
                Create an account to start transforming images.
            </p>

            {error && (
                <p className="mb-6 text-sm text-rose-400 border border-rose-400/30 bg-rose-400/5 px-4 py-3">
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">
                        Username
                    </label>
                    <input
                        type="text"
                        placeholder="user1"
                        disabled={isSubmitting}
                        {...register("username")}
                        className="w-full bg-transparent border-b border-white/20 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-400 transition-colors disabled:opacity-50"
                    />
                    {errors.username?.message ? (
                        <p className="mt-2 text-xs text-rose-400">{errors.username?.message}</p>
                    ) : (<p className="mt-2 text-xs text-transparent">&nbsp;</p>)}
                </div>

                <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        disabled={isSubmitting}
                        {...register("password")}
                        className="w-full bg-transparent border-b border-white/20 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-400 transition-colors disabled:opacity-50"
                    />
                    {errors.password?.message ? (
                        <p className="mt-2 text-xs text-rose-400">{errors.password?.message}</p>
                    ) : (<p className="mt-2 text-xs text-transparent">&nbsp;</p>)}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group mt-4 inline-flex items-center justify-center gap-3 px-7 py-3.5 text-xs uppercase tracking-[0.2em] border border-purple-400/60 hover:bg-purple-400 hover:text-black transition-colors duration-300 disabled:opacity-50 disabled:pointer-events-none disabled:hover:bg-transparent disabled:hover:text-white"
                >
                    {isSubmitting ? (
                        <>
                            <span className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />
                            Creating account
                        </>
                    ) : (
                        <>
                            Create account
                            <span className="transition-transform duration-300 group-hover:translate-x-1">
                                →
                            </span>
                        </>
                    )}
                </button>
            </form>

            <p className="mt-10 text-sm text-gray-500">
                Already have an account?{" "}
                <a href="/login" className="text-white underline underline-offset-4 hover:text-purple-300 transition-colors">
                    Log in
                </a>
            </p>
        </div>
    )
}

export default page