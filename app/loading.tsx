import React from 'react'

export default function Loading() {
    return (
        <div className="flex justify-center items-center h-[80vh]">
            <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-sky-600"></div>
        </div>
    )
}
