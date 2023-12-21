// Libs
import { useEffect, useState } from 'react';

// Components
import Panel from '@/UI/layouts/Panel/Panel';
import Button from '@/UI/components/Button/Button';

// Constants
import { ToastItemProp } from '@/UI/constants/toast';

// Utils
import { GetOLMemberData } from '@/pages/points-program/PointsAPI';

// Styles
import styles from '@/pages/referrals/referrals.module.scss';
import Loader from '@/UI/components/Loader/Loader';

type ReferralCodeProps = {
  showToast: (newToast: ToastItemProp, position: string) => void;
};

const ReferralCode = ({ showToast }: ReferralCodeProps) => {
  const [referralToken, setReferralToken] = useState<string>();

  useEffect(() => {
    GetOLMemberData().then(res => {
      if (res.referralToken) setReferralToken(res.referralToken);
    });
  }, []);

  return (
    <div className={styles.referralPanel}>
      <Panel margin={styles.mainPanel}>
        <p>Your referral link to share:</p>
        {referralToken ? (
          <>
            <a href={`https://ithaca.domain/${referralToken}`} target='_blank'>
              https://ithaca.domain/{referralToken}
            </a>
            <Button
              variant='secondary'
              title=''
              onClick={() => {
                navigator.clipboard.writeText(`https://ithaca.domain/${referralToken}`);
                showToast(
                  {
                    id: new Date().getTime(),
                    title: 'Copied',
                    message: `https://ithaca.domain/${referralToken}`,
                    type: 'success',
                  },
                  'top-right'
                );
              }}
            >
              Copy Link
            </Button>
          </>
        ) : (
          <Loader type={'sm'} />
        )}
      </Panel>
    </div>
  );
};

export default ReferralCode;
