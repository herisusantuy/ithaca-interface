// Packages
import { AnimatePresence, motion } from 'framer-motion';
import { Fragment, useEffect, useRef, useState } from 'react';

// Components
import Pagination from '@/UI/components/Pagination/Pagination';
import TableDescription from '@/UI/components/TableDescription/TableDescription';
import Delete from '@/UI/components/Icons/Delete';
import Button from '@/UI/components/Button/Button';
import Dropdown from '@/UI/components/Icons/Dropdown';
import CollateralAmount from '@/UI/components/CollateralAmount/CollateralAmount';
import Modal from '@/UI/components/Modal/Modal';
import Summary from '@/UI/components/Summary/Summary';
import ExpandedTable from '@/UI/components/TableOrder/ExpandedTable';
import Sort from '@/UI/components/Icons/Sort';
import Filter from '@/UI/components/Icons/Filter';

// Layout
import Flex from '@/UI/layouts/Flex/Flex';

// Constants
import { TABLE_ORDER_HEADERS, TableRowData, TableRowDataWithExpanded, TABLE_ORDER_DATA_WITH_EXPANDED } from '@/UI/constants/tableOrder';

// Utils
import {
  formatCurrencyPair,
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
} from '@/UI/utils/TableOrder';

// Styles
import styles from './TableOrder.module.scss';
import CheckBox from '../CheckBox/CheckBox';
import { useEscKey } from '@/UI/hooks/useEscKey';
import { useAppStore } from '@/UI/lib/zustand/store';
import { useWalletClient } from 'wagmi';
import dayjs from 'dayjs';
import { Order } from '@ithaca-finance/sdk';

// Types
type TableOrderProps = {
  // data: TableRowDataWithExpanded[];
  type?: TABLE_TYPE
};

export enum TABLE_TYPE {
   LIVE,
   ORDER,
   TRADE
}

const TableOrder = ({ type }: TableOrderProps) => {
  // Cancel order state
  const [data, setData] = useState<TableRowDataWithExpanded[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [rowToCancelOrder, setRowToCancelOrder] = useState<TableRowData | null>(null);
  const [slicedData, setSlicedData] = useState<TableRowDataWithExpanded[]>([]);
  const [sortHeader, setSortHeader] = useState<string>('');
  const [filterHeader, setFilterHeader] = useState<string>('');
  const [direction, setDirection] = useState<boolean>(true);
  const [visible, setVisible] = useState<boolean>(false);
  const [productArray, setProductArray] = useState<string[]>([]);
  const [productChecked, setProductChecked] = useState<boolean>(false);
  const [sideArray, setSideArray] = useState<string[]>([]);
  const [sideChecked, setSideChecked] = useState<boolean>(false);
  const { ithacaSDK } = useAppStore();

  // Define Ref variables for outside clickable
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sideRef = useRef<HTMLDivElement | null>(null);
  const productRef = useRef<HTMLDivElement | null>(null);
  const { data: walletClient } = useWalletClient();
  
  const dataToRows = (res: Order[]) => {
    setData(res.map((row) => ({
      clientOrderId: row.orderId,
      details: "",
      orderDate: dayjs(1699462800000).format('DD MMM YY HH:mm'),
      currencyPair: row.collateral?.currencyPair  || 'WETH/USDC',
      product: row.orderDescr,
      side: "+",
      tenor: "14 Jun 23",
      wethAmount: row.collateral?.numeraireAmount,
      usdcAmount: row.collateral?.underlierAmount,
      orderLimit: row.details.reduce((agg, d) =>  d.originalQty + agg ,0),
      expandedInfo: row.details.map((leg) => ({
        type: leg.contractDto.payoff,
        side: leg.side,
        size: leg.originalQty,
        strike: leg.contractDto.economics.strike,
        enterPrice: leg.execPrice
      }))
    })) as TableRowDataWithExpanded[])
  }

  useEffect(() => {
    const address = walletClient?.account.address;
    if (address) {
      switch (type) {
        case TABLE_TYPE.LIVE:
          ithacaSDK.orders.clientOpenOrders().then((res) => {
            dataToRows(res)
          })
          break;
        case TABLE_TYPE.ORDER:
          ithacaSDK.protocol.matchedOrders().then((res) => {
            dataToRows(res)
          })
          break;
        case TABLE_TYPE.TRADE:
          ithacaSDK.client.tradeHistory().then((res) => {
            dataToRows(res)
          })
          break;
        default:
          setData(TABLE_ORDER_DATA_WITH_EXPANDED)
          break;
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletClient?.account.address]);

  // Handle cancel order
  const handleCancelOrderClick = (rowIndex: number) => {
    setRowToCancelOrder(data[rowIndex]);
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
      const newData = data.filter(row => row !== rowToCancelOrder);
      setData(newData);
      setIsDeleting(false);
      setIsModalOpen(false);
      setRowToCancelOrder(null);
    })
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

  // Outside handle click for hide dialog
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        sideRef.current &&
        !sideRef.current.contains(event.target as Node) &&
        productRef.current &&
        !productRef.current.contains(event.target as Node)
      ) {
        setVisible(false);
      }
    };

    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  // Slice the data to only show 9 results
  useEffect(() => {
    let filterData = productFilter(data, productArray);
    filterData = sideFilter(filterData, sideArray);
    setSlicedData(filterData.slice(pageStart, pageEnd));
  }, [data, productArray, pageEnd, pageStart, sideArray]);

  // Handle row expand and collapse
  const handleRowExpand = (rowIndex: number) => {
    if (expandedRow.includes(rowIndex)) {
      setExpandedRow(prev => prev.filter(idx => idx !== rowIndex));
    } else {
      setExpandedRow(prev => [...prev, rowIndex]);
    }
  };

  // Close Esc key for dropdown menu filter
  useEscKey(() => {
    if (visible) {
      setVisible(false);
    }
  });

  // Set visible filter bar for show/hide filter box
  const showFilterBar = (header: string) => {
    if (header === filterHeader) {
      setVisible(!visible);
    } else {
      setVisible(true);
      setFilterHeader(header);
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
  const selectedLabeStatus = (label: string, status: boolean) => {
    if (filterHeader == 'Product') {
      setProductChecked(false);
      const filter = productArray.slice();
      if (status) {
        filter.push(label);
        setProductArray(filter);
      } else {
        const indexToRemove = filter.indexOf(label);
        if (indexToRemove !== -1) {
          filter.splice(indexToRemove, 1);
          setProductArray(filter);
        }
      }
    } else if (filterHeader == 'Side') {
      setSideChecked(false);
      const filter = sideArray.slice();
      if (status) {
        filter.push(label == 'Buy' ? '+' : '-');
        setSideArray(filter);
      } else {
        const indexToRemove = filter.indexOf(label == 'Buy' ? '+' : '-');
        if (indexToRemove !== -1) {
          filter.splice(indexToRemove, 1);
          setSideArray(filter);
        }
      }
    }
  };

  const clearFilterArray = (label: string) => {
    switch (label) {
      case 'side': {
        setSideChecked(true);
        return setSideArray([]);
      }
      case 'product': {
        setProductChecked(true);
        return setProductArray([]);
      }
      case 'currency': {
        return null;
      }
    }
  };

  // Get table header icons
  const getHeaderIcon = (header: string) => {
    switch (header) {
      case 'Order Date':
      case 'Tenor':
      case 'Collateral Amount':
      case 'Order Limit':
        return (
          <Button
            title='Click to sort column'
            className={styles.sort}
            onClick={() => {
              updateSort(header, true);
            }}
          >
            <Sort />
          </Button>
        );
      case 'Currency Pair': {
        return (
          <>
            <Button
              title='Click to view filter options'
              className={styles.filter}
              onClick={() => showFilterBar(header)}
            >
              <Filter />
            </Button>
            <div
              className={`${styles.filterDropdown} ${!visible ? styles.hide : header !== filterHeader ? styles.hide : ''
                }`}
              ref={containerRef}
            >
              {CURRENCY_PAIR_LABEL.map((item: FilterItemProps, idx: number) => {
                return <CheckBox key={idx} label={item.label} component={item.component} />;
              })}
              <Button
                title='Click to clear filter options'
                className={`${styles.clearAll} ${sideArray.length > 0 ? styles.selected : ''}`}
                onClick={() => clearFilterArray('side')}
              >
                Clear All
              </Button>
            </div>
          </>
        );
      }
      case 'Product': {
        return (
          <>
            <Button
              title='Click to view filter options'
              className={styles.filter}
              onClick={() => showFilterBar(header)}
            >
              <Filter />
            </Button>
            <div
              className={`${styles.filterDropdown} ${!visible ? styles.hide : header !== filterHeader ? styles.hide : ''
                }`}
              ref={productRef}
            >
              {PRODUCT_LABEL.map((item: string, idx: number) => {
                return (
                  <CheckBox key={idx} label={item} onChange={selectedLabeStatus} clearCheckMark={productChecked} />
                );
              })}
              <Button
                title='Click to clear filter options'
                className={`${styles.clearAll} ${productArray.length > 0 ? styles.selected : ''}`}
                onClick={() => clearFilterArray('product')}
              >
                Clear All
              </Button>
            </div>
          </>
        );
      }
      case 'Side': {
        return (
          <>
            <Button
              title='Click to view filter options'
              className={styles.filter}
              onClick={() => showFilterBar(header)}
            >
              <Filter />
            </Button>
            <div
              className={`${styles.filterDropdown} ${!visible ? styles.hide : header !== filterHeader ? styles.hide : ''
                }`}
              ref={sideRef}
            >
              {SIDE_LABEL.map((item: FilterItemProps, idx: number) => {
                return (
                  <CheckBox
                    key={idx}
                    label={item.label}
                    component={item.component}
                    onChange={selectedLabeStatus}
                    clearCheckMark={sideChecked}
                  />
                );
              })}
              <Button
                title='Click to clear filter options'
                className={`${styles.clearAll} ${sideArray.length > 0 ? styles.selected : ''}`}
                onClick={() => clearFilterArray('side')}
              >
                Clear All
              </Button>
            </div>
          </>
        );
      }
      default:
        return null;
    }
  };

  return (
    <>
      <div className={styles.table}>
        <div className={`${styles.row} ${styles.header}`}>
          {TABLE_ORDER_HEADERS.map((header, idx) => (
            <div className={styles.cell} key={idx}>
              {header} {getHeaderIcon(header)}
            </div>
          ))}
        </div>
        {slicedData.map((row, rowIndex) => {
          const isRowExpanded = expandedRow.includes(rowIndex);

          return (
            <Fragment key={rowIndex}>
              <div className={`${styles.row} ${isRowExpanded ? styles.isExpanded : ''}`}>
                <div onClick={() => handleRowExpand(rowIndex)} className={styles.cell}>
                  <Button
                    title='Click to expand dropdown'
                    className={`${styles.dropdown} ${expandedRow.includes(rowIndex) ? styles.isActive : ''}`}
                  >
                    <Dropdown />
                  </Button>
                </div>
                <div className={styles.cell}>{renderDate(row.orderDate)}</div>
                <div className={styles.cell}>
                  <div className={styles.currency}>{formatCurrencyPair(row.currencyPair)}</div>
                </div>
                <div className={styles.cell}>{row.product}</div>
                <div className={styles.cell}>{getSideIcon(row.side)}</div>
                <div className={styles.cell}>{renderDate(row.tenor)}</div>
                <div className={styles.cell}>
                  <CollateralAmount wethAmount={row.wethAmount} usdcAmount={row.usdcAmount} />
                </div>
                <div className={styles.cell}>{row.orderLimit}</div>
                <div className={styles.cell}>
                  <Button
                    title='Click to cancel order'
                    className={styles.delete}
                    onClick={() => handleCancelOrderClick(rowIndex)}
                  >
                    <Delete />
                  </Button>
                </div>
              </div>
              <AnimatePresence>
                {isRowExpanded && (
                  <motion.div
                    className={styles.tableRowExpanded}
                    initial='closed'
                    animate='open'
                    exit='closed'
                    variants={variants}
                  >
                    {row.expandedInfo && <ExpandedTable data={row.expandedInfo} />}
                  </motion.div>
                )}
              </AnimatePresence>
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
            </Fragment>
          );
        })}
      </div>
      <Flex direction='row-space-between' margin='mt-35'>
        <TableDescription
          possibleReleaseX={10}
          possibleReleaseY={20}
          postOptimisationX={8}
          postOptimisationY={18}
          totalCollateral={30}
        />
        <Pagination
          totalItems={data.length}
          itemsPerPage={pageLimit}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </Flex>
    </>
  );
};

export default TableOrder;
