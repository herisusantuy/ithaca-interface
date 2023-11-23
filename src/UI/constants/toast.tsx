export type ToastItemProp = {
  id: number;
  title: string;
  message: string;
  hyper?: {
    hyperLink: string;
    hyperText: string;
  };
  type: string;
};

export const generateTestData = (position: string = 'top-right', type: string = 'info') => {
  const result: ToastItemProp = {
    id: Math.floor(Math.random() * 1000),
    title: 'Transaction Confirmed',
    message: 'Position details will be updated shortly',
    hyper: {
      hyperLink: '#',
      hyperText: 'Check on Etherscan',
    },
    type: type
  };
  const resultArray: ToastItemProp[] = [];
  resultArray.push(result);
  return resultArray;
};
