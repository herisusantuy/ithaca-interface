// Packages
import { ReactNode, useState } from 'react';

// SDK
import { useAppStore } from '@/UI/lib/zustand/store';

// Utils
import { getNumber, getNumberValue, isInvalidNumber } from '@/UI/utils/Numbers';

// Components
import Button from '@/UI/components/Button/Button';
import LogoEth from '@/UI/components/Icons/LogoEth';
import LogoUsdc from '@/UI/components/Icons/LogoUsdc';
import Minus from '@/UI/components/Icons/Minus';
import Plus from '@/UI/components/Icons/Plus';
import Input from '@/UI/components/Input/Input';
import RadioButton from '@/UI/components/RadioButton/RadioButton';
import PriceLabel from '@/UI/components/PriceLabel/PriceLabel';
import DropdownMenu from '@/UI/components/DropdownMenu/DropdownMenu';

// Layouts
import Flex from '@/UI/layouts/Flex/Flex';
import Panel from '@/UI/layouts/Panel/Panel';

// Styles
import styles from './PositionBuilderRow.module.scss';
import {
  ClientConditionalOrder,
  Leg,
  calculateNetPrice,
  createClientOrderId,
  calcCollateralRequirement,
} from '@ithaca-finance/sdk';
import { PositionBuilderStrategy } from '@/pages/trading/pro/position-builder';

type PositionBuilderRowProps = {
  title: string;
  options: { option: string | ReactNode; value: string }[];
  addStrategy: (strategy: PositionBuilderStrategy) => void;
  submitAuction: (order: ClientConditionalOrder) => void;
};

type SectionType = {
  name: string;
  style: string;
};

const PositionBuilderRow = ({ title, options, addStrategy, submitAuction }: PositionBuilderRowProps) => {
  // Store
  const { currencyPrecision, currentExpiryDate, expiryList, getContractsByPayoff, getContractsByExpiry } =
    useAppStore();

  // State
  const [payoff, setPayoff] = useState(options[0].value);
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [size, setSize] = useState('100');
  const [strike, setStrike] = useState<string | undefined>(title === 'Forwards' ? '-' : undefined);
  const contracts = getContractsByPayoff(title === 'Forwards' ? 'Forward' : payoff);
  const [unitPrice, setUnitPrice] = useState(title === 'Forwards' ? `${contracts['-'].referencePrice}` : '');

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

  const handlePayoffChange = (payoff: string) => {
    setPayoff(payoff);
    if (title === 'Forwards') {
      setStrike('-');
      setUnitPrice(`${contracts['-'].referencePrice}`);
    } else {
      setStrike(undefined);
      setUnitPrice('');
    }
  };

  const handleSideChange = (side: 'BUY' | 'SELL') => {
    setSide(side);
  };

  const handleSizeChange = (amount: string) => {
    const size = getNumberValue(amount);
    setSize(size);
  };

  const handleStrikeChange = (strike: string) => {
    setStrike(strike);
    setUnitPrice(`${contracts[strike].referencePrice}`);
  };

  const calcCollateral = () => {
    if (!strike || isInvalidNumber(getNumber(size))) return '-';
    const leg = {
      contractId: contracts[strike].contractId,
      quantity: size,
      side,
    };
    if (title === 'Forwards') {
      const expiry = payoff === 'Forward' ? currentExpiryDate : expiryList[expiryList.indexOf(currentExpiryDate) + 1];
      const forwardContracts = getContractsByExpiry(`${expiry}`, 'Forward');
      leg.contractId = forwardContracts[strike].contractId;
    }
    return calcCollateralRequirement(
      leg,
      title === 'Forwards' ? 'Forward' : payoff,
      getNumber(strike),
      currencyPrecision.strike
    );
  };

  const calcPremium = () => {
    if (!strike || isInvalidNumber(getNumber(size)) || isInvalidNumber(getNumber(unitPrice))) return '-';
    const leg = {
      contractId: contracts[strike].contractId,
      quantity: size,
      side,
    };
    if (title === 'Forwards') {
      const expiry = payoff === 'Forward' ? currentExpiryDate : expiryList[expiryList.indexOf(currentExpiryDate) + 1];
      const forwardContracts = getContractsByExpiry(`${expiry}`, 'Forward');
      leg.contractId = forwardContracts[strike].contractId;
    }
    return calculateNetPrice([leg], [getNumber(unitPrice)], currencyPrecision.strike);
  };

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
              selectedOption={payoff}
              name={`${title}-payoff`}
              onChange={handlePayoffChange}
              width={225}
            />
          </div>
          <div className={styles.side}>
            <RadioButton
              options={[
                { option: <Plus />, value: 'BUY' },
                { option: <Minus />, value: 'SELL' },
              ]}
              selectedOption={side}
              name={`${title}-buy-sell`}
              orientation='vertical'
              onChange={value => handleSideChange(value as 'BUY' | 'SELL')}
            />
          </div>
          <div className={styles.size}>
            <Input
              type='number'
              value={size}
              icon={<LogoEth />}
              onChange={({ target }) => handleSizeChange(target.value)}
            />
          </div>
          <div className={styles.strike}>
            {title !== 'Forwards' ? (
              <DropdownMenu
                value={strike ? { name: strike, value: strike } : undefined}
                options={Object.keys(contracts).map(strike => ({ name: strike, value: strike }))}
                iconEnd={<LogoUsdc />}
                onChange={option => handleStrikeChange(option)}
              />
            ) : (
              <div className={styles.forwardPlaceholder} />
            )}
          </div>
          <div className={styles.unitPrice}>
            <Input
              type='number'
              value={unitPrice}
              icon={<LogoUsdc />}
              onChange={({ target }) => setUnitPrice(getNumberValue(target.value))}
            />
          </div>
          <div className={styles.collateral}>
            <PriceLabel label={calcCollateral()} icon={<LogoEth />} />
          </div>
          <div className={styles.premium}>
            <PriceLabel label={calcPremium()} icon={<LogoUsdc />} />
          </div>
          <div className={styles.action}>
            <Flex gap='gap-5'>
              <Button
                size='sm'
                title='Click to add to Strategy'
                variant='secondary'
                disabled={!(unitPrice && size && strike)}
                onClick={() => {
                  if (!strike || isInvalidNumber(getNumber(size)) || isInvalidNumber(getNumber(unitPrice))) return;
                  const leg = {
                    contractId: contracts[strike].contractId,
                    quantity: size,
                    side,
                  } as Leg;
                  if (title === 'Forwards') {
                    const expiry =
                      payoff === 'Forward' ? currentExpiryDate : expiryList[expiryList.indexOf(currentExpiryDate) + 1];
                    const forwardContracts = getContractsByExpiry(`${expiry}`, 'Forward');
                    leg.contractId = forwardContracts[strike].contractId;
                  }
                  addStrategy({
                    leg,
                    referencePrice: getNumber(unitPrice),
                    payoff,
                    strike,
                  });
                }}
              >
                <Plus />
                Strategy
              </Button>
              <Button
                size='sm'
                title='Click to add to submit to auction'
                disabled={!(unitPrice && size && strike)}
                variant='primary'
                onClick={() => {
                  if (!strike || isInvalidNumber(getNumber(size)) || isInvalidNumber(getNumber(unitPrice))) return;
                  const leg = {
                    contractId: contracts[strike].contractId,
                    quantity: size,
                    side,
                  } as Leg;
                  if (title === 'Forwards') {
                    const expiry =
                      payoff === 'Forward' ? currentExpiryDate : expiryList[expiryList.indexOf(currentExpiryDate) + 1];
                    const forwardContracts = getContractsByExpiry(`${expiry}`, 'Forward');
                    leg.contractId = forwardContracts[strike].contractId;
                  }
                  submitAuction({
                    clientOrderId: createClientOrderId(),
                    totalNetPrice: calculateNetPrice([leg], [getNumber(unitPrice)], currencyPrecision.strike),
                    legs: [leg],
                  });
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
