import React from 'react'
import { useRouter } from 'next/router';

const Nav = () => {

    const router = useRouter();

    const handleRedirect = (route) => {
        router.push(`/${route}`);
    };

    return (
        <div>
            <div className='border-green-500 border-b-2 shadow-green-200 shadow-lg'>
                <header className="text-gray-600 body-font">
                    <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                        <a onClick={() => handleRedirect('')} className=" hover:cursor-pointer flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10 text-white p-2 bg-green-500 rounded-full" viewBox="0 0 24 24">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                            </svg>
                            <span className="ml-3 text-xl ">Web App Creations</span>
                        </a>
                        <nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400	flex flex-wrap items-center text-base justify-center">
                            <a onClick={() => handleRedirect('transactions')} className="mr-5 hover:text-gray-900 hover:cursor-pointer">Transactions</a>
                            <a onClick={() => handleRedirect('customers')} className="mr-5 md:pl-4 md:border-l md:border-gray-400 hover:text-gray-900 hover:cursor-pointer">Customers</a>
                            <a onClick={() => handleRedirect('products')} className="mr-5 md:pl-4 md:border-l md:border-gray-400 hover:text-gray-900 hover:cursor-pointer">Product</a>
                        </nav>
                        <button className="inline-flex items-center bg-red-300 border-0 py-1 px-3 focus:outline-none hover:bg-red-400 rounded text-black font-semibold mt-4 md:mt-0">Logout
                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
                                <path d="M5 12h14M12 5l7 7-7 7"></path>
                            </svg>
                        </button>
                    </div>
                </header>
            </div>
        </div>
    )
}
export default Nav
