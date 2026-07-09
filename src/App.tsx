import { TopNav } from './components/layout/TopNav';

function App() {
  return (
    <div className="min-h-screen w-full bg-deep-black relative overflow-hidden flex flex-col items-center bg-no-repeat bg-cover bg-center bg-fixed">
      {/* Full-screen Background Orbs */}
      <div className="blob-cyan absolute top-[-5%] right-[-10%] md:top-[5%] md:right-[15%] w-[300px] h-[300px] md:w-[500px] md:h-[500px]"></div>
      <div className="blob-rose absolute bottom-[-5%] left-[-10%] md:bottom-[10%] md:left-[10%] w-[350px] h-[350px] md:w-[600px] md:h-[600px]"></div>
      
      {/* Subtle full-screen blur overlay to blend the blobs smoothly */}
      <div className="absolute inset-0 backdrop-blur-[80px] z-0 pointer-events-none"></div>

      {/* Full-width Top Navigation */}
      <TopNav />

      {/* Centered Mobile Container for Content */}
      <div className="app-container relative z-10 flex flex-col flex-1">
        <main className="px-4 py-6 pb-32 flex-1">
          {/* Ready for your components */}
        </main>
      </div>
    </div>
  )
}

export default App
