import { TABLE_ORDER_HEADERS, TABLE_ORDER_HEADERS_FOR_POSITIONS, TABLE_ORDER_LIVE_ORDERS, TableRowDataWithExpanded } from "@/UI/constants/tableOrder";
import { Order } from "@ithaca-finance/sdk";
import dayjs from 'dayjs';
import { TABLE_TYPE } from "./TableOrder";

const DEFAULT_DATE_FORMAT = 'DDMMMYY'

export const transformClientOpenOrders = (orders: Order[]) => {
  return orders.map(row => ({
    clientOrderId: row.orderId,
    details: '',
    orderDate: dayjs(row.revDate).format('DDMMMYY HH:mm'),
    currencyPair: row.collateral?.currencyPair || row.details[0].currencyPair,
    product: row.orderDescr,
    side: row.details.length === 1 ? row.details[0].side : '',
    tenor: dayjs(row.details[0].expiry.toString(), 'YYMMDDHHm').format(DEFAULT_DATE_FORMAT),
    wethAmount: row.collateral?.underlierAmount,
    usdcAmount: row.collateral?.numeraireAmount,
    orderLimit: row.netPrice,
    expandedInfo: row.details.map(leg => ({
      type: leg.contractDto.payoff,
      side: leg.side,
      expiryDate: dayjs(leg.expiry.toString(), 'YYYYMMDD').format(DEFAULT_DATE_FORMAT),
      size: leg.originalQty,
      strike: leg.contractDto.economics.strike,
      enterPrice: leg.execPrice,
    })),
  })) as TableRowDataWithExpanded[]
}

export const getTableHeaders = (type) => {
  switch (type) {
    case TABLE_TYPE.ORDER:
      return TABLE_ORDER_HEADERS_FOR_POSITIONS;
    case TABLE_TYPE.LIVE:
      return TABLE_ORDER_LIVE_ORDERS;
    default:
      return TABLE_ORDER_HEADERS;
  }
}