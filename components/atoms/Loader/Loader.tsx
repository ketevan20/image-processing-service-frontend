import React from 'react'

const Loader = () => {
  return (
    <div className="flex min-h-100 items-center justify-center">
      <div className="relative h-24 w-24">
        <div className="absolute inset-0 animate-[spin_4s_linear_infinite] rounded-[42%_58%_63%_37%/41%_44%_56%_59%] bg-linear-to-br from-pink-300 via-purple-300 to-blue-300 opacity-80 blur-[1px]" />

        <div className="absolute inset-3 animate-[spin_3s_linear_infinite_reverse] rounded-[58%_42%_37%_63%/55%_52%_48%_45%] bg-linear-to-tr from-purple-400 via-pink-300 to-orange-200 opacity-70 blur-[2px]" />

        <div className="absolute inset-0 animate-pulse rounded-full bg-pink-300/30 blur-2xl" />
      </div>
    </div>
  )
}

export default Loader