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
dayjs.extend(customParseFormat);

const HeaderColumns = props => {
  const {
    updateSort,
    currencyArray,
    containerRef,
    clearFilterArray,
    productArray,
    productRef,
    sideArray,
    setSideArray,
    setProductArray,
    setCurrencyArray,
    type,
    handleCancelAllOrder,
  } = props;
  const [productChecked, setProductChecked] = useState<boolean>(false);
  const [filterHeader, setFilterHeader] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);
  const sideRef = useRef<HTMLDivElement | null>(null);
  const [currencyChecked, setCurrencyChecked] = useState<boolean>(false);
  const [sideChecked, setSideChecked] = useState<boolean>(false);
  const selectedLabeStatus = (label: string, status: boolean) => {
    console.log("DEBUG INFO 24/12/2023 10:56:44",'wchodze')
    if (filterHeader == 'Currency Pair') {
      console.log("DEBUG INFO 24/12/2023 10:56:20",'jeden')
      setCurrencyChecked(false);
      const filter = currencyArray.slice();
      console.log("DEBUG INFO 24/12/2023 10:55:55",filter)
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
      // setSideChecked(true)
      const filter = sideArray.slice();
      if (status) {
        filter.push(label.toUpperCase());
        setSideArray(filter);
      } else {
        const indexToRemove = filter.indexOf(label.toUpperCase());
        if (indexToRemove !== -1) {
          filter.splice(indexToRemove, 1);
          setSideArray(filter);
        }
      }
    }
  };

  // Set visible filter bar for show/hide filter box
  const showFilterBar = (header: string) => {
    // console.log("DEBUG INFO 24/12/2023 10:36:34",header, filterHeader)
    if (header === filterHeader) {
      setVisible(!visible);
    } else {
      console.log("DEBUG INFO 24/12/2023 10:37:03",'wchodze')
      setFilterHeader(header);
      setVisible(true);
      
    }
  };
   // Close Esc key for dropdown menu filter
   useEscKey(() => {
    if (visible) {
      setVisible(false);
    }
  });
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
  // console.log("DEBUG INFO 24/12/2023 10:26:17",containerRef)
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
            <div className={styles.filterDropdownContainer}>
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
                onClick={() => {clearFilterArray('side');setSideChecked(false)}}
              >
                Clear All
                {sideChecked ? 'true' : 'false'}
              </Button>
            </div>
            
          </>
        );
      }
      default:
        return null;
    }
  };

  const getHeaderTemplate = useCallback(
    (header: string) => {
      switch (header) {
        case 'Cancel All':
          return (
            <Button
              title='Click to cancel all orders'
              className={styles.cancelAllBtn}
              onClick={handleCancelAllOrder}
              variant='clear'
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [handleCancelAllOrder, visible, filterHeader, sideArray, sideChecked]
  );
  return (
    <>
      {getTableHeaders(type).map((header, idx) => {
        return (
          <>
            <div className={styles.cell} key={idx} style={{ justifyContent: header.alignment }}>
              {getHeaderTemplate(header.name)}
            </div>
          </>
        );
      })}
      <div className={styles.separator} style={{ marginTop: 5, marginBottom: 7 }} />
    </>
  );
};

export default HeaderColumns;
