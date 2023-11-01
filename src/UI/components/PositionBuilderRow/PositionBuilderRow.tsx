// Packages
import Flex from '@/UI/layouts/Flex/Flex';
import Panel from '@/UI/layouts/Panel/Panel';
import { ReactNode, useState } from 'react';
import Button from '../Button/Button';
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
  valueOptions: string[];
  addStrategy: Function;
  defaultOption: string;
  submitAuction: Function;
  id: string;
};

const PositionBuilderRow = ({ options, valueOptions, addStrategy, defaultOption, submitAuction, id }: PositionBuilderRowProps) => {
  // Radio button state
  const [selectedType, setselectedType] = useState<string | undefined>(defaultOption);
  const [posNeg, setPosNeg] = useState<string | undefined>('Plus');

  return (
    <Panel>
      <div className={styles.wrapper}>
        <Flex>
          <div className='mr-10'>
            <RadioButton options={options}
              valueProps={valueOptions}
              name={`${id}-type`}
              defaultOption={defaultOption}
              onChange={(value: string) => setselectedType(value)} />
          </div>
          <div className='mr-10'>
            <RadioButton
              options={[<Plus key='plus' />, <Minus key='minus' />]}
              valueProps={['Plus', 'Minus']}
              name={`${id}-pos-neg`}
              defaultOption='Plus'
              orientation='vertical'
              onChange={(value: string) => setPosNeg(value)} />
          </div>
          <div className='width-90 mr-10'>
            <Input icon={<LogoEth />} />
          </div>
          <div className='width-90 mr-10'>
            <Input icon={<LogoUsdc />} />
          </div>
          <div className='width-90 mr-10'>
            <Input icon={<LogoUsdc />} />
          </div>
          <div className='mr-10 nowrap'>
            <p>38.3 <LogoEth /></p>
          </div>
          <div className='mr-10 nowrap'>
            <p>1500 <LogoUsdc /></p>
          </div>
          <div className='mr-10'>
            <Button size='sm' title='Click to add to Strategy' variant='secondary' onClick={() => {
              addStrategy({
                type: selectedType,
                side: posNeg,
                size: 120,
                strike: 6500,
                enterPrice: 800,
              })
            }}>
              <Plus />
              Strategy
            </Button>
          </div>
          <div className='mr-10'>
            <Button size='sm' title='Click to add to Submit to Auction' onClick={() => {
              submitAuction({
                type: selectedType,
                side: posNeg,
                size: 120,
                strike: 6500,
                enterPrice: 800,
              })
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
