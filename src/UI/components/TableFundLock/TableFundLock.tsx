// Packages
import { useEffect, useRef, useState } from 'react';

// Constants
import { TABLE_FUND_LOCK_HEADERS, TableFundLockDataProps } from '@/UI/constants/tableFundLock';

// Utils
import { AUCTION_LABEL, CURRENCY_PAIR_LABEL, FilterItemProps, renderDate } from '@/UI/utils/TableOrder';
import { auctionFilter, currencyFilter, foundLockAmountDataSort, foundLockOrderDateSort } from '@/UI/utils/TableFund';

// Hooks
import { useEscKey } from '@/UI/hooks/useEscKey';

// Components
import Button from '@/UI/components/Button/Button';
import CurrencyDisplay from '@/UI/components/CurrencyDisplay/CurrencyDisplay';
import LogoEth from '@/UI/components/Icons/LogoEth';
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';
import Pagination from '@/UI/components/Pagination/Pagination';
import Asset from '@/UI/components/Asset/Asset';
import Sort from '@/UI/components/Icons/Sort';
import Filter from '@/UI/components/Icons/Filter';
import CheckBox from '@/UI/components/CheckBox/CheckBox';

// Layouts
import Flex from '@/UI/layouts/Flex/Flex';

// Styles
import styles from './TableFundLock.module.scss';
import { useAccount } from 'wagmi';
import DisconnectedWallet from '../DisconnectedWallet/DisconnectedWallet';

// Types
type TableFundLockProps = {
  data: TableFundLockDataProps[];
};

const TableFundLock = ({ data }: TableFundLockProps) => {
  const { address, isDisconnected } = useAccount();
  const [slicedData, setSlicedData] = useState<TableFundLockDataProps[]>([]);
  const [sortHeader, setSortHeader] = useState<string>('');
  const [filterHeader, setFilterHeader] = useState<string>('');
  const [direction, setDirection] = useState<boolean>(true);
  const [visible, setVisible] = useState<boolean>(false);
  const [currencyArray, setCurrencyArray] = useState<string[]>([]);
  const [currencyChecked, setCurrencyChecked] = useState<boolean>(false);
  const [auctionArray, setAuctionArray] = useState<string[]>([]);
  const [auctionChecked, setAuctionChecked] = useState<boolean>(false);

  const currencyRef = useRef<HTMLDivElement | null>(null);
  const auctionRef = useRef<HTMLDivElement | null>(null);
  const pageLimit = 9;

  // Page state
  const [currentPage, setCurrentPage] = useState(1);

  // Get start and end pages
  const pageStart = (currentPage - 1) * pageLimit;
  const pageEnd = pageStart + pageLimit;

  // Handle page change in pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        currencyRef.current &&
        !currencyRef.current.contains(event.target as Node) &&
        auctionRef.current &&
        !auctionRef.current.contains(event.target as Node)
      ) {
        setVisible(false);
      }
    };

    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    let filterData = currencyFilter(data, currencyArray);
    filterData = auctionFilter(filterData, auctionArray);
    setSlicedData(filterData.slice(pageStart, pageEnd));
  }, [data, currencyArray, pageEnd, pageStart, auctionArray]);

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

  const selectedLabeStatus = (label: string, status: boolean) => {
    if (filterHeader == 'Currency') {
      console.log(filterHeader);
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
    } else if (filterHeader == 'Auction') {
      setAuctionChecked(false);
      const filter = auctionArray.slice();
      if (status) {
        filter.push(label);
        setAuctionArray(filter);
      } else {
        const indexToRemove = filter.indexOf(label);
        if (indexToRemove !== -1) {
          filter.splice(indexToRemove, 1);
          setAuctionArray(filter);
        }
      }
    }
  };

  const clearFilterArray = (label: string) => {
    switch (label) {
      case 'Currency': {
        setCurrencyChecked(true);
        return setCurrencyArray([]);
      }
      case 'Auction': {
        setAuctionChecked(true);
        return setAuctionArray([]);
      }
      default:
        return null;
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
        const sortData = foundLockOrderDateSort(slicedData, sortDirection);
        setSlicedData(sortData.slice(pageStart, pageEnd));
        break;
      }
      case 'Amount': {
        console.log(slicedData);
        const sortData = foundLockAmountDataSort(slicedData, sortDirection);
        setSlicedData(sortData.slice(pageStart, pageEnd));
        break;
      }
      default:
        return null;
    }
  };

  const getHeaderIcon = (header: string) => {
    switch (header) {
      case 'Order Date':
      case 'Amount':
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
      case 'Currency': {
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
              className={`${styles.filterDropdown} ${
                !visible ? styles.hide : header !== filterHeader ? styles.hide : ''
              }`}
              ref={currencyRef}
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
                onClick={() => clearFilterArray('Currency')}
              >
                Clear All
              </Button>
            </div>
          </>
        );
      }
      case 'Auction': {
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
              className={`${styles.filterDropdown} ${
                !visible ? styles.hide : header !== filterHeader ? styles.hide : ''
              }`}
              ref={auctionRef}
            >
              {AUCTION_LABEL.map((item: string, idx: number) => {
                return (
                  <CheckBox key={idx} label={item} onChange={selectedLabeStatus} clearCheckMark={auctionChecked} />
                );
              })}
              <Button
                title='Click to clear filter options'
                className={`${styles.clearAll} ${auctionArray.length > 0 ? styles.selected : ''}`}
                onClick={() => clearFilterArray('Auction')}
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
  const tableClass = `${styles.table} ${isDisconnected ? styles.isOpacity : ''}`;

  return (
    <>
      <div className={tableClass.trim()}>
        <div className={styles.header}>
          {TABLE_FUND_LOCK_HEADERS.map((header, idx) => (
            <div className={styles.cell} key={idx}>
              {header} {getHeaderIcon(header)}
            </div>
          ))}
        </div>
        {slicedData.length > 0 ? (
          slicedData.map((item, index) => (
            <div className={styles.row} key={index}>
              <div className={styles.cell}>{renderDate(item.orderData)}</div>
              <div className={styles.cell}>
                <Asset size='sm' icon={<LogoEth />} label={item.asset} />
              </div>
              <div className={styles.cell}>{item.auction}</div>
              <div className={styles.cell}>
                <CurrencyDisplay size='md' amount={item.amount} symbol={<LogoUsdc />} currency={item.currency} />
              </div>
            </div>
          ))
        ) : (
          <p className={styles.emptyTable}>No results found</p>
        )}
      </div>
      {slicedData.length > 0 ? (
        <Flex direction='row-space-between' margin='mt-35'>
          <div></div>
          <Pagination
            totalItems={data.length}
            itemsPerPage={pageLimit}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </Flex>
      ) : null}
      {!address && <DisconnectedWallet showButton={false} />}
    </>
  );
};

export default TableFundLock;
