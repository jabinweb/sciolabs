'use client'

export default function OfflinePage() {
  const handleTryAgain = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md mx-auto text-center">
        <div className="w-24 h-24 bg-scio-blue rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fas fa-wifi-slash text-white text-2xl"></i>
        </div>
        
        <h1 className="font-heading text-2xl font-bold text-gray-900 mb-4">
          You&apos;re Offline
        </h1>
        
        <p className="text-gray-600 mb-6">
          It looks like you&apos;re not connected to the internet. Some features may not be available.
        </p>
        
        <button 
          onClick={handleTryAgain}
          className="bg-scio-blue hover:bg-scio-blue-dark text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    </main>
  )
}
