
import React from "react";
import Image from "next/image";
import logo from "../../../../Assets/icons/i-techlogo 1.svg";

interface LogoProps {
    width: number;
    height: number;
}

const Logo: React.FC<LogoProps> = ({width, height}:LogoProps) => {
  return (
    <figure className="font-extrabold text-[2.475rem] text-[#7B7B7B]">
     <Image
      className={``}
        width={width}
        height={height}
      src={logo} alt="profile" />
    </figure>
  );
}
export default Logo;