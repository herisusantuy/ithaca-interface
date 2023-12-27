import { useCallback, useEffect, useRef, useState } from 'react';
// Utils
import { CURRENCY_PAIR_LABEL, FilterItemProps, PRODUCT_LABEL, SIDE_LABEL } from '@/UI/utils/TableOrder';

// Hooks
import { useEscKey } from '@/UI/hooks/useEscKey';

// Components
import Button from '@/UI/components/Button/Button';
import { CheckBoxControlled } from '@/UI/components/CheckBox/CheckBox';
import Sort from '@/UI/components/Icons/Sort';

// Styles
import styles from '../TableOrder.module.scss';
import { getTableHeaders } from '../helpers';
import { Separator } from './SingleOrderRow';
import { ClearFilters, ShowFilterButton } from './helperComponents';
import { TABLE_TYPE } from './Orders';

interface HeaderColumnsProps {
  updateSort: (header: string, dir: boolean) => void;
  currencyArray: string[];
  clearFilterArray: (type: string) => void;
  productArray: string[];
  sideArray: string[];
  setSideArray: (arr: string[]) => void;
  setProductArray: (arr: string[]) => void;
  setCurrencyArray: (arr: string[]) => void;
  type: TABLE_TYPE;
  handleCancelAllOrder: () => void;
}

const HeaderColumns = (props: HeaderColumnsProps) => {
  const {
    updateSort,
    currencyArray,
    clearFilterArray,
    productArray,
    sideArray,
    setSideArray,
    setProductArray,
    setCurrencyArray,
    type,
    handleCancelAllOrder,
  } = props;
  const [filterHeader, setFilterHeader] = useState<string | null>(null);
  
  // Define Ref variables for outside clickable
  const sideRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const productRef = useRef<HTMLDivElement | null>(null);

  const selectedLabeStatus = (label: string, isChecked: boolean) => {
    if (filterHeader == 'Currency Pair') {
      if (isChecked) {
        setCurrencyArray([...currencyArray, label]);
      } else {
        setCurrencyArray(currencyArray.filter((item: string) => item !== label));
      }
    } else if (filterHeader == 'Product') {
      if (isChecked) {
        setProductArray([...productArray, label.toUpperCase()]);
      } else {
        setProductArray(productArray.filter((item: string) => item !== label.toUpperCase()));
      }
    } else if (filterHeader == 'Side') {
      if (isChecked) {
        setSideArray([...sideArray, label.toUpperCase()]);
      } else {
        setSideArray(sideArray.filter((item: string) => item !== label.toUpperCase()));
      }
    }
  };

  // Set visible filter bar for show/hide filter box
  const showFilterBar = (header: string) => () => {
    if (header === filterHeader) {
      setFilterHeader(null);
    } else {
      setFilterHeader(header);
    }
  };

  // Close Esc key for dropdown menu filter
  useEscKey(() => {
    if (filterHeader) {
      setFilterHeader(null);
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
        setFilterHeader(null);
      }
    };

    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  const getHeaderIcon = (header: string) => {
    const filterClass = header === filterHeader ? '' : styles.hide;
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
            <ShowFilterButton onClick={showFilterBar(header)} fill={currencyArray.length > 0} />
            <div className={`${styles.filterDropdown} ${filterClass}`} ref={containerRef}>
              {CURRENCY_PAIR_LABEL.map((item: FilterItemProps, idx: number) => {
                return (
                  <CheckBoxControlled
                    checked={currencyArray.includes(item.label.toUpperCase())}
                    key={idx}
                    label={item.label}
                    component={item.component}
                    onChange={selectedLabeStatus}
                  />
                );
              })}
              <ClearFilters
                onClick={() => clearFilterArray('currency')}
                className={currencyArray.length > 0 ? styles.selected : ''}
              />
            </div>
          </>
        );
      }
      case 'Product': {
        return (
          <>
            <ShowFilterButton onClick={showFilterBar(header)} fill={productArray.length > 0} />
            <div className={styles.filterDropdownContainer}>
              <div className={`${styles.filterDropdown} ${filterClass}`} ref={productRef}>
                {PRODUCT_LABEL.map((item: string, idx: number) => {
                  return (
                    <CheckBoxControlled
                      checked={productArray.includes(item.toUpperCase())}
                      key={idx}
                      label={item}
                      onChange={selectedLabeStatus}
                    />
                  );
                })}
                <ClearFilters
                  onClick={() => clearFilterArray('product')}
                  className={productArray.length > 0 ? styles.selected : ''}
                />
              </div>
            </div>
          </>
        );
      }
      case 'Side': {
        return (
          <>
            <ShowFilterButton onClick={showFilterBar(header)} fill={sideArray.length > 0} />
            <div className={`${styles.filterDropdown} ${filterClass}`} ref={sideRef}>
              {SIDE_LABEL.map((item: FilterItemProps, idx: number) => {
                return (
                  <CheckBoxControlled
                    checked={sideArray.includes(item.label.toUpperCase())}
                    key={idx}
                    label={item.label}
                    component={item.component}
                    onChange={selectedLabeStatus}
                  />
                );
              })}
              <ClearFilters
                onClick={() => clearFilterArray('side')}
                className={sideArray.length > 0 ? styles.selected : ''}
              />
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
              {header}
              {getHeaderIcon(header)}
            </>
          );
      }
    },
    [handleCancelAllOrder, filterHeader, sideArray]
  );

  return (
    <>
      {getTableHeaders(type).map((header, idx) => {
        if (typeof header !== 'string') {
          return (
            <div className={styles.cell} key={idx} style={{ justifyContent: header.alignment }}>
              {getHeaderTemplate(header.name)}
            </div>
          );
        }
      })}
      {/* Bottom border of headers */}
      <Separator />
    </>
  );
};

export default HeaderColumns;
