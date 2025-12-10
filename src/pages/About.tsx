import NavBar from '../components/NavBar'

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center pb-20">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">About</h1>
        <p className="text-gray-600 mb-6">
          This is the about page demonstrating React Router navigation with beautiful Tailwind styling.
        </p>
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h2 className="font-semibold text-green-900 mb-2">About Us</h2>
            <p className="text-sm text-green-700">
              A modern web application built with the latest technologies for optimal performance and user experience.
            </p>
          </div>
        </div>
      </div>
      <NavBar />
    </div>
  )
}
