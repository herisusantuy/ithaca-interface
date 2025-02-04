/* eslint-disable react-hooks/exhaustive-deps */
// Packages
import { useEffect, useState } from 'react';

// SDK
import { useAppStore } from '@/UI/lib/zustand/store';

// Utils
import { getNumber, getNumberValue, isInvalidNumber } from '@/UI/utils/Numbers';

// Components
import LogoEth from '@/UI/components/Icons/LogoEth';
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';
import Minus from '@/UI/components/Icons/Minus';
import Plus from '@/UI/components/Icons/Plus';
import Input from '@/UI/components/Input/Input';
import RadioButton from '@/UI/components/RadioButton/RadioButton';
import DropdownMenu from '@/UI/components/DropdownMenu/DropdownMenu';

// Layouts
import Panel from '@/UI/layouts/Panel/Panel';

// Styles
import styles from './RisklessLendingRow.module.scss';
import { StrategyLeg } from '@/UI/constants/prepackagedStrategies';
import { DynamicOptionStrategy } from '@/pages/trading/dynamic-option-strategies';
import { Leg } from '@ithaca-finance/sdk';
import Button from '../Button/Button';
import Remove from '../Icons/Remove';
import dayjs from 'dayjs';

type RisklessLendingRowProps = {
  strategy: StrategyLeg
  updateStrategy: (strategy: DynamicOptionStrategy) => void;
  removeStrategy: () => void;
  id: string;
};

const PRODUCT_OPTIONS: ProductOption[] = [{
  option: 'Option',
  value: 'option'
}, {
  option: 'Dated Forward',
  value: 'Forward'
}];

const PRODUCT_TYPES: ProductType = {
  option: [{
    option: 'Call',
    value: 'Call'
  }, {
    option: 'Put',
    value: 'Put'
  }],
  'digital-option': [{
    option: 'Call',
    value: 'BinaryCall'
  }, {
    option: 'Put',
    value: 'BinaryPut'
  }],
  Forward: [{
    option: 'Call',
    value: 'CURRENT'
  }, {
    option: 'Next Auction',
    value: 'NEXT'
  }]
};

type ProductType = Record<string, ProductOption[]>;

type ProductOption = {
  option: string,
  value: string
}

const RisklessLendingRow = ({ updateStrategy, strategy, id, removeStrategy }: RisklessLendingRowProps) => {
  // Store
  const { getContractsByPayoff, spotPrices, currentExpiryDate } =
    useAppStore();

  // State
  const [productTypes, setProductTypes] = useState(PRODUCT_TYPES);
  const [product, setProduct] = useState(strategy.product);
  const [typeList, setTypeList] = useState<ProductOption[]>(PRODUCT_TYPES[strategy.product]);
  const [type, setType] = useState(strategy.type);
  const [side, setSide] = useState<'BUY' | 'SELL'>(strategy.side);
  const [size, setSize] = useState('100');
  const [strike, setStrike] = useState<string | undefined>(strategy.product === 'Forward' ? '-' : undefined);
  const contracts = getContractsByPayoff(strategy.product === 'Forward' ? 'Forward' : strategy.type);
  const [strikeList, setStrikeList] = useState(contracts);
  const [unitPrice, setUnitPrice] = useState(strategy.product === 'Forward' ? `${contracts['-'].referencePrice}` : '');

  useEffect(() => {
    handleStrikeListUpdate()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strikeList, id]);


  useEffect(() => {
    setSide(strategy.side)
    handleSideChange(strategy.side)
  }, [strategy.side]);

  useEffect(() => {
    productTypes.Forward = [{
      option: dayjs(currentExpiryDate.toString(), 'YYYYMMDD').format('DD MMM YY'),
      value: 'CURRENT'
    }, {
      option: 'Next Auction',
      value: 'NEXT'
    }];
    setProductTypes(productTypes)
  }, [currentExpiryDate])

  const handleProductChange = (product: string) => {
    setProduct(product);
    setTypeList(PRODUCT_TYPES[product]);
    setType(PRODUCT_TYPES[product][0].value);
    setStrikeList({...getContractsByPayoff(product === 'Forward' ? 'Forward' : PRODUCT_TYPES[product][0].value)})
  };

  const handleTypeChange = (type: string) => {
    setType(type);
    setStrikeList({...getContractsByPayoff(product === 'Forward' ? 'Forward' : type)});
  };

  const handleSideChange = (side: 'BUY' | 'SELL') => {
    setSide(side);
    if (!strike || isInvalidNumber(getNumber(size)) || isInvalidNumber(getNumber(unitPrice))) return;
    const leg = {
      contractId: strikeList[strike].contractId,
      quantity: size,
      side,
    } as Leg;
    updateStrategy({
      leg,
      referencePrice: getNumber(unitPrice),
      payoff: product === 'Forward' ? 'Forward': type,
      strike,
    });
  };

  const handleStrikeListUpdate = () => {
    let price = '';
    if (product === 'Forward') {
      const newStrike = '-'
      price = `${strikeList[newStrike].referencePrice}`;
      setUnitPrice(price);
      setStrike(newStrike);
      if (!strike || isInvalidNumber(getNumber(size)) || isInvalidNumber(getNumber(price))) return;
      const leg = {
        contractId: strikeList[newStrike].contractId,
        quantity: size,
        side,
      } as Leg;
      updateStrategy({
        leg,
        referencePrice: getNumber(price),
        payoff: 'Forward',
        strike: newStrike,
      });
    }
    else {
      const spot = spotPrices['WETH/USDC'];
      const list = Object.keys(strikeList);
      const closest = list.sort((a, b) => Math.abs(spot - parseFloat(a)) - Math.abs(spot - parseFloat(b)))[0];
      const index = list.sort().findIndex((a) => a === closest);
      const strikePoint = index + strategy.strike
      const newStrike = list[strikePoint < 0 ? 0 : strikePoint >= list.length ? list.length - 1 : strikePoint];
      setStrike(newStrike);
       price = `${strikeList[newStrike].referencePrice}`;
      setUnitPrice(price);
      if (!newStrike || isInvalidNumber(getNumber(size)) || isInvalidNumber(getNumber(price))) return;
      const leg = {
        contractId: strikeList[newStrike].contractId,
        quantity: size,
        side,
      } as Leg;
        updateStrategy({
          leg,
          referencePrice: getNumber(price),
          payoff: type,
          strike: newStrike,
        });
    }
  };
 
  const handleSizeChange = (amount: string) => {
    const size = getNumberValue(amount);
    setSize(size);
    if (!strike || isInvalidNumber(getNumber(size)) || isInvalidNumber(getNumber(unitPrice))) return;
    const leg = {
      contractId: strikeList[strike].contractId,
      quantity: size,
      side,
    } as Leg;
    updateStrategy({
      leg,
      referencePrice: getNumber(unitPrice),
      payoff: product === 'Forward' ? 'Forward': type,
      strike,
    });
  };

  const handleStrikeChange = (strike: string) => {
    setStrike(strike);
    setUnitPrice(`${strikeList[strike].referencePrice}`);
    if (!strike || isInvalidNumber(getNumber(size)) || isInvalidNumber(getNumber(unitPrice))) return;
    const leg = {
      contractId: strikeList[strike].contractId,
      quantity: size,
      side,
    } as Leg;
    updateStrategy({
      leg,
      referencePrice: getNumber(unitPrice),
      payoff: product === 'Forward' ? 'Forward': type,
      strike,
    });
  };

  return (
    <>
      <Panel margin='ptb-8 plr-6 br-20 mb-14 mt-10'>
        <div className={styles.parent}>
          <div className={styles.title}>
            <RadioButton
              options={PRODUCT_OPTIONS}
              selectedOption={product}
              name={`${id}-product`}
              onChange={handleProductChange}
              width={250}
            />
          </div>
          <div className={styles.type}>
            <RadioButton
              options={typeList}
              selectedOption={type}
              name={`${id}-type`}
              onChange={handleTypeChange}
              width={250}
            />
          </div>
          <div className={styles.side}>
            <RadioButton
              options={[
                { option: <Plus />, value: 'BUY' },
                { option: <Minus />, value: 'SELL' },
              ]}
              selectedOption={side}
              name={`${id}-buy-sell`}
              orientation='vertical'
              onChange={value => handleSideChange(value as 'BUY' | 'SELL')}
            />
          </div>
          <div className={styles.size}>
            <Input
              type='number'
              value={size}
              icon={<LogoEth />}
              width={145}
              onChange={({ target }) => handleSizeChange(target.value)}
            />
          </div>
          <div className={styles.strike}>
            {product !== 'Forward' ? (
              <DropdownMenu
                width={145}
                value={strike ? { name: strike, value: strike } : undefined}
                options={Object.keys(strikeList).map(strike => ({ name: strike, value: strike }))}
                iconEnd={<LogoUsdc />}
                onChange={option => handleStrikeChange(option)}
              />
            ) : (
              <div className={styles.forwardPlaceholder} />
            )}
          </div>
          <div className={styles.action}>
            <Button title='Click to remove row' variant='icon' size='sm' onClick={removeStrategy}>
              <Remove />
            </Button>
          </div>
        </div>
      </Panel>
    </>
  );
};

export default RisklessLendingRow;
