import { PropsWithChildren, createContext, useCallback, useMemo, useState } from "react";
import { ToastItemProp } from "../../constants/toast";

type ToastContext = {
  toastList: ToastItemProp[],
  showToast: (newToast: ToastItemProp, position: string) => void,
  position: string
}
export const ToastCTX = createContext<ToastContext>({
  toastList: [],
  showToast: () => { console.log("----1first")},
  position: 'top-right'
});

const ToastProvider = (props: PropsWithChildren) => {
  const { children } = props;
  const [toastList, setToastList] = useState<ToastItemProp[]>([]);
  const [position, setPosition] = useState('top-right');

  const showToast = useCallback((newToast: ToastItemProp, position: string) => {
    console.log("---")
    setToastList([...toastList, newToast]);
    setPosition(position);
  },[toastList]);
  const ctxValue = useMemo(() => {
    return {
      toastList, 
      showToast, 
      position
    }
  }, [position, showToast, toastList])
  return (
    <ToastCTX.Provider value={ctxValue}>
      {children}
    </ToastCTX.Provider>
  );
}
export default ToastProvider;