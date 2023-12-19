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
import styles from './TableOrder.module.scss';
import Container from '@/UI/layouts/Container/Container';
import Loader from '../Loader/Loader';
import DropdownOutlined from '../Icons/DropdownOutlined';
import ExpandedPositionTable from './ExpandedPositionTable';

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

const TableOrder = ({ type, cancelOrder = true, description = true }: TableOrderProps) => {
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
  const [headers, setHeaders] = useState<string[]>(TABLE_ORDER_HEADERS);
  const [sortHeader, setSortHeader] = useState<string>('');
  const [filterHeader, setFilterHeader] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(true);
  const [direction, setDirection] = useState<boolean>(true);
  const [visible, setVisible] = useState<boolean>(false);
  const [currencyArray, setCurrencyArray] = useState<string[]>([]);
  const [currencyChecked, setCurrencyChecked] = useState<boolean>(false);
  const [productArray, setProductArray] = useState<string[]>([]);
  const [productChecked, setProductChecked] = useState<boolean>(false);
  const [sideArray, setSideArray] = useState<string[]>([]);
  const [sideChecked, setSideChecked] = useState<boolean>(false);
  const { ithacaSDK, isAuthenticated, unFilteredContractList } = useAppStore();

  // Define Ref variables for outside clickable
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sideRef = useRef<HTMLDivElement | null>(null);
  const productRef = useRef<HTMLDivElement | null>(null);

  const dataToRows = (res: Order[]) => {
    setData(
      res.map(row => ({
        clientOrderId: row.orderId,
        details: '',
        orderDate: dayjs(row.revDate).format('DD MMM YY HH:mm'),
        currencyPair: row.collateral?.currencyPair || row.details[0].currencyPair,
        product: row.orderDescr,
        side: row.details.length === 1 ? row.details[0].side : '',
        tenor: dayjs(row.details[0].expiry.toString(), 'YYYYMMDD').format('DD MMM YY'),
        wethAmount: row.collateral?.underlierAmount,
        usdcAmount: row.collateral?.numeraireAmount,
        orderLimit: row.netPrice,
        expandedInfo: row.details.map(leg => ({
          type: leg.contractDto.payoff,
          side: leg.side,
          expiryDate: dayjs(leg.expiry.toString(), 'YYYYMMDD').format('DD MMM YY'),
          size: leg.originalQty,
          strike: leg.contractDto.economics.strike,
          enterPrice: leg.execPrice,
        })),
      })) as TableRowDataWithExpanded[]
    );
  };

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
          tenor: dayjs(contract?.economics.expiry.toString(), 'YYYYMMDD').format('DD MMM YY'), // Look up from contract
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
            dataToRows(res);
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
            dataToRows(res);
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

  // useEffect(() => {
  //   setData(TABLE_ORDER_DATA_WITH_EXPANDED);
  // }, []);

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
    filterData = currencyFilter(filterData, currencyArray);
    setSlicedData(filterData.slice(pageStart, pageEnd));
  }, [data, productArray, pageEnd, pageStart, sideArray, currencyArray]);

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
    if (filterHeader == 'Currency Pair') {
      setCurrencyChecked(false);
      const filter = currencyArray.slice();
      if (status) {
        filter.push(label);
        setCurrencyArray(filter);
      } else {
        const indexToRemove = filter.indexOf(label);
        if (indexToRemove !== -1) {
          filter.splice(indexToRemove, 1);
          setCurrencyArray(filter);
        }
      }
    } else if (filterHeader == 'Product') {
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
        setCurrencyChecked(true);
        return setCurrencyArray([]);
      }
    }
  };

  const getTableHeaders = useCallback(() => {
    switch (type) {
      case TABLE_TYPE.ORDER:
        return TABLE_ORDER_HEADERS_FOR_POSITIONS;
      default:
        return TABLE_ORDER_HEADERS;
    }
  }, [type]);

  const getHeaderTemplate = useCallback((header: string) => {
    switch (header) {
      case 'Cancel All':
        return (
          <Button
            title='Click to cancel all orders'
            className={styles.cancelAllBtn}
            onClick={handleCancelAllOrder}
            variant='link'
          >
            Cancel All
          </Button>
        );
      default:
        return (
          <>
            {header} {getHeaderIcon(header)}
          </>
        );
    }
  }, []);

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
              <Filter fill={currencyArray.length > 0 ? true : false} />
            </Button>
            <div
              className={`${styles.filterDropdown} ${
                !visible ? styles.hide : header !== filterHeader ? styles.hide : ''
              }`}
              ref={containerRef}
            >
              {CURRENCY_PAIR_LABEL.map((item: FilterItemProps, idx: number) => {
                return (
                  <CheckBox
                    key={idx}
                    label={item.label}
                    component={item.component}
                    onChange={selectedLabeStatus}
                    clearCheckMark={currencyChecked}
                  />
                );
              })}
              <Button
                title='Click to clear filter options'
                className={`${styles.clearAll} ${currencyArray.length > 0 ? styles.selected : ''}`}
                onClick={() => clearFilterArray('currency')}
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
              <Filter fill={productArray.length > 0 ? true : false} />
            </Button>
            <div
              className={`${styles.filterDropdown} ${
                !visible ? styles.hide : header !== filterHeader ? styles.hide : ''
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
              <Filter fill={sideArray.length > 0 ? true : false} />
            </Button>
            <div
              className={`${styles.filterDropdown} ${
                !visible ? styles.hide : header !== filterHeader ? styles.hide : ''
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

  // Get table className
  const tableClass = `${styles.table} ${!isAuthenticated ? styles.isOpacity : ''} ${
    type === TABLE_TYPE.ORDER ? styles.isOrder : ''
  }`;

  const getTableRowTemplate = (row: TableRowDataWithExpanded, rowIndex: number) => {
    switch (type) {
      case TABLE_TYPE.ORDER:
        return (
          <>
            <div className={`${styles.cell}`}>{row.product}</div>
            <div className={styles.cell}>{row.usdcAmount}</div>
            <div className={styles.cell}>{row.tenor && renderDate(row.tenor)}</div>
            <div className={styles.cell}>{row.orderLimit}</div>
          </>
        );
      default:
        return (
          <>
            <div className={styles.cell}>{row.orderDate && renderDate(row.orderDate)}</div>
            <div className={styles.cell}>
              <div className={styles.currency}>{row.currencyPair}</div>
            </div>
            <div className={styles.cell}>{row.product}</div>
            <div className={styles.cell}>{getSideIcon(row.side)}</div>
            <div className={styles.cell}>{row.tenor && renderDate(row.tenor)}</div>
            <div className={styles.cell}>
              <CollateralAmount wethAmount={row.wethAmount} usdcAmount={row.usdcAmount} />
            </div>
            <div className={styles.cell}>{row.orderLimit}</div>
            <div className={styles.cell}>
              {cancelOrder && (
                <Button
                  title='Click to cancel order'
                  className={styles.delete}
                  onClick={() => handleCancelOrderClick(rowIndex)}
                >
                  <Delete />
                </Button>
              )}
            </div>
          </>
        );
    }
  };

  const getExpandedTableTemplate = (row: TableRowDataWithExpanded) => {
    switch (type) {
      case TABLE_TYPE.ORDER:
        return <ExpandedPositionTable data={row.expandedInfo || []} />;
      default:
        return <ExpandedTable data={row.expandedInfo || []} />;
    }
  };

  return (
    <>
      <div className={tableClass.trim()}>
        <div className={`${styles.row} ${styles.header}`}>
          {getTableHeaders().map((header, idx) => (
            <div className={styles.cell} key={idx}>
              {getHeaderTemplate(header)}
            </div>
          ))}
        </div>
        {slicedData.length > 0 ? (
          slicedData.map((row, rowIndex) => {
            const isRowExpanded = expandedRow.includes(rowIndex);

            return (
              <Fragment key={rowIndex}>
                <div className={`${styles.row} ${isRowExpanded ? styles.isExpanded : ''}`}>
                  <div onClick={() => handleRowExpand(rowIndex)} className={styles.cell}>
                    <Button
                      title='Click to expand dropdown'
                      className={`${styles.dropdown} ${expandedRow.includes(rowIndex) ? styles.isActive : ''}`}
                    >
                      <DropdownOutlined />
                    </Button>
                  </div>
                  {getTableRowTemplate(row, rowIndex)}
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
                      {row.expandedInfo && getExpandedTableTemplate(row)}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Fragment>
            );
          })
        ) : isLoading ? (
          <Container size='loader' margin='ptb-150'>
            <Loader type='lg' />
          </Container>
        ) : (
          <p className={styles.emptyTable}>No results found</p>
        )}
      </div>

      <Flex direction='row-space-between' margin='mt-35'>
        {description ? (
          <TableDescription
            {...collateralData}
            // totalCollateral={30}
          />
        ) : (
          <div />
        )}
        <Pagination
          totalItems={data.length}
          itemsPerPage={pageLimit}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </Flex>

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
      {!isAuthenticated && <DisconnectedWallet showButton={false} />}
    </>
  );
};

export default TableOrder;
