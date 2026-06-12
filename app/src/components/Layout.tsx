import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  return (
    <div className="min-h-[100dvh] bg-warm-cream">
      <Navbar />
      <div className="lg:ml-[260px] min-h-[100dvh] flex flex-col">
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
