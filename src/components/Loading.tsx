import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-r from-violet-100 to-pink-100 dark:from-violet-950/40 dark:to-pink-950/40 z-50">
      <div className="relative">
        {/* Animated elements */}
        <div className="absolute -top-20 -left-20 w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 dark:from-purple-500 dark:to-pink-500 opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-16 -right-16 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 dark:from-yellow-400 dark:to-orange-500 opacity-70 animate-pulse delay-200"></div>

        {/* Modern film reel */}
        <div className="absolute -top-12 left-10 w-8 h-8">
          <div className="w-full h-full border-4 border-violet-400 dark:border-violet-500 rounded-full animate-spin-slow">
            <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-violet-500 dark:bg-violet-400 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>

        <div className="w-40 h-40 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden relative">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 left-2 w-3 h-3 bg-pink-500 rounded-full"></div>
            <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="absolute bottom-3 left-5 w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="absolute bottom-5 right-3 w-3 h-3 bg-green-500 rounded-full"></div>
          </div>

          {/* Modern character */}
          <div className="relative w-28 h-28">
            {/* Face */}
            <div className="w-28 h-28 bg-gradient-to-br from-yellow-200 to-yellow-300 dark:from-yellow-300 dark:to-yellow-400 rounded-full shadow-inner"></div>

            {/* Sunglasses */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-20 h-7">
              <div className="absolute top-0 left-0 w-9 h-7 bg-black rounded-full"></div>
              <div className="absolute top-0 right-0 w-9 h-7 bg-black rounded-full"></div>
              <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-black"></div>
              <div className="absolute top-0 left-0 w-3 h-1 bg-black rotate-12 translate-x-1"></div>
              <div className="absolute top-0 right-0 w-3 h-1 bg-black -rotate-12 -translate-x-1"></div>

              {/* Reflection */}
              <div className="absolute top-1 left-2 w-4 h-1 bg-white opacity-50 rotate-45"></div>
              <div className="absolute top-1 right-2 w-4 h-1 bg-white opacity-50 -rotate-45"></div>
            </div>

            {/* Headphones */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-4">
              <div className="absolute top-0 left-0 w-4 h-8 bg-pink-500 dark:bg-pink-400 rounded-full"></div>
              <div className="absolute top-0 right-0 w-4 h-8 bg-pink-500 dark:bg-pink-400 rounded-full"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-3 bg-pink-500 dark:bg-pink-400 rounded-full"></div>
            </div>

            {/* Mouth */}
            <div className="absolute bottom-7 left-1/2 transform -translate-x-1/2 w-8 h-3">
              <div className="w-full h-full border-b-3 border-black rounded-b-full"></div>
            </div>

            {/* Blush */}
            <div className="absolute bottom-9 left-4 w-3 h-2 bg-pink-400 rounded-full opacity-60"></div>
            <div className="absolute bottom-9 right-4 w-3 h-2 bg-pink-400 rounded-full opacity-60"></div>
          </div>
        </div>

        {/* Modern popcorn */}
        <div className="absolute -bottom-10 -right-14">
          <div className="w-16 h-14 bg-gradient-to-b from-pink-500 to-pink-600 dark:from-pink-600 dark:to-pink-700 rounded-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-3 bg-white dark:bg-gray-200 flex">
              <div className="w-1/2 h-full border-b-2 border-r-2 border-pink-700"></div>
              <div className="w-1/2 h-full border-b-2 border-pink-700"></div>
            </div>

            {/* Popcorn pieces */}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white dark:bg-gray-200 rounded-full animate-float"></div>
            <div className="absolute -top-3 left-1/4 transform -translate-x-1/2 w-3 h-3 bg-white dark:bg-gray-200 rounded-full animate-float-delay-1"></div>
            <div className="absolute -top-2 right-1/4 transform -translate-x-1/2 w-3 h-3 bg-white dark:bg-gray-200 rounded-full animate-float-delay-2"></div>
          </div>
        </div>

        {/* Coffee cup - trendy Gen Z element */}
        <div className="absolute -bottom-8 -left-12">
          <div className="w-10 h-12 bg-gradient-to-b from-teal-400 to-teal-500 dark:from-teal-500 dark:to-teal-600 rounded-b-lg relative">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-teal-300 dark:bg-teal-400 rounded-t-lg"></div>
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white opacity-30 rounded"></div>
            <div className="absolute top-3 right-0 transform translate-x-3 w-4 h-6 border-2 border-teal-400 dark:border-teal-500 rounded-r-full"></div>

            {/* Steam */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-white dark:bg-gray-300 opacity-70 rounded-full animate-steam"></div>
            <div className="absolute -top-4 left-1/3 transform -translate-x-1/2 w-1 h-2 bg-white dark:bg-gray-300 opacity-70 rounded-full animate-steam-delay-1"></div>
            <div className="absolute -top-3 right-1/3 transform translate-x-1/2 w-1 h-2 bg-white dark:bg-gray-300 opacity-70 rounded-full animate-steam-delay-2"></div>
          </div>
        </div>
      </div>

      <div className="mt-16 flex flex-col items-center">
        <h3 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 dark:from-violet-400 dark:to-pink-400 bg-clip-text text-transparent mb-2">
          Đang tải phim...
        </h3>
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-violet-600 dark:text-violet-400" />
          <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Chờ xíu nha, sắp xong rồi đó</p>
        </div>
      </div>
    </div>
  )
}
