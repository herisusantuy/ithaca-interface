// Packages
import { ComponentType, Fragment } from 'react';

// Components
import LogoEth from '@/UI/components/Icons/LogoEth';
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';

// Styles
import styles from './TableDescription.module.scss';
import { TableDescriptionProps } from '@/UI/constants/tableOrder';

// Types
type ValueWithIcon = {
  value: number;
  Icon?: ComponentType;
  type?: string;
};

const formatValue = (value: number, type?: string): string => {
  switch (type) {
    case 'eth':
      if (value < 1e2) {
        return value.toFixed(3);
      } else if (value < 1e3) {
        return value.toFixed(2);
      } else if (value < 1e4) {
        return value.toFixed(1);
      } else if (value < 1e5) {
        if (value % 1e3 === 0) {
          return (value / 1e3).toFixed(0) + 'K';
        } else {
          return (value / 1e3).toFixed(1) + 'K';
        }
      } else if (value < 1e6) {
        return (value / 1e3).toFixed(1) + 'K';
      } else if (value < 1e7) {
        return (value / 1e6).toFixed(3) + 'M';
      } else if (value < 1e8) {
        return (value / 1e6).toFixed(2) + 'M';
      } else if (value < 1e9) {
        return (value / 1e6).toFixed(1) + 'M';
      } else {
        return (value / 1e9).toFixed(3) + 'B';
      }
    default:
      if (value < 1e3) {
        return value.toFixed(2);
      } else if (value < 1e4) {
        return value.toFixed(1);
      } else if (value < 1e5) {
        if (value % 1e3 === 0) {
          return value.toFixed(0);
        } else {
          return (value / 1e3).toFixed(1) + 'K';
        }
      } else if (value < 1e6) {
        return (value / 1e3).toFixed(1) + 'K';
      } else if (value < 1e7) {
        return (value / 1e6).toFixed(3) + 'M';
      } else if (value < 1e8) {
        return (value / 1e6).toFixed(2) + 'M';
      } else if (value < 1e9) {
        return (value / 1e6).toFixed(1) + 'M';
      } else {
        return (value / 1e9).toFixed(3) + 'B';
      }
  }
};

const TableDescription = ({
  possibleReleaseX,
  possibleReleaseY,
  postOptimisationX,
  postOptimisationY, // totalCollateral,
}: TableDescriptionProps) => {
  const rows = [
    {
      label: 'Possible Collateral release: ',
      values: [
        { value: possibleReleaseX, Icon: LogoEth, type: 'eth' },
        { value: possibleReleaseY, Icon: LogoUsdc, type: 'usdc' },
      ] as ValueWithIcon[],
    },
    {
      label: 'Expected Collateral Value Post Execution Collateral Optimization: ',
      values: [
        { value: postOptimisationX, Icon: LogoEth, type: 'eth' },
        { value: postOptimisationY, Icon: LogoUsdc, type: 'usdc' },
      ] as ValueWithIcon[],
    },
  ];

  return (
    <div className={styles.container}>
      {rows.map((row, index) => (
        <div key={index} className={styles.row}>
          {row.label}
          {row.values.map((val, idx) => (
            <Fragment key={idx}>
              <span>
                {formatValue(val.value, val.type)} {val.Icon && <val.Icon />}
              </span>
              {idx < row.values.length - 1 && ', '}
            </Fragment>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableDescription;
