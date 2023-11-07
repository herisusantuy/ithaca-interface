// Package Import
import { TableRowData } from '@/UI/constants/tableOrder';

//---------- orderDate Sort -----------//
export const orderDateSort = (data: TableRowData[], dir: string) => {
  if (dir === 'asc') {
    data.sort((a: TableRowData, b: TableRowData) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime());
  } else {
    data.sort((a: TableRowData, b: TableRowData) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  }
  console.log(data);
  return data;
};

//---------- orderLimit Sort -----------//
export const orderLimitSort = (data: TableRowData[], dir: string) => {
  if (dir === 'asc') {
    data.sort((a: TableRowData, b: TableRowData) => Number(a.orderLimit) - Number(b.orderLimit));
  } else {
    data.sort((a: TableRowData, b: TableRowData) => Number(b.orderLimit) - Number(a.orderLimit));
  }
  console.log(data);
  return data;
};

//---------- tenor Sort -----------//
export const tenorSort = (data: TableRowData[], dir: string) => {
  if (dir === 'asc') {
    data.sort((a: TableRowData, b: TableRowData) => new Date(a.tenor).getTime() - new Date(b.tenor).getTime());
  } else {
    data.sort((a: TableRowData, b: TableRowData) => new Date(b.tenor).getTime() - new Date(a.tenor).getTime());
  }
  console.log(data);
  return data;
};

//---------- side filter -----------//
export const sideFilter = (data: TableRowData[], filterItem: string) => {
  //   const filteredData = data.filter((item: TableRowData) => item.side === '+');
  const filteredData = data.filter((item: TableRowData) => item.side === filterItem);
  console.log(filteredData);
  return filteredData;
};

//---------- Product filter(in this case filter value is Forward, Call) -----------//
export const productFilter = (data: TableRowData[], filterArray: string[]) => {
  //   const filterArray = ['Forward', 'Call'];
  const filteredData = data.filter((item: TableRowData) => filterArray.includes(item.product));
  console.log(filteredData);
  return filteredData;
};
