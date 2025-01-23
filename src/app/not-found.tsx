
import Image from "next/image";
import Link from "next/link";
import sorryImg from '../../Assets/image/sorry.png'

export default function Custom404() {
    return (
        <div className="text-center flex px-4   flex-col py-24 space-y-4 ">
                <figure className="mx-auto  w-[30%] md:w-[10%] my-8 ">
                    <Image src={sorryImg} alt="sorry" className="w-full " />
                </figure>
            <h1 className="font-extrabold x text-3xl ">404 - Page Not Found</h1>
            <p className="text-xl ">Sorry, the page you are looking for does not exist.</p>
            <Link
                className="text-[#0173B9] underline font-bold  my-8"
                href="/">
                Go back 
            </Link>
        </div>
    );
}
