import { useWindowSize } from "./useWindowSize"

export const useDevice = () => {
  const { width: windowWidth} = useWindowSize()
  const browser = (windowWidth && windowWidth < 695) ? 
  'phone' :
  (windowWidth && (windowWidth >= 695 && windowWidth < 1440 )) ?
  'tablet' :
  'desktop'
  return browser
}