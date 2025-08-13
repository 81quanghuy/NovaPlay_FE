import { Film, Popcorn, Clapperboard, Home, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/Button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="container flex max-w-md flex-col items-center justify-center gap-6 px-4 py-16 text-center md:py-24">
        {/* Animated cinema icons */}
        <div className="relative">
          <div className="absolute -left-8 -top-8" style={{ animation: "pulse 2s infinite" }}>
            <Film className="h-12 w-12 text-red-500" />
          </div>
          <div className="absolute -right-8 -top-6" style={{ animation: "bounce 2s infinite" }}>
            <Popcorn className="h-10 w-10 text-yellow-400" />
          </div>
          <Clapperboard
            className="h-32 w-32 text-white"
            strokeWidth={1.25}
            style={{ animation: "wiggle 4s ease-in-out infinite" }}
          />
        </div>

        {/* 404 heading */}
        <h1 className="text-6xl font-bold tracking-tighter sm:text-7xl">
          4<span className="text-red-500">0</span>4
        </h1>

        <h2 className="text-2xl font-semibold tracking-tight">Không tìm thấy trang</h2>

        <p className="text-gray-400">
          Có vẻ như cuộn phim này đã mất. Trang bạn đang tìm hiện không tồn tại hoặc đã được di chuyển.
        </p>

        {/* Navigation buttons */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Link to="/">
            <Button className="flex items-center gap-2 bg-red-600 px-4 py-2 text-white hover:bg-red-700">
              <Home className="h-4 w-4" />
              Về trang chủ
            </Button>
          </Link>
          <Link to="/movies">
            <Button className="flex items-center gap-2 border border-gray-700 bg-transparent px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Xem phim
            </Button>
          </Link>
        </div>

        {/* Decorative dots */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="h-2 w-2 rounded-full bg-red-500"></div>
          <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
        </div>
      </div>

    </div>
  )
}
