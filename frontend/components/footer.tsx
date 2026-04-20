import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400 pt-16 pb-8 px-4">
            <div className="max-w-7xl mx-auto">

                {/* Top Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

                    {/* Brand */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <span className="text-2xl">🎓</span>
                            <span className="text-xl font-bold text-white">LearnQuiz</span>
                        </div>
                        <p className="text-sm leading-relaxed">
                            Empowering learners worldwide with quality courses and interactive quizzes.
                        </p>
                        <div className="flex space-x-4 mt-5">
                            {['🐦', '📘', '📸', '▶️'].map((icon, i) => (
                                <a key={i} href="#" className="text-2xl hover:scale-110 transition">
                                    {icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Learn */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Learn</h4>
                        <ul className="space-y-2 text-sm">
                            {['All Courses', 'Quizzes', 'Certificates', 'Learning Paths', 'Leaderboard'].map((item, i) => (
                                <li key={i}>
                                    <Link href="/signup" className="hover:text-indigo-400 transition">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm">
                            {['About Us', 'Blog', 'Careers', 'Press', 'Contact'].map((item, i) => (
                                <li key={i}>
                                    <Link href="#" className="hover:text-indigo-400 transition">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Stay Updated</h4>
                        <p className="text-sm mb-4">Get the latest courses and quizzes in your inbox.</p>
                        <div className="flex flex-col gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                            />
                            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <hr className="border-gray-800 mb-6" />

                {/* Bottom */}
                <div className="flex flex-col sm:flex-row justify-between items-center text-sm gap-4">
                    <p>© 2024 LearnQuiz. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-indigo-400 transition">Privacy Policy</Link>
                        <Link href="#" className="hover:text-indigo-400 transition">Terms of Service</Link>
                        <Link href="#" className="hover:text-indigo-400 transition">Cookie Policy</Link>
                    </div>
                </div>

            </div>
        </footer>
    )
}