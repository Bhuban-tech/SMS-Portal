export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-teal-50 p-4">
      <div className="bg-white rounded-3xl shadow-5xl w-full max-w-md p-10 border border-teal-100 hover:scale-105 transition-transform duration-500">
       <h1 className="text-3xl font-bold mb-8 text-center">
  <span className="text-teal-600">SMS Portal</span>{" "}
  <span className="text-gray-700">Login</span>
    </h1>

        <form className="space-y-6">
          <div>
            <label className="block text-gray-600 font-bold mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 rounded-xl border border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none text-gray-700 placeholder-gray-400 transition"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-bold mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full p-3 rounded-xl border border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none text-gray-700 placeholder-gray-400 transition"
            />
          </div>
          <button
            type="submit"
            className=" cursor-pointer w-full py-3 rounded-xl bg-gradient-to-r from-teal-400 to-teal-600 text-white font-semibold shadow-lg hover:from-teal-500 hover:to-teal-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
