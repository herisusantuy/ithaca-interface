// Packages
import { PropsWithChildren, createContext, useCallback, useMemo, useState } from 'react';

type NavContext = {
  isHamburgerOpen: boolean;
  handleHamburgerClick: () => void;
};
export const NavCTX = createContext<NavContext>({
  isHamburgerOpen: false,
  handleHamburgerClick: () => {},
});

const NavProvider = (props: PropsWithChildren) => {
  const { children } = props;
  const [isHamburgerOpen, setIsHamburgerOpen] = useState<boolean>(false);

  const handleHamburgerClick = useCallback(() => {
    setIsHamburgerOpen(!isHamburgerOpen);
    document.body.classList.toggle('is-active');
  }, [isHamburgerOpen]);
  const ctxValue = useMemo(() => {
    return {
      handleHamburgerClick,
      isHamburgerOpen,
    };
  }, [isHamburgerOpen, handleHamburgerClick]);
  return <NavCTX.Provider value={ctxValue}>{children}</NavCTX.Provider>;
};
export default NavProvider;
