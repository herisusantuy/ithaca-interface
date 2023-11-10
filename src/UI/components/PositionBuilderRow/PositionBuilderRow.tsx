// Packages
import { ReactNode, useState } from 'react';

// SDK
import { useAppStore } from '@/UI/lib/zustand/store';

// Utils
import { getContractId, getUnitPrice } from '@/UI/utils/Cakculations';
import { getNumber } from '@/UI/utils/Numbers';

// Components
import Button from '@/UI/components/Button/Button';
import { DotTypes } from '@/UI/components/Dot/Dot';
import LogoEth from '@/UI/components/Icons/LogoEth';
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';
import Minus from '@/UI/components/Icons/Minus';
import Plus from '@/UI/components/Icons/Plus';
import Input from '@/UI/components/Input/Input';
import RadioButton from '@/UI/components/RadioButton/RadioButton';
import PriceLabel from '@/UI/components/PriceLabel/PriceLabel';
import DropdownMenu, { DropDownOption } from '@/UI/components/DropdownMenu/DropdownMenu';

// Layouts
import Flex from '@/UI/layouts/Flex/Flex';
import Panel from '@/UI/layouts/Panel/Panel';

// Styles
import styles from './PositionBuilderRow.module.scss';
import { Payoff } from '@ithaca-finance/sdk';

// Types
type PositionBuilderRowProps = {
  title: string;
  options: (string | ReactNode)[];
  valueOptions: DotTypes[];
  addStrategy: (value: Strategy) => void;
  submitAuction: (value: Strategy) => void;
  id: string;
  isForwards: boolean;
};

export type Strategy = {
  type: string;
  side: string;
  size: number;
  contractId: number;
  strike: number;
  enterPrice: number;
};

type SectionType = {
  name: string;
  style: string;
};

const PositionBuilderRow = ({
  title,
  options,
  valueOptions,
  addStrategy,
  submitAuction,
  id,
  isForwards,
}: PositionBuilderRowProps) => {
  // Store
  const { ithacaSDK, contractList, currentExpiryDate, referencePrices } = useAppStore();

  // State
  const [product, setProduct] = useState<DotTypes>();
  const [side, setSide] = useState<string>('BUY');
  const [size, setSize] = useState<number>(100);
  const [unitPrice, setUnitPrice] = useState<number>();
  const [strike, setStrike] = useState<string>();
  const [strikeList, setStrikeList] = useState<DropDownOption[]>([]);
  const [collateral, setCollateral] = useState<number>();
  const [premium, setPremium] = useState<number>();

  const setData = (
    dataProduct: string,
    dataSide: string,
    dataSize: number,
    dataStrike: number,
    dataUnitPrice?: number
  ) => {
    const contractId = getContractId(
      isForwards ? Payoff.FORWARD : dataProduct,
      dataStrike,
      currentExpiryDate,
      contractList
    );
    const leg = {
      contractId,
      side: dataSide,
      quantity: dataSize,
    };
    setCollateral(ithacaSDK.calculation.calcCollateralRequirement(leg, dataProduct, dataStrike, 4));
    const unit = dataUnitPrice || getUnitPrice(contractId, referencePrices);
    setUnitPrice(unit);
    setPremium(ithacaSDK.calculation.calcPremium(leg, unit || 0, 4));
  };
  // Sections
  const sections: SectionType[] = [
    { name: 'Side', style: styles.side },
    { name: 'Size', style: styles.size },
    { name: 'Strike', style: styles.strike },
    { name: 'Unit Price', style: styles.unitPrice },
    { name: 'Collateral', style: styles.collateral },
    { name: 'Premium', style: styles.premium },
    { name: '', style: styles.action },
  ];

  return (
    <>
      <div className={styles.parent}>
        <div className={styles.title}>
          <h4>{title}</h4>
        </div>
        {title === 'Options' && (
          <>
            {sections.map((section, index) => (
              <div key={index} className={section.style}>
                <p>{section.name}</p>
              </div>
            ))}
            <div className={styles.action}></div>
          </>
        )}
      </div>
      <Panel margin='ptb-8 plr-8 br-20 mb-14 mt-10'>
        <div className={styles.parent}>
          <div className={styles.title}>
            <RadioButton
              options={options}
              valueProps={valueOptions}
              name={`${id}-type`}
              onChange={(value: string) => {
                setProduct(value as DotTypes);
                if (!isForwards) {
                  setUnitPrice(0);
                  setCollateral(undefined);
                  setPremium(undefined);
                  setStrike(undefined);
                  setStrikeList(
                    contractList
                      .reduce((arr: DropDownOption[], v) => {
                        if (v.payoff === value && v.economics.expiry === currentExpiryDate) {
                          arr.push({
                            name: v.economics.strike?.toString() || '',
                            value: v.economics.strike?.toString() || '',
                          });
                        }
                        return arr;
                      }, [])
                      .sort((a: DropDownOption, b: DropDownOption) => getNumber(a.name) - getNumber(b.name))
                  );
                } else {
                  setData(value, side, size, getNumber(strike || ''));
                }
              }}
            />
          </div>
          <div className={styles.side}>
            <RadioButton
              options={[<Plus key={`${id}-buy`} />, <Minus key={`${id}-sell`} />]}
              valueProps={['BUY', 'SELL']}
              name={`${id}-buy-sell`}
              defaultOption='BUY'
              orientation='vertical'
              onChange={(value: string) => {
                setSide(value);
                if (product && (isForwards || strike)) {
                  setData(product, value, size, getNumber(strike || ''));
                }
              }}
            />
          </div>
          <div className={styles.size}>
            <Input
              value={size}
              onChange={value => {
                const val = value.target.value && getNumber(value.target.value);
                setSize(val || 0);
                if (val && product) {
                  setData(product, side, val, getNumber(strike || ''));
                } else {
                  setCollateral(0);
                }
              }}
              icon={<LogoEth />}
            />
          </div>
          <div className={styles.strike}>
            <DropdownMenu
              value={strike}
              options={strikeList}
              onChange={val => {
                setStrike(val);
                if (product) {
                  setData(product, side, size, getNumber(val || ''));
                }
              }}
              iconEnd={<LogoUsdc />}
            />
          </div>
          <div className={styles.unitPrice}>
            <Input
              value={unitPrice}
              onChange={value => {
                const val = value.target.value && getNumber(value.target.value);
                if (product && (isForwards || strike)) {
                  setData(product, side, size, getNumber(strike || ''), val || 0);
                }
              }}
              icon={<LogoUsdc />}
            />
          </div>
          <div className={styles.collateral}>
            <PriceLabel label={collateral || '-'} icon={<LogoEth />} />
          </div>
          <div className={styles.premium}>
            <PriceLabel label={premium || '-'} icon={<LogoUsdc />} />
          </div>
          <div className={styles.action}>
            <Flex gap='gap-5'>
              <Button
                size='sm'
                title='Click to add to Strategy'
                // disabled={!(isForwards || strike) as boolean}
                variant='secondary'
                onClick={() => {
                  if (product && (isForwards || strike)) {
                    const contractId = getContractId(
                      isForwards ? Payoff.FORWARD : product,
                      getNumber(strike || ''),
                      currentExpiryDate,
                      contractList
                    );
                    addStrategy({
                      type: product,
                      side: side || 'BUY',
                      size,
                      contractId,
                      strike: getNumber(strike || ''),
                      enterPrice: unitPrice as number,
                    });
                  }
                }}
              >
                <Plus />
                Strategy
              </Button>
              <Button
                size='sm'
                title='Click to add to submit to auction'
                variant='primary'
                // disabled={!(!isForwards && strike) as boolean}
                onClick={() => {
                  if (product && (isForwards || strike)) {
                    const contractId = getContractId(
                      isForwards ? Payoff.FORWARD : product,
                      getNumber(strike || ''),
                      currentExpiryDate,
                      contractList
                    );
                    submitAuction({
                      type: product,
                      side: side || 'BUY',
                      size,
                      contractId,
                      strike: getNumber(strike || ''),
                      enterPrice: unitPrice as number,
                    });
                  }
                }}
              >
                Submit to Auction
              </Button>
            </Flex>
          </div>
        </div>
      </Panel>
    </>
  );
};

export default PositionBuilderRow;
