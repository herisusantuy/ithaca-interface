// Packages
import { AnimatePresence, motion } from 'framer-motion';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';

// Lib
import { useAppStore } from '@/UI/lib/zustand/store';

// SDK
import { Order, PortfolioCollateral, Position } from '@ithaca-finance/sdk';

// Constants
import {
  TABLE_ORDER_HEADERS,
  TABLE_ORDER_HEADERS_FOR_POSITIONS,
  TableRowData,
  TableRowDataWithExpanded,
  TABLE_ORDER_DATA_WITH_EXPANDED,
  TableDescriptionProps,
  TABLE_ORDER_LIVE_ORDERS,
} from '@/UI/constants/tableOrder';

// Utils
import {
  getSideIcon,
  orderDateSort,
  orderLimitSort,
  renderDate,
  tenorSort,
  variants,
  CURRENCY_PAIR_LABEL,
  FilterItemProps,
  PRODUCT_LABEL,
  SIDE_LABEL,
  productFilter,
  sideFilter,
  currencyFilter,
} from '@/UI/utils/TableOrder';

// Hooks
import { useEscKey } from '@/UI/hooks/useEscKey';

// Components
import Pagination from '@/UI/components/Pagination/Pagination';
import TableDescription from '@/UI/components/TableDescription/TableDescription';
import Delete from '@/UI/components/Icons/Delete';
import Button from '@/UI/components/Button/Button';
import CollateralAmount from '@/UI/components/CollateralAmount/CollateralAmount';
import Modal from '@/UI/components/Modal/Modal';
import Summary from '@/UI/components/Summary/Summary';
import ExpandedTable from '@/UI/components/TableOrder/ExpandedTable';
import Sort from '@/UI/components/Icons/Sort';
import Filter from '@/UI/components/Icons/Filter';
import CheckBox from '@/UI/components/CheckBox/CheckBox';
import DisconnectedWallet from '@/UI/components/DisconnectedWallet/DisconnectedWallet';

// Layout
import Flex from '@/UI/layouts/Flex/Flex';

// Styles
import styles from '../TableOrder.module.scss';
import Container from '@/UI/layouts/Container/Container';
import Loader from '../../Loader/Loader';
import DropdownOutlined from '../../Icons/DropdownOutlined';
import ExpandedPositionTable from '../ExpandedPositionTable';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { getTableHeaders, transformClientOpenOrders } from '../helpers';
import SingleOrderRow from './SingleOrderRow';
import HeaderColumns from './Header';
import ExpandableTable from './ExpandableTable';
dayjs.extend(customParseFormat);

// Types
type TableOrderProps = {
  type?: TABLE_TYPE;
  cancelOrder?: boolean;
  description?: boolean;
};

export enum TABLE_TYPE {
  LIVE,
  ORDER,
  TRADE,
}

const Orders = ({ type, cancelOrder = true, description = true }: TableOrderProps) => {
  // Cancel order state
  const [data, setData] = useState<TableRowDataWithExpanded[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [rowToCancelOrder, setRowToCancelOrder] = useState<TableRowData | null>(null);
  const [slicedData, setSlicedData] = useState<TableRowDataWithExpanded[]>([]);
  const [collateralData, setCollateralData] = useState<TableDescriptionProps>({
    possibleReleaseX: 0,
    possibleReleaseY: 0,
    postOptimisationX: 0,
    postOptimisationY: 0,
  });
  // const [headers, setHeaders] = useState<string[]>(TABLE_ORDER_HEADERS);
  const [sortHeader, setSortHeader] = useState<string>('');
  const [filterHeader, setFilterHeader] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(true);
  const [direction, setDirection] = useState<boolean>(true);

  const [currencyArray, setCurrencyArray] = useState<string[]>([]);

  const [productArray, setProductArray] = useState<string[]>([]);

  const [sideArray, setSideArray] = useState<string[]>([]);

  const { ithacaSDK, isAuthenticated, unFilteredContractList } = useAppStore();

  const [dataLoaded, setDataLoaded] = useState(false);
  const [isSorted, setIsSorted] = useState(false);

  // Define Ref variables for outside clickable
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sideRef = useRef<HTMLDivElement | null>(null);
  const productRef = useRef<HTMLDivElement | null>(null);

  const positionsDataToRows = (res: Position[]) => {
    setData(
      res.map(row => {
        const contract = unFilteredContractList.find(c => c.contractId === row.contractId);
        return {
          // clientOrderId: row.orderId, // Missing
          details: '',
          // orderDate: dayjs(row.revDate).format('DD MMM YY HH:mm'), // Missing
          currencyPair: contract?.economics.currencyPair, // Look up from contract
          product: contract?.payoff, // Look up from Contract
          // side: row.details.length === 1 ? row.details[0].side : '', // Missing
          tenor: dayjs(contract?.economics.expiry.toString(), 'YYMMDDHHm').format('DD MMM YY'), // Look up from contract
          // wethAmount: row.collateral?.numeraireAmount, // Missing
          // usdcAmount: row.collateral?.underlierAmount, // Missing
          // orderLimit: row.netPrice, // Missing
          expandedInfo: [
            {
              // Dummy data to be replaced with actual data
              type: 'CALL',
              side: 'BUY',
              size: 2000,
              strike: 400,
              enterPrice: 400,
            },
          ],
        };
      }) as TableRowDataWithExpanded[]
    );
  };

  useEffect(() => {
    if (isAuthenticated) {
      switch (type) {
        case TABLE_TYPE.LIVE:
          ithacaSDK.orders.clientOpenOrders().then(res => {
            setData(transformClientOpenOrders(res));
            setLoading(false);
          });
          if (description) {
            ithacaSDK.calculation.calcPortfolioCollateral().then((d: PortfolioCollateral) => {
              if (d) {
                setCollateralData({
                  possibleReleaseX: d.actual.underlierAmount,
                  possibleReleaseY: d.actual.numeraireAmount,
                  postOptimisationX: d.potential.underlierAmount,
                  postOptimisationY: d.potential.numeraireAmount,
                });
              }
            });
          }
          break;
        case TABLE_TYPE.ORDER:
          ithacaSDK.client.currentPositions().then(res => {
            positionsDataToRows(res);
            setLoading(false);
          });
          break;
        case TABLE_TYPE.TRADE:
          ithacaSDK.client.tradeHistory().then(res => {
            setData(transformClientOpenOrders(res));
            setLoading(false);
          });
          break;
        default:
          setLoading(false);
          setData(TABLE_ORDER_DATA_WITH_EXPANDED);
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Handle cancel order
  const handleCancelOrderClick = (rowIndex: number) => {
    setRowToCancelOrder(slicedData[rowIndex]);
    setIsModalOpen(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setRowToCancelOrder(null);
  };

  // Function to handle the actual delete operation
  const handleCancelOrderRemoveRow = () => {
    setIsDeleting(true);
    ithacaSDK.orders.orderCancel(rowToCancelOrder?.clientOrderId || 0).then(() => {
      const newData = slicedData.filter(row => row !== rowToCancelOrder);
      setData(newData);
      setIsDeleting(false);
      setIsModalOpen(false);
      setRowToCancelOrder(null);
    });
  };

  // Function to handle the actual delete operation
  const handleCancelAllOrder = () => {
    setIsDeleting(true);
    ithacaSDK.orders.orderCancelAll().then(() => {
      setData([]);
      setIsDeleting(false);
      setIsModalOpen(false);
      setRowToCancelOrder(null);
    });
  };

  // Page state
  const [currentPage, setCurrentPage] = useState(1);

  // Expanded row state
  const [expandedRow, setExpandedRow] = useState<number[]>([]);
  const pageLimit = 9;

  // Handle page change in pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Get start and end pages
  const pageStart = (currentPage - 1) * pageLimit;
  const pageEnd = pageStart + pageLimit;

  console.log('DEBUG INFO 24/12/2023 10:54:18', currencyArray);

  useEffect(() => {
    let filterData = productFilter(data, productArray);
    filterData = sideFilter(filterData, sideArray);
    filterData = currencyFilter(filterData, currencyArray);
    setSlicedData(filterData.slice(pageStart, pageEnd));
  }, [data, productArray, pageEnd, pageStart, sideArray, currencyArray]);

  useEffect(() => {
    if (data.length > 0) {
      setDataLoaded(true);
    }
  }, [data]);

  useEffect(() => {
    if (!isSorted && slicedData.length > 0) {
      updateSort('Order Date', false);
      setIsSorted(true);
    }
  }, [dataLoaded, isSorted]);

  // Handle row expand and collapse
  const handleRowExpand = (rowIndex: number) => {
    if (expandedRow.includes(rowIndex)) {
      setExpandedRow(prev => prev.filter(idx => idx !== rowIndex));
    } else {
      setExpandedRow(prev => [...prev, rowIndex]);
    }
  };

  // Data sort function
  const updateSort = (header: string, dir: boolean) => {
    let sortDirection = true;
    if (sortHeader != header) {
      setSortHeader(header);
      sortDirection = dir;
      setDirection(dir);
    } else {
      sortDirection = !direction;
      setDirection(!direction);
    }
    switch (header) {
      case 'Order Date': {
        const sortData = orderDateSort(slicedData, sortDirection);
        setSlicedData(sortData.slice(pageStart, pageEnd));
        break;
      }
      case 'Tenor': {
        const sortData = tenorSort(slicedData, sortDirection);
        setSlicedData(sortData.slice(pageStart, pageEnd));
        break;
      }
      case 'Collateral Amount': {
        const sortData = tenorSort(slicedData, sortDirection);
        setSlicedData(sortData.slice(pageStart, pageEnd));
        break;
      }
      case 'Order Limit': {
        const sortData = orderLimitSort(slicedData, sortDirection);
        setSlicedData(sortData.slice(pageStart, pageEnd));
        break;
      }
      default:
        return null;
    }
  };

  // checkbox clickable status

  const clearFilterArray = (label: string) => {
    switch (label) {
      case 'side': {
        // setSideChecked(true);
        return setSideArray([]);
      }
      case 'product': {
        // setProductChecked(true);
        return setProductArray([]);
      }
      case 'currency': {
        // setCurrencyChecked(true);
        return setCurrencyArray([]);
      }
    }
  };

  const displayIsLoading = !slicedData.length && isLoading && isAuthenticated;
  const displayNoResults = !slicedData.length && !isLoading;
  const displayTable = slicedData.length > 0;
  return (
    <>
      {/* Table */}
      <div className={`${styles.gridContainerTable}`}>
        <HeaderColumns
          updateSort={updateSort}
          currencyArray={currencyArray}
          containerRef={containerRef}
          clearFilterArray={clearFilterArray}
          productArray={productArray}
          productRef={productRef}
          sideRef={sideRef}
          sideArray={sideArray}
          setSideArray={setSideArray}
          setProductArray={setProductArray}
          setCurrencyArray={setCurrencyArray}
          type={type}
          handleCancelAllOrder={handleCancelAllOrder}
        />

        {displayTable &&
          slicedData.map((row, rowIndex) => {
            const isRowExpanded = expandedRow.includes(rowIndex);
            return (
              <>
                <SingleOrderRow
                  handleRowExpand={handleRowExpand}
                  expandedRow={expandedRow}
                  row={row}
                  cancelOrder={cancelOrder}
                  handleCancelOrderClick={handleCancelOrderClick}
                  rowIndex={rowIndex}
                />
                <ExpandableTable row={row} isRowExpanded={isRowExpanded} type={type} />
              </>
            );
          })}
      </div>
      {displayIsLoading && (
        <Container size='loader' margin='ptb-150'>
          <Loader type='lg' />
        </Container>
      )}
      {displayNoResults && <p className={styles.emptyTable}>No results found</p>}

      {/* Footer and pagination */}
      <Flex direction='row-space-between' margin='mt-35'>
        {description ? <TableDescription {...collateralData} /> : <div />}
        <Pagination
          totalItems={data.length}
          itemsPerPage={pageLimit}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </Flex>

      {/* Cancel order modal */}
      {isModalOpen && rowToCancelOrder && (
        <Modal
          title='Cancel Order'
          onCloseModal={handleCloseModal}
          onSubmitOrder={handleCancelOrderRemoveRow}
          isLoading={isDeleting}
          isOpen={isModalOpen}
        >
          <p>Please confirm if you&apos;d like to cancel your order.</p>
          <Summary detail={rowToCancelOrder} />
        </Modal>
      )}

      {/* Connect wallet */}
      {!isAuthenticated && (
        <Container size='loader' margin='ptb-150'>
          <DisconnectedWallet showButton={false} />
        </Container>
      )}
    </>
  );
};

export default Orders;
