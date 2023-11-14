export type ToastItemProp = {
  id: number;
  title: string;
  message: string;
  hyper?: {
    hyperLink: string;
    hyperText: string;
  };
};

export const generateTestData = () => {
  const result: ToastItemProp = {
    id: Math.floor(Math.random() * 1000),
    title: 'Transaction Confirmed',
    message: 'Position details will be updated shortly',
    hyper: {
      hyperLink: '#',
      hyperText: 'Check on Etherscan',
    },
  };
  const resultArray: ToastItemProp[] = [];
  resultArray.push(result);
  return resultArray;
};
