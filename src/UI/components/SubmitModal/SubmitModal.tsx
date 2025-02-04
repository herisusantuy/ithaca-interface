// Packages
import { AuctionSubmission, OrderSummary, PositionBuilderStrategy } from '@/pages/trading/position-builder';
import Flex from '@/UI/layouts/Flex/Flex';
import { useAppStore } from '@/UI/lib/zustand/store';
import { formatNumberByCurrency, getNumber } from '@/UI/utils/Numbers';
import { toPrecision } from '@ithaca-finance/sdk';
import { useState } from 'react';
import Button from '../Button/Button';
import LogoEth from '../Icons/LogoEth';
import LogoUsdc from '../Icons/LogoUsdc';
import SliderLeft from '../Icons/SliderLeft';
import SliderRight from '../Icons/SliderRight';
import Modal from '../Modal/Modal';
import TableStrategy from '../TableStrategy/TableStrategy';
import Toggle from '../Toggle/Toggle';

// Styles
import styles from './SubmitModal.module.scss';

type SubmitModalProps = {
  isOpen: boolean;
  submitOrder: (auctionSubmission: AuctionSubmission) => void;
  auctionSubmission?: AuctionSubmission;
  closeModal: (close: boolean) => void;
  positionBuilderStrategies: PositionBuilderStrategy[];
  orderSummary?: OrderSummary;
};

const SubmitModal = ({
  isOpen,
  submitOrder,
  auctionSubmission,
  closeModal,
  positionBuilderStrategies,
  orderSummary,
}: SubmitModalProps) => {
  const { currencyPrecision } = useAppStore();
  const [multiPrice, setMultiPrice] = useState(true);
  return (
    <Modal
      title='Submit to Auction'
      isOpen={isOpen}
      hideFooter={true}
      onCloseModal={() => closeModal(false)}
      // isLoading={transactionInProgress}
    >
      <>
        {positionBuilderStrategies.length === 1 &&
          positionBuilderStrategies.findIndex(p => p.payoff !== 'Call' && p.payoff !== 'Put') === -1 && (
            <div className={styles.toggleWrapper}>
              <Toggle
                size='sm'
                defaultState={multiPrice ? 'right' : 'left'}
                rightLabel='*'
                onChange={val => setMultiPrice(val === 'right')}
              />
            </div>
          )}
        <TableStrategy strategies={positionBuilderStrategies} hideClear={true} />
        <Button
          className={`${styles.confirmButton}`}
          onClick={() => {
            if (!auctionSubmission) return;
            submitOrder(auctionSubmission);
          }}
          title='Click to confirm'
        >
          Confirm
        </Button>
        <Flex margin='mb-16'>
          <h5 className='flexGrow'>Order Limit</h5>
          <div className={styles.valueWrapper}>
            <span className={styles.amountLabel}>
              {formatNumberByCurrency(Number(auctionSubmission?.order.totalNetPrice) || 0, 'string', 'USDC') || '-'}
            </span>
            <LogoUsdc />
            <span className={styles.currencyLabel}>USDC</span>
          </div>
        </Flex>
        <Flex margin='mb-16'>
          <h5 className='flexGrow'>Collateral Requirement</h5>
          <div>
            <div className={styles.valueWrapper}>
              <span className={styles.amountLabel}>
                {orderSummary ? formatNumberByCurrency(orderSummary.orderLock.underlierAmount, 'string', 'WETH') : '-'}
              </span>
              <LogoEth />
              <span className={styles.currencyLabel}>WETH</span>
            </div>
            <div className={styles.valueWrapper}>
              <span className={styles.amountLabel}>
                {orderSummary
                  ? formatNumberByCurrency(
                      toPrecision(
                        orderSummary.orderLock.numeraireAmount - getNumber(orderSummary.order.totalNetPrice),
                        currencyPrecision.strike
                      ),
                      'string',
                      'USDC'
                    )
                  : '-'}
              </span>{' '}
              <LogoUsdc />
              <span className={styles.currencyLabel}>USDC</span>
            </div>
          </div>
        </Flex>
        <Flex margin='mb-16'>
          <h5 className='flexGrow'>Platform Fee</h5>
          <div className={styles.valueWrapper}>
            <span className={styles.amountLabel}>{formatNumberByCurrency(1.5, 'string', 'USDC')}</span>
            <LogoUsdc />
            <span className={styles.currencyLabel}>USDC</span>
          </div>
        </Flex>
        <div className={styles.divider} />
        <Flex margin='mb-16'>
          <h5 className='flexGrow color-white'>Total Premium</h5>
          <div className={styles.valueWrapper}>
            <span className={styles.amountLabel}>
              {formatNumberByCurrency(Number(auctionSubmission?.order.totalNetPrice) || 0, 'string', 'USDC') || '-'}
            </span>
            <LogoUsdc />
            <span className={styles.currencyLabel}>USDC</span>
          </div>
        </Flex>

        {positionBuilderStrategies.length === 1 &&
          positionBuilderStrategies.findIndex(p => p.payoff !== 'Call' && p.payoff !== 'Put') === -1 && (
            <Flex>
              <div className='color-white-60'>*</div>
              <Flex direction='column'>
                <div className='mb-4 ml-6'>
                  <Flex>
                    <SliderLeft /> <h6 className='ml-2 color-white-60'>Multi-Price Portfolio Dominance</h6>
                  </Flex>
                </div>
                <div className='ml-6'>
                  <Flex>
                    <SliderRight /> <h6 className='color-white-60 ml-2'>Clearing</h6>
                  </Flex>
                </div>
              </Flex>
            </Flex>
          )}
      </>
    </Modal>
  );
};

export default SubmitModal;
