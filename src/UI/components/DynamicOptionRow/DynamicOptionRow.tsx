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
import Flex from '@/UI/layouts/Flex/Flex';

// Layouts
import Panel from '@/UI/layouts/Panel/Panel';

// Styles
import styles from './DynamicOptionRow.module.scss';
import { StrategyLeg } from '@/UI/constants/prepackagedStrategies';
import { DynamicOptionStrategy } from '@/pages/trading/dynamic-option-strategies';
import { Leg } from '@ithaca-finance/sdk';
import Button from '../Button/Button';
import Remove from '../Icons/Remove';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useDevice } from '@/UI/hooks/useDevice';
dayjs.extend(duration)

type DynamicOptionRowProps = {
  strategy: StrategyLeg
  updateStrategy: (strategy: DynamicOptionStrategy) => void;
  removeStrategy: () => void;
  id: string;
  linked: boolean;
  linkChange: (isLinked: boolean) => void;
  sharedSize: string;
  sizeChange: (size: number) => void;
};

const PRODUCT_OPTIONS: ProductOption[] = [{
  option: 'Option',
  value: 'option'
}, {
  option: 'Digital Option',
  value: 'digital-option'
}, {
  option: 'Forward',
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
    option: 'Next Auction',
    value: 'NEXT'
  }, {
    option: 'Call',
    value: 'CURRENT'
  }]
};

type ProductType = Record<string, ProductOption[]>;

type ProductOption = {
  option: string,
  value: string
}

const DynamicOptionRow = ({ updateStrategy, strategy, id, removeStrategy, linkChange, linked, sharedSize, sizeChange }: DynamicOptionRowProps) => {
  // Store
  const { getContractsByPayoff, spotPrices, currentExpiryDate, currentSpotPrice, ithacaSDK, spotContract } =
    useAppStore();

  // State
  const [productTypes, setProductTypes] = useState(PRODUCT_TYPES);
  const [product, setProduct] = useState(strategy.product);
  const [typeList, setTypeList] = useState<ProductOption[]>(PRODUCT_TYPES[strategy.product]);
  const [type, setType] = useState(strategy.type);
  const [side, setSide] = useState<'BUY' | 'SELL'>(strategy.side);
  const [size, setSize] = useState(strategy.size.toString());
  const [strike, setStrike] = useState<string | undefined>(strategy.product === 'Forward' ? '-' : undefined);
  const contracts = getContractsByPayoff(strategy.product === 'Forward' ? 'Forward' : strategy.type);
  const [strikeList, setStrikeList] = useState(contracts);
  const [unitPrice, setUnitPrice] = useState(strategy.product === 'Forward'
    ? strategy.type === 'NEXT'
      ? spotContract.referencePrice > 1
        ? spotContract.referencePrice.toFixed(0)
        : `${spotContract.referencePrice}`
      : `${contracts['-'].referencePrice > 1
        ? contracts['-'].referencePrice.toFixed(0)
        : contracts['-'].referencePrice}`
    : '');
  const device = useDevice()

  useEffect(() => {
    handleStrikeListUpdate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strikeList, id]);

  useEffect(() => {
    if (linked) {
      setSize(sharedSize)
    }
  }, [sharedSize, linked])

  useEffect(() => {
    setSide(strategy.side)
    handleSideChange(strategy.side)
  }, [strategy.side]);


  useEffect(() => {
    setProduct(strategy.product)
    handleProductChange(strategy.product, strategy.type)
  }, [strategy.product]);


  useEffect(() => {
    setSize(strategy.size.toString())
    handleSizeChange(strategy.size.toString())
  }, [strategy.size]);

  useEffect(() => {
    productTypes.Forward = [{
      option: 'Next Auction',
      value: 'NEXT'
    }, {
      option: dayjs(currentExpiryDate.toString(), 'YYYYMMDD').format('DD MMM YY'),
      value: 'CURRENT'
    }];
    setProductTypes(productTypes)
  }, [currentExpiryDate])

  const handleProductChange = (product: string, type?: string) => {
    setProduct(product);
    setTypeList(PRODUCT_TYPES[product]);
    setType(type || PRODUCT_TYPES[product][0].value);
    setStrikeList({ ...getContractsByPayoff(product === 'Forward' ? 'Forward' : PRODUCT_TYPES[product][0].value) })
  };

  const handleTypeChange = (type: string) => {
    setType(type);
    setStrikeList({ ...getContractsByPayoff(product === 'Forward' ? 'Forward' : type) });
  };

  const handleSideChange = (side: 'BUY' | 'SELL') => {
    setSide(side);
    if (!strike || isInvalidNumber(getNumber(size)) || isInvalidNumber(getNumber(unitPrice))) return;
    const leg = {
      contractId: product === 'Forward' && type === 'NEXT' ? spotContract.contractId : strikeList[strike].contractId,
      quantity: size,
      side,
    } as Leg;
    updateStrategy({
      leg,
      referencePrice: getNumber(unitPrice),
      payoff: product === 'Forward' ? 'Forward' : type,
      strike,
    });
  };

  const handleStrikeListUpdate = () => {
    let price = '';
    if (product === 'Forward') {
      const newStrike = '-'
      price = type === 'NEXT'
        ? spotContract.referencePrice > 1
          ? spotContract.referencePrice.toFixed(0)
          : `${spotContract.referencePrice}`
        : `${strikeList[newStrike].referencePrice > 1 ? strikeList[newStrike].referencePrice.toFixed(0) : strikeList[newStrike].referencePrice}`;
      setUnitPrice(price);
      setStrike(newStrike);
      if (!strike || isInvalidNumber(getNumber(size)) || isInvalidNumber(getNumber(price))) return;
      const leg = {
        contractId: product === 'Forward' && type === 'NEXT' ? spotContract.contractId : strikeList[strike].contractId,
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
      price = `${strikeList[newStrike].referencePrice > 1 ? strikeList[newStrike].referencePrice.toFixed(0) : strikeList[newStrike].referencePrice}`;
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
    sizeChange(Number(size));
    // if (!strike || isInvalidNumber(getNumber(size)) || isInvalidNumber(getNumber(unitPrice))) return;
    // const leg = {
    //   contractId: strikeList[strike].contractId,
    //   quantity: size,
    //   side,
    // } as Leg;
    // updateStrategy({
    //   leg,
    //   referencePrice: getNumber(unitPrice),
    //   payoff: product === 'Forward' ? 'Forward': type,
    //   strike,
    // });
  };

  const handleStrikeChange = (strike: string) => {
    setStrike(strike);
    const price = type === 'NEXT'
    ? spotContract.referencePrice > 1
      ? spotContract.referencePrice.toFixed(0)
      : `${spotContract.referencePrice}`
    : `${strikeList[strike].referencePrice > 1 ? strikeList[strike].referencePrice.toFixed(0) : strikeList[strike].referencePrice}`;
    setUnitPrice(price);
    if (!strike || isInvalidNumber(getNumber(size)) || isInvalidNumber(getNumber(price))) return;
    const leg = {
      contractId: product === 'Forward' && type === 'NEXT' ? spotContract.contractId : strikeList[strike].contractId,
      quantity: size,
      side,
    } as Leg;
    updateStrategy({
      leg,
      referencePrice: getNumber(price),
      payoff: product === 'Forward' ? 'Forward' : type,
      strike,
    });
  };

  const calcIv = () => {
    if (!strike || isInvalidNumber(getNumber(unitPrice))) return '-';
    const current = dayjs();
    const expiry = dayjs(currentExpiryDate.toString(), 'YYYYMMDD')
    const diff = expiry.diff(current)
    const sigma = ithacaSDK.calculation.impliedVolatility(
      type === 'Call', 
      currentSpotPrice, 
      getNumber(strike), 
      dayjs.duration(diff).asYears(), 
      getNumber(unitPrice)
    );
    return (sigma * 100).toFixed(1) + '%'
  }

  return (
    <>
      <Panel margin='br-20 mb-14 mt-10' className={styles.panel}>
        <div className={styles.parent}>
          <div className={styles.title}>
            {(device !== 'desktop') &&
              <Flex direction='row-space-between-start'>
                <p className={styles.subtitle}>Product</p>
                <div className={styles.removeButton}>
                  <Button title='Click to remove row' variant='icon' onClick={removeStrategy}>
                    <Remove />
                  </Button>
                </div>
              </Flex>}
            <RadioButton
              options={PRODUCT_OPTIONS}
              selectedOption={product}
              name={`${id}-product`}
              onChange={handleProductChange}
              radioButtonClassName={styles.radioButtonProduct}
            />
          </div>
          <div className={styles.type}>
            {(device !== 'desktop') ?
              <>
                <p className={styles.subtitle}>Type</p>
                <RadioButton
                  options={typeList}
                  selectedOption={type}
                  name={`${id}-type`}
                  onChange={handleTypeChange}
                  radioButtonClassName={styles.radioButtonType}
                />
              </> :
              <RadioButton
                options={typeList}
                selectedOption={type}
                name={`${id}-type`}
                onChange={handleTypeChange}
                width={170}
              />
            }

          </div>
          <div className={styles.side}>
            {(device !== 'desktop') && <p className={styles.subtitle}>Side</p>}
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
            {(device !== 'desktop') && <p className={styles.subtitle}>Size</p>}
            <Input
              className={styles.dynamicOptionsInput}
              canLink={true}
              isLinked={linked}
              onLink={(link) => {
                linkChange(link);
              }}
              increment={(direction) => size && handleSizeChange((direction === 'UP' ? Number(size) + 1 : Number(size) - 1).toString())}
              type='number'

              value={size}
              icon={product === 'digital-option' ? <LogoUsdc /> : <LogoEth />}
              onChange={({ target }) => handleSizeChange(target.value)}
            />
          </div>
          <div className={styles.strike}>
            {(product !== 'Forward') && (device !== 'desktop') && <p className={styles.subtitle}>Strike</p>}
            {product !== 'Forward' ? (
              <DropdownMenu
                value={strike ? { name: strike, value: strike } : undefined}
                options={Object.keys(strikeList).map(strike => ({ name: strike, value: strike }))}
                iconEnd={<LogoUsdc />}
                onChange={option => handleStrikeChange(option)}
              />
            ) : (
              <div className={styles.forwardPlaceholder} />
            )}
          </div>
          <div className={`${product === 'Forward' ? styles.unitPriceForwards : styles.unitPrice}`}>
            {(device !== 'desktop') && <p className={styles.subtitle}>Unit Price</p>}
            <Input
              className={styles.dynamicOptionsInput}
              type='number'
              value={unitPrice}
              icon={<LogoUsdc />}
              footerText={product === 'option' ? `IV ${calcIv()}` : undefined}
              onChange={({ target }) => {
                setUnitPrice(getNumberValue(target.value))
                if (!strike || isInvalidNumber(getNumber(size))) return;
                const leg = {
                  contractId: product === 'Forward' && type === 'NEXT' ? spotContract.contractId : strikeList[strike].contractId,
                  quantity: size,
                  side,
                } as Leg;
                updateStrategy({
                  leg,
                  referencePrice: getNumber(target.value),
                  payoff: product === 'Forward' ? 'Forward' : type,
                  strike,
                });
              }
              }
            />
          </div>
          {(device === 'desktop') &&
            <div className={styles.action}>
              <Button title='Click to remove row' variant='icon' onClick={removeStrategy}>
                <Remove />
              </Button>
            </div>
          }
        </div>
      </Panel>
    </>
  );
};

export default DynamicOptionRow;
