import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr__1fr] gap-14 my-10 mt-40 text-sm'>
        {/* {--------left section-------- } */}
           <div>
                       <img className='mb-5 w-40' src={assets.logo} alt="" />
                       <p className='w-full md:w-2/3 text-gray-600 leading-6'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident eum deserunt nulla eligendi consectetur labore suscipit aliquam repudiandae consequatur vero, veniam non, molestiae blanditiis dolorem? </p>
           </div>
          
            {/* {--------centre section-------- } */}
            <div>
                    <p className='text-xl font-medium mb-5'>Company</p>
                    <ul className='flex flex-col gap-2 text-gray-600 '>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Contact</li>
                        <li>Privacy policy</li>
                    </ul>

          </div>

          
            {/* {--------right section-------- } */}
            <div>
                    <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                     <ul className='flex flex-col gap-2 text-gray-600 '>
                        <li>9021643310</li>
                        <li>Shubhamzirp304@gmail.com</li>
                     </ul>
          </div>
      </div>
       {/* -------copt right text */}
                     <div>
                                 <hr />
                               <p className='py-5 text-sm text-center'>Copyright 2025@ Prescipto-All Right Reserved</p>
                     </div>
    </div>
  )
}

export default Footer
