import Link from 'next/link'
import React from 'react'

function Navbar() {
    return (
        <div>
            <nav className="bg-white shadow-md fixed w-full top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">

                        {/* Logo */}
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center space-x-2">
                                <span className="text-2xl">🎓</span>
                                <span className="text-xl font-bold text-indigo-600">LearnQuiz</span>
                            </Link>
                        </div>

                        {/* Auth Buttons */}
                        <div className="hidden md:flex items-center space-x-3">
                            <Link
                                href="/signin"
                                className="px-4 py-2 text-indigo-600 font-medium border border-indigo-600 rounded-lg hover:bg-indigo-50 transition"
                            >
                                Log In
                            </Link>
                            <Link
                                href="/signup"
                                className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
                            >
                                Sign Up Free
                            </Link>
                        </div>

                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar;