// Packages
import Flex from '@/UI/layouts/Flex/Flex';
import Panel from '@/UI/layouts/Panel/Panel';
import { readOnlySDK } from '@/UI/lib/sdk/readOnlySDK';
import { useAppStore } from '@/UI/lib/zustand/store';
import { getContractId, getUnitPrice } from '@/UI/utils/Cakculations';
import { getNumber } from '@/UI/utils/Numbers';
import { ReactNode, useState } from 'react';
import Button from '../Button/Button';
import { DotTypes } from '../Dot/Dot';
import LogoEth from '../Icons/LogoEth';
import LogoUsdc from '../Icons/LogoUsdc';
import Minus from '../Icons/Minus';
import Plus from '../Icons/Plus';
import Input from '../Input/Input';
import RadioButton from '../RadioButton/RadioButton';

// Styles
import styles from './PositionBuilderRow.module.scss';
// Types
type PositionBuilderRowProps = {
  options: (string | ReactNode)[];
  valueOptions: DotTypes[];
  addStrategy: (value: Strategy) => void;
  // submitAuction: (value: StrategyType) => void;
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
}

const PositionBuilderRow = ({ options, valueOptions, addStrategy, id, isForwards }: PositionBuilderRowProps) => {
  const { contractList, currentExpiryDate, referencePrices } = useAppStore();
  const [product, setProduct] = useState<DotTypes>();
  const [side, setSide] = useState<string>('BUY');
  const [size, setSize] = useState<number>(100);
  const [unitPrice, setUnitPrice] = useState<number>();
  const [strike] = useState<number>(1500);
  const [collateral, setCollateral] = useState<number>();
  const [premium, setPremium] = useState<number>();
  return (
    <Panel>
      <div className={styles.wrapper}>
        <Flex>
          <div className={`${styles.productWrapper} mr-10`}>
            <RadioButton options={options}
              valueProps={valueOptions}
              name={`${id}-type`}
              onChange={(value: string) => {
                const contractId = getContractId(isForwards ? 'Forward' : value,
                  1500,
                  currentExpiryDate,
                  contractList
                );
                setProduct(value as DotTypes)
                const leg = {
                  contractId,
                  side,
                  quantity: size
                };
                setCollateral(readOnlySDK.calculation.calcCollateralRequirement(
                  leg,
                  value,
                  strike,
                  4
                ))
                const unit = getUnitPrice(contractId, referencePrices)
                setUnitPrice(unit)
                setPremium(readOnlySDK.calculation.calcPremium(leg, unit || 0, 4))
              }} />
          </div>
          <div className='mr-10'>
            <RadioButton
              options={[<Plus key={`${id}-buy`} />, <Minus key={`${id}-sell`} />]}
              valueProps={['BUY', 'SELL']}
              name={`${id}-buy-sell`}
              defaultOption='BUY'
              orientation='vertical'
              onChange={(value: string) => {
                setSide(value)
                if (product) {
                  const contractId = getContractId(isForwards ? 'Forward' : product,
                    1500,
                    currentExpiryDate,
                    contractList
                  );
                  setCollateral(readOnlySDK.calculation.calcCollateralRequirement(
                    {
                      contractId,
                      side: value,
                      quantity: size
                    },
                    product,
                    strike,
                    4
                  ))
                }
              }} />
          </div>
          <div className={`${styles.inputWrapper} mr-10`}>
            <Input
              value={size}
              onChange={(value) => {
                const val = value.target.value && getNumber(value.target.value)
                setSize(val || 0)
                if (val && product) {
                  const contractId = getContractId(!isForwards ? 'Forward' : product,
                    1500,
                    currentExpiryDate,
                    contractList
                  );
                  setCollateral(readOnlySDK.calculation.calcCollateralRequirement(
                    {
                      contractId,
                      side,
                      quantity: value
                    },
                    product,
                    strike,
                    4
                  ))
                }
                else {
                  setCollateral(0)
                }
              }}
              icon={<LogoEth />} />
          </div>
          <div className={`${styles.inputWrapper} mr-10`}>
            <Input
              value={!isForwards ? 1500 : '-'}
              onChange={() => { }}
              icon={<LogoUsdc />} />
          </div>
          <div className={`${styles.inputWrapper} mr-10`}>
            <Input
              value={unitPrice}
              onChange={(value) => {
                const val = value.target.value && getNumber(value.target.value);
                setUnitPrice(val || 0)
                const contractId = getContractId(isForwards ? 'Forward' : (product || ''),
                  1500,
                  currentExpiryDate,
                  contractList
                );
                const leg = {
                  contractId,
                  side,
                  quantity: size
                };
                setPremium(readOnlySDK.calculation.calcPremium(leg, unitPrice || 0, 4))
              }}
              icon={<LogoUsdc />} />
          </div>
          <div className='mr-10 nowrap'>
            <Flex>
              <div className={styles.priceLabel}>
                {collateral || '0'}
              </div>
              <div className={styles.logo}>
                <LogoEth />
              </div>
            </Flex>
          </div>
          <div className='mr-10 nowrap'>
            <Flex>
              <div className={styles.priceLabel}>
                {premium || '0'}
              </div>
              <div className={styles.logo}>
                <LogoUsdc />
              </div>
            </Flex>
          </div>
          <div className='mr-10'>
            <Button size='sm' title='Click to add to Strategy' variant='secondary' onClick={() => {
              if (product) {
                const contractId = getContractId(isForwards ? 'Forward' : product,
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
                })
              }
            }}>
              <Plus />
              Strategy
            </Button>
          </div>
          <div className='mr-10'>
            <Button size='sm' title='Click to add to Submit to Auction' onClick={() => {
              if (product) {
                // submitAuction({
                //   type: product,
                //   side: side === 'BUY' ? '+' : '-',
                //   size,
                //   strike: strike,
                //   enterPrice: unitPrice,
                // })
              }
            }}>
              Submit to Auction
            </Button>
          </div>
        </Flex>
      </div>
    </Panel>
  );
};

export default PositionBuilderRow;
