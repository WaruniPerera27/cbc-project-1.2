export default function HomePage() {

    return (
        
        
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">Welcome to the Home Page</h2>
                <p className="text-gray-700 text-center">This is the home page content.</p>
                <a href="/login" className="mt-4 inline-block text-blue-500 hover:text-blue-700">Login page</a><br />
                <a href="/register" className="mt-4 inline-block text-blue-500 hover:text-blue-700">Register page</a><br/>
                <a href="/admin" className="mt-4 inline-block text-blue-500 hover:text-blue-700">Admin page</a>
                
            </div>
       
    );
}