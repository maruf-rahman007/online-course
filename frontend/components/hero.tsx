import Link from 'next/link'

export default function Hero() {
    return (
        <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-28 pb-20 px-4">
            <div className="max-w-7xl mx-auto text-center">

                {/* Badge */}
                <div className="inline-flex items-center bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                    🚀 New courses added every week
                </div>

                {/* Heading */}
                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                    Learn Smarter,{' '}
                    <span className="text-indigo-600">Quiz Better</span>
                </h1>

                {/* Subheading */}
                <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
                    Access hundreds of expert-led courses and interactive quizzes.
                    Track your progress, earn certificates, and level up your skills.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-14">
                    <Link
                        href="/signup"
                        className="px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-xl hover:bg-indigo-700 transition shadow-lg"
                    >
                        Get Started Free →
                    </Link>
                    <Link
                        href="#courses"
                        className="px-8 py-4 bg-white text-indigo-600 text-lg font-semibold rounded-xl border-2 border-indigo-200 hover:border-indigo-400 transition"
                    >
                        Browse Courses
                    </Link>
                </div>

                {/* Hero Image Placeholder */}
                <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto border border-gray-100">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl h-64 flex items-center justify-center">
                        <div className="text-center text-white">
                            <div className="text-6xl mb-4">📚</div>
                            <p className="text-2xl font-bold">Your Learning Dashboard</p>
                            <p className="text-indigo-200 mt-2">Track courses, quizzes & achievements</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}