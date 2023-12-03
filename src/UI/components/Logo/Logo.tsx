// Packages
import Image from 'next/image';
import LogoText from '../../../public/LogoText.png';

const Logo = () => {
  return (
    <Image src={LogoText} alt='Logo' width={108} height={40}/>
  );
};

export default Logo;
