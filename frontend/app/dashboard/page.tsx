'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface User {
  _id: string
  name: string
  email: string
  role: string
  status: string
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUsers = async (token: string) => {
    try {
      console.log("Sending request to backend...")
      const res = await fetch('http://localhost:4001/api/admin/dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        throw new Error('Unauthorized')
      }

      const data = await res.json()
      console.log("Response from backend:", data)

    } catch (err) {
      console.error("Fetch error:", err)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/signin')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')

    // No token → redirect
    if (!token) {
      router.push('/signin')
      return
    }

    const storedUser = localStorage.getItem('user')

    if (storedUser) {
      // ✅ Parse FIRST, then read role from parsed object directly
      const parsedUser: User = JSON.parse(storedUser)
      setUser(parsedUser)

      // ✅ Use parsedUser.role NOT user?.role (state hasn't updated yet)
      if (parsedUser.role === 'admin') {
        fetchUsers(token)
      } else {
        setLoading(false)
      }
      return
    }

    // No stored user at all
    setLoading(false)
    router.push('/signin')

  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/signin')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-indigo-600 mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top Nav */}
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🎓</span>
              <span className="text-xl font-bold text-indigo-600">LearnQuiz</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 hidden sm:block">
                Welcome, <span className="font-semibold text-gray-800">{user?.name}</span>
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Welcome Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Here&apos;s your account overview</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Card Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-10 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-md">
              {user?.role === 'instructor' ? '👨‍🏫' : user?.role === 'admin' ? '🛡️' : '🎒'}
            </div>
            <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
            <span className="inline-block mt-2 px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full capitalize">
              {user?.role}
            </span>
          </div>

          {/* Info Grid */}
          <div className="p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              {/* Name */}
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">👤</span>
                  <span className="text-sm font-medium text-gray-500">Full Name</span>
                </div>
                <p className="text-lg font-semibold text-gray-800 ml-8">{user?.name}</p>
              </div>

              {/* Email */}
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">📧</span>
                  <span className="text-sm font-medium text-gray-500">Email Address</span>
                </div>
                <p className="text-lg font-semibold text-gray-800 ml-8">{user?.email}</p>
              </div>

              {/* Status */}
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">🟢</span>
                  <span className="text-sm font-medium text-gray-500">Status</span>
                </div>
                <p className="text-sm font-semibold text-gray-800 ml-8 capitalize">{user?.status}</p>
              </div>

              {/* Role */}
              <div className="bg-gray-50 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">🏷️</span>
                  <span className="text-sm font-medium text-gray-500">Role</span>
                </div>
                <p className="ml-8">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                    user?.role === 'instructor'
                      ? 'bg-purple-100 text-purple-700'
                      : user?.role === 'admin'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {user?.role}
                  </span>
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="#"
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition text-center group"
          >
            <span className="text-3xl block mb-2">📚</span>
            <span className="font-semibold text-gray-800 group-hover:text-indigo-600 transition">
              {user?.role === 'instructor' ? 'My Courses' : user?.role === 'admin' ? 'Manage Courses' : 'Browse Courses'}
            </span>
          </Link>
          <Link
            href="#"
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition text-center group"
          >
            <span className="text-3xl block mb-2">✏️</span>
            <span className="font-semibold text-gray-800 group-hover:text-indigo-600 transition">
              {user?.role === 'instructor' ? 'Create Quiz' : user?.role === 'admin' ? 'Manage Quizzes' : 'Take a Quiz'}
            </span>
          </Link>
          <Link
            href="#"
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition text-center group"
          >
            <span className="text-3xl block mb-2">📊</span>
            <span className="font-semibold text-gray-800 group-hover:text-indigo-600 transition">
              {user?.role === 'instructor' ? 'Analytics' : user?.role === 'admin' ? 'All Analytics' : 'My Progress'}
            </span>
          </Link>
        </div>

      </div>
    </div>
  )
}