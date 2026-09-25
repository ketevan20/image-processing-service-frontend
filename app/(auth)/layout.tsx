import React from 'react'

const layout = ({ children }: LayoutProps<"/">) => {
    return (
        <div className="relative min-h-screen w-full flex text-white overflow-hidden">
            <img
                src="/auth-visual.jpg"
                alt=""
                className="absolute inset-0 w-full h-full object-cover -z-20"
            />

            <div className="absolute inset-0 bg-black/80 lg:bg-black/0 -z-10" />

            <div className="relative flex-1 flex items-center justify-center p-6 md:p-10 lg:bg-black">
                <div className="w-full max-w-sm">
                    {children}
                </div>
            </div>

            <div className="hidden lg:block w-[46%] relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-transparent" />

                <div className="absolute bottom-16 left-10 right-10">
                    <p className="font-serif italic text-3xl leading-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
                        Every image,
                        <br />
                        in transformation.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default layout