import Link from "next/link";
import Image from "next/image";

const HeaderLogo = () => {
    return ( 
        <Link href="/">
            <div className="items-center hidden lg:flex">
              <p className="font-semibold text-white text-2xl mr-2.5">
                כספים
              </p>
              <Image src="/logo.svg" height={35} width={35} alt="Logo"/>
            </div>
        </Link>
     );
}
 
export default HeaderLogo;