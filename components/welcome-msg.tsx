"use client";

import { useUser } from "@clerk/nextjs";

const WelcomeMsg = () => {
    const { user, isLoaded } = useUser();
    
    return ( 
        <div className="space-y-2 mb-4 text-right">
          <h2 className="text-2xl lg:text-4xl text-white font-semibold">
            ברוך הבא {isLoaded ? " " : " "}{user?.firstName} 
          </h2>
          <p className="text-sm lg:text-base text-[#89b6fd]">
              זה הסיכום של העובר ושב בחשבונות שלך
          </p>
       </div>
     );
}
 
export default WelcomeMsg;