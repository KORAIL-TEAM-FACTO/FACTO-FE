import NavBar from '../components/NavBar'

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center pb-20">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Contact</h1>
        <p className="text-gray-600 mb-6">
          Get in touch with us! This page showcases Tailwind's utility classes and React Router.
        </p>
        <div className="space-y-4">
          <div className="bg-orange-50 p-4 rounded-lg">
            <h2 className="font-semibold text-orange-900 mb-2">Contact Info</h2>
            <p className="text-sm text-orange-700 mb-1">Email: contact@example.com</p>
            <p className="text-sm text-orange-700">Phone: +82 10-1234-5678</p>
          </div>
        </div>
      </div>
      <NavBar />
    </div>
  )
}
