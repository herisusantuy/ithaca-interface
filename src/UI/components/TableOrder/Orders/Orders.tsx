import { useEffect, useRef, useState } from 'react';

// Lib
import { useAppStore } from '@/UI/lib/zustand/store';

// SDK
import { PortfolioCollateral } from '@ithaca-finance/sdk';

// Constants
import { TableDescriptionProps, TableRowData, TableRowDataWithExpanded } from '@/UI/constants/tableOrder';

// Utils
import {
  currencyFilter,
  orderDateSort,
  orderLimitSort,
  productFilter,
  sideFilter,
  tenorSort,
} from '@/UI/utils/TableOrder';

// Components
import DisconnectedWallet from '@/UI/components/DisconnectedWallet/DisconnectedWallet';
import Modal from '@/UI/components/Modal/Modal';
import Pagination from '@/UI/components/Pagination/Pagination';
import Summary from '@/UI/components/Summary/Summary';
import TableDescription from '@/UI/components/TableDescription/TableDescription';

// Layout
import Flex from '@/UI/layouts/Flex/Flex';

// Styles
import Container from '@/UI/layouts/Container/Container';
import Loader from '../../Loader/Loader';
import styles from '../TableOrder.module.scss';
import { transformClientOpenOrders } from '../helpers';
import ExpandableTable from './ExpandableTable';
import HeaderColumns from './Header';
import SingleOrderRow from './SingleOrderRow';

// Types
type TableOrderProps = {
  type: TABLE_TYPE;
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
  const [isLoading, setLoading] = useState<boolean>(true);
  const [direction, setDirection] = useState<boolean>(true);

  const [currencyArray, setCurrencyArray] = useState<string[]>([]);

  const [productArray, setProductArray] = useState<string[]>([]);

  const [sideArray, setSideArray] = useState<string[]>([]);

  const { ithacaSDK, isAuthenticated } = useAppStore();

  const [isSorted, setIsSorted] = useState(false);

  
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
        case TABLE_TYPE.TRADE:
          ithacaSDK.client.tradeHistory().then(res => {
            setData(transformClientOpenOrders(res));
            setLoading(false);
          });
          break;
        default:
          setLoading(false);
          setData([]);
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

  useEffect(() => {
    let filterData = productFilter(data, productArray);
    filterData = sideFilter(filterData, sideArray);
    filterData = currencyFilter(filterData, currencyArray);
    setSlicedData(filterData.slice(pageStart, pageEnd));
  }, [data, productArray, pageEnd, pageStart, sideArray, currencyArray]);

  useEffect(() => {
    if (!isSorted && slicedData.length > 0) {
      updateSort('Order Date', false);
      setIsSorted(true);
    }
  }, [data, isSorted, slicedData]);

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

  const clearFilterArray = (label: string) => {
    switch (label) {
      case 'side': {
        return setSideArray([]);
      }
      case 'product': {
        return setProductArray([]);
      }
      case 'currency': {
        return setCurrencyArray([]);
      }
    }
  };

  const displayIsLoading = !slicedData.length && isLoading && isAuthenticated;
  const displayNoResults = !slicedData.length && !isLoading;
  const displayTable = slicedData.length > 0;
  const containerClassName = cancelOrder ? styles.gridContainerTable : styles.gridContainerTableNoCancel;
  return (
    <>
      {/* Table */}
      <div className={`${containerClassName}`}>
        <HeaderColumns
          updateSort={updateSort}
          currencyArray={currencyArray}
          clearFilterArray={clearFilterArray}
          productArray={productArray}
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
