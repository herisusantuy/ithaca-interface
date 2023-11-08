// Packages
import { ReactNode, useState } from 'react';

// SDK
import { readOnlySDK } from '@/UI/lib/sdk/readOnlySDK';
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

// Layouts
import Flex from '@/UI/layouts/Flex/Flex';
import Panel from '@/UI/layouts/Panel/Panel';

// Types
type PositionBuilderRowProps = {
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

const PositionBuilderRow = ({
  options,
  valueOptions,
  addStrategy,
  submitAuction,
  id,
  isForwards,
}: PositionBuilderRowProps) => {
  // Store
  const { contractList, currentExpiryDate, referencePrices } = useAppStore();

  // State
  const [product, setProduct] = useState<DotTypes>();
  const [side, setSide] = useState<string>('BUY');
  const [size, setSize] = useState<number>(100);
  const [unitPrice, setUnitPrice] = useState<number>();
  const [strike] = useState<number>(1500);
  const [collateral, setCollateral] = useState<number>();
  const [premium, setPremium] = useState<number>();

  return (
    <Panel margin='ptb-8 plr-8 br-20 mb-14'>
      <Flex gap='gap-8'>
        <RadioButton
          options={options}
          valueProps={valueOptions}
          name={`${id}-type`}
          onChange={(value: string) => {
            const contractId = getContractId(isForwards ? 'Forward' : value, 1500, currentExpiryDate, contractList);
            setProduct(value as DotTypes);
            const leg = {
              contractId,
              side,
              quantity: size,
            };
            setCollateral(readOnlySDK.calculation.calcCollateralRequirement(leg, value, strike, 4));
            const unit = getUnitPrice(contractId, referencePrices);
            setUnitPrice(unit);
            setPremium(readOnlySDK.calculation.calcPremium(leg, unit || 0, 4));
          }}
        />
        <RadioButton
          options={[<Plus key={`${id}-buy`} />, <Minus key={`${id}-sell`} />]}
          valueProps={['BUY', 'SELL']}
          name={`${id}-buy-sell`}
          defaultOption='BUY'
          orientation='vertical'
          onChange={(value: string) => {
            setSide(value);
            if (product) {
              const contractId = getContractId(isForwards ? 'Forward' : product, 1500, currentExpiryDate, contractList);
              setCollateral(
                readOnlySDK.calculation.calcCollateralRequirement(
                  {
                    contractId,
                    side: value,
                    quantity: size,
                  },
                  product,
                  strike,
                  4
                )
              );
            }
          }}
        />
        <Input
          value={size}
          onChange={value => {
            const val = value.target.value && getNumber(value.target.value);
            setSize(val || 0);
            if (val && product) {
              const contractId = getContractId(
                !isForwards ? 'Forward' : product,
                1500,
                currentExpiryDate,
                contractList
              );
              setCollateral(
                readOnlySDK.calculation.calcCollateralRequirement(
                  {
                    contractId,
                    side,
                    quantity: value,
                  },
                  product,
                  strike,
                  4
                )
              );
            } else {
              setCollateral(0);
            }
          }}
          icon={<LogoEth />}
        />
        <Input value={!isForwards ? 1500 : '-'} onChange={() => {}} icon={<LogoUsdc />} />
        <Input
          value={unitPrice}
          onChange={value => {
            const val = value.target.value && getNumber(value.target.value);
            setUnitPrice(val || 0);
            const contractId = getContractId(
              isForwards ? 'Forward' : product || '',
              1500,
              currentExpiryDate,
              contractList
            );
            const leg = {
              contractId,
              side,
              quantity: size,
            };
            setPremium(readOnlySDK.calculation.calcPremium(leg, unitPrice || 0, 4));
          }}
          icon={<LogoUsdc />}
        />
        <PriceLabel label={collateral || '-'} icon={<LogoEth />} />
        <PriceLabel label={premium || '-'} icon={<LogoUsdc />} />
        <Flex gap='gap-5'>
          <Button
            size='sm'
            title='Click to add to Strategy'
            variant='secondary'
            onClick={() => {
              if (product) {
                const contractId = getContractId(
                  isForwards ? 'Forward' : product,
                  1500,
                  currentExpiryDate,
                  contractList
                );
                addStrategy({
                  type: product,
                  side: side || 'BUY',
                  size,
                  contractId,
                  strike: strike,
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
            onClick={() => {
              if (product) {
                const contractId = getContractId(
                  isForwards ? 'Forward' : product,
                  1500,
                  currentExpiryDate,
                  contractList
                );
                submitAuction({
                  type: product,
                  side: side || 'BUY',
                  size,
                  contractId,
                  strike: strike,
                  enterPrice: unitPrice as number,
                });
              }
            }}
          >
            Submit to Auction
          </Button>
        </Flex>
      </Flex>
    </Panel>
  );
};

export default PositionBuilderRow;
