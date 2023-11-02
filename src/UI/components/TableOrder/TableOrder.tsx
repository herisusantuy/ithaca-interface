import React, { useEffect, useState } from 'react';

import styles from '@/UI/components/TableOrder/TableOrder.module.scss';
import Dropdown from '@/UI/components/Icons/Dropdown';
import LogoEth from '@/UI/components/Icons/LogoEth';
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';
import Plus from '@/UI/components/Icons/Plus';
import CloseProp from '@/UI/components/Icons/CloseProp';
import {
  TableOrderHeaderType,
  DUMMY_TABLEORDER_HEADER,
  DUMMY_TABLE_DATA,
  RowType,
  TableListProps,
} from '@/UI/constants/tables';
import Minus from '../Icons/Minus';
import Next from '../Icons/Next';
import Sort from '../Icons/Sort';
import Filter from '../Icons/Filter';

const TableOrder = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [expandItem, setExpandItem] = useState<null | number>(null);
  const pageLimit = 5;

  useEffect(() => {
    const totalDataCount = DUMMY_TABLE_DATA.length;
    const divValue = totalDataCount / pageLimit;
    if (Number.isInteger(divValue)) {
      setTotalPageCount(divValue);
    } else {
      setTotalPageCount(parseInt(divValue.toString()) + 1);
    }

    const start = (currentPage - 1) * pageLimit;
    const end = (currentPage - 1) * pageLimit + pageLimit - 1;

    setStart(start);
    setEnd(end);
  }, []);

  const updatePage = (page: number) => {
    if (page > totalPageCount) {
      setCurrentPage(currentPage);
    } else {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    const start = (currentPage - 1) * pageLimit;
    const end = (currentPage - 1) * pageLimit + pageLimit - 1;
    setStart(start);
    setEnd(end);
    pageNavigationRender();
  }, [currentPage]);

  const expand = (idx: number) => {
    if (idx === expandItem) {
      setExpandItem(null);
    } else {
      setExpandItem(idx);
    }
  };

  const pageNavigationRender = () => {
    if (currentPage <= 5) {
      return (
        <>
          <div
            className={`${styles.navigationItem} ${currentPage == 1 ? styles.active : ''}`}
            onClick={() => updatePage(1)}
          >
            1
          </div>
          <div
            className={`${styles.navigationItem} ${currentPage == 2 ? styles.active : ''} ${
              totalPageCount < 2 ? styles.disabled : ''
            }`}
            onClick={() => updatePage(2)}
          >
            2
          </div>
          <div
            className={`${styles.navigationItem} ${currentPage == 3 ? styles.active : ''} ${
              totalPageCount < 3 ? styles.disabled : ''
            }`}
            onClick={() => updatePage(3)}
          >
            3
          </div>
          <div
            className={`${styles.navigationItem} ${currentPage == 4 ? styles.active : ''} ${
              totalPageCount < 4 ? styles.disabled : ''
            }`}
            onClick={() => updatePage(4)}
          >
            4
          </div>
          <div
            className={`${styles.navigationItem} ${currentPage == 5 ? styles.active : ''} ${
              totalPageCount < 5 ? styles.disabled : ''
            }`}
            onClick={() => updatePage(5)}
          >
            5
          </div>
          <div
            className={`${styles.navigationItem} ${totalPageCount < currentPage + 1 ? styles.disabled : ''}`}
            onClick={() => updatePage(currentPage + 1)}
          >
            <Next />
          </div>
        </>
      );
    }

    if (currentPage > 5) {
      if (currentPage <= totalPageCount - 2) {
        return (
          <>
            <div className={`${styles.navigationItem}`} onClick={() => updatePage(currentPage - 2)}>
              {currentPage - 2}
            </div>
            <div className={`${styles.navigationItem}`} onClick={() => updatePage(currentPage - 1)}>
              {currentPage - 1}
            </div>

            <div className={`${styles.navigationItem} ${styles.active}`} onClick={() => updatePage(currentPage)}>
              {currentPage}
            </div>
            <div
              className={`${styles.navigationItem} ${currentPage + 1 > totalPageCount ? styles.disabled : ''}`}
              onClick={() => updatePage(currentPage + 1)}
            >
              {currentPage + 1}
            </div>
            <div
              className={`${styles.navigationItem} ${currentPage + 2 > totalPageCount ? styles.disabled : ''}`}
              onClick={() => updatePage(currentPage + 2)}
            >
              {currentPage + 2}
            </div>
            <div
              className={`${styles.navigationItem} ${currentPage >= totalPageCount ? styles.disabled : ''}`}
              onClick={() => updatePage(currentPage + 1)}
            >
              <Next />
            </div>
          </>
        );
      }
      if (currentPage <= totalPageCount - 1) {
        return (
          <>
            <div className={`${styles.navigationItem}`} onClick={() => updatePage(currentPage - 3)}>
              {currentPage - 3}
            </div>
            <div className={`${styles.navigationItem}`} onClick={() => updatePage(currentPage - 2)}>
              {currentPage - 2}
            </div>

            <div className={`${styles.navigationItem}`} onClick={() => updatePage(currentPage - 1)}>
              {currentPage - 1}
            </div>
            <div className={`${styles.navigationItem} ${styles.active}`} onClick={() => updatePage(currentPage)}>
              {currentPage}
            </div>
            <div className={`${styles.navigationItem}`} onClick={() => updatePage(currentPage + 1)}>
              {currentPage + 1}
            </div>
            <div
              className={`${styles.navigationItem} ${currentPage >= totalPageCount ? styles.disabled : ''}`}
              onClick={() => updatePage(currentPage + 1)}
            >
              <Next />
            </div>
          </>
        );
      }
      if (currentPage == totalPageCount) {
        return (
          <>
            <div className={`${styles.navigationItem}`} onClick={() => updatePage(currentPage - 4)}>
              {currentPage - 4}
            </div>
            <div className={`${styles.navigationItem}`} onClick={() => updatePage(currentPage - 3)}>
              {currentPage - 3}
            </div>

            <div className={`${styles.navigationItem}`} onClick={() => updatePage(currentPage - 2)}>
              {currentPage - 2}
            </div>
            <div className={`${styles.navigationItem}`} onClick={() => updatePage(currentPage - 1)}>
              {currentPage - 1}
            </div>
            <div className={`${styles.navigationItem} ${styles.active}`} onClick={() => updatePage(currentPage)}>
              {currentPage}
            </div>
            <div className={`${styles.navigationItem} ${styles.disabled}`} onClick={() => updatePage(currentPage + 1)}>
              <Next />
            </div>
          </>
        );
      }
    }
  };

  const renderTableContent = (row: RowType, rowIndex: number) => {
    if (row.type === 'detail') {
      return (
        <div
          className={`${styles.cursor} ${rowIndex === expandItem ? styles.rotate : ''}`}
          onClick={() => expand(rowIndex)}
        >
          <Dropdown />
        </div>
      );
    }
    if (row.type === 'text') {
      return <p>{row.value}</p>;
    }
    if (row.type === 'collateral') {
      return (
        <div className={styles.collateralContainer}>
          <div className={styles.content}>
            <p>{row.collateral?.from.val}</p>
            {row.collateral?.from.icon == 'eth' ? <LogoEth /> : <LogoUsdc />}
            <span>{row.collateral?.from.name}</span>
          </div>
          <div className={styles.content}>
            <p>{row.collateral?.to.val}</p>
            {row.collateral?.to.icon == 'eth' ? <LogoEth /> : <LogoUsdc />}
            <span>{row.collateral?.to.name}</span>
          </div>
        </div>
      );
    }
    if (row.type === 'close') {
      return <CloseProp />;
    }
    if (row.type === 'side') {
      return row.value == 'plus' ? <Plus /> : <Minus />;
    }
    if (row.type === 'compare') {
      return (
        <>
          {row.compare?.from === 'WETH' ? <LogoEth /> : <LogoUsdc />}
          {row.compare?.from} / {row.compare?.to === 'WETH' ? <LogoEth /> : <LogoUsdc />}
          {row.compare?.to}
        </>
      );
    }
  };

  const renderHeaderItemTool = (row: TableOrderHeaderType) => {
    switch (row.type) {
      case 'sort':
        return <Sort />;
      case 'filter':
        return <Filter />;
      case 'color_filter':
        return <Filter color='#5EE192' />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.tableContainer}>
      <div className={`${styles.gridRow} ${styles.gridHeader}`}>
        {DUMMY_TABLEORDER_HEADER.map((row: TableOrderHeaderType, idx: number) => {
          return (
            <div
              className={
                row.dir == 'right'
                  ? `${styles.gridItem} ${styles.gridAlighRight} ${styles.cursor}`
                  : `${styles.gridItem} ${styles.cursor}`
              }
              key={idx}
            >
              {row.name == 'action' ? '' : row.name}
              {renderHeaderItemTool(row)}
            </div>
          );
        })}
      </div>
      {DUMMY_TABLE_DATA.map((data: TableListProps, k: number) => {
        if (k >= start && k <= end) {
          return (
            <>
              <div className={styles.gridRow} key={k}>
                {data.data.map((row: RowType, idx: number) => {
                  return (
                    <div className={styles.gridItem} key={idx}>
                      {renderTableContent(row, k)}
                    </div>
                  );
                })}
              </div>
              <div className={k == expandItem ? styles.extendItem : styles.hideExtendItem}>This is ExtendItem</div>
            </>
          );
        }
      })}
      <div className={styles.gridFooter}>
        <div className={styles.gridFooterDescription}>
          <p>
            Possible Collateral release: X <LogoEth />, Y <LogoUsdc />
          </p>
          <p>
            Expected Collateral Value Post Execution Collateral Optimisation: {'{value} '} <LogoEth />, {'{value}'}{' '}
            <LogoUsdc />
          </p>
          <p>Total Collateral: {'{amount}'}</p>
        </div>
        <div className={styles.pageNavigation}>{pageNavigationRender()}</div>
      </div>
    </div>
  );
};

export default TableOrder;
