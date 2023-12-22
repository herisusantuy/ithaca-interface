// Libs
import { useEffect, useState } from 'react';
import Link from 'next/link';

// Components
import Panel from '@/UI/layouts/Panel/Panel';
import Button from '@/UI/components/Button/Button';
import Loader from '@/UI/components/Loader/Loader';

// Constants
import { ToastItemProp } from '@/UI/constants/toast';

// Utils
import { GetOLMemberData } from '@/pages/points-program/PointsAPI';

// Styles
import styles from '@/pages/referrals/referrals.module.scss';

type ReferralCodeProps = {
  showToast: (newToast: ToastItemProp, position: string) => void;
};

const ReferralCode = ({ showToast }: ReferralCodeProps) => {
  const [referralToken, setReferralToken] = useState<string>();

  useEffect(() => {
    // check ifAuth
    GetOLMemberData().then(res => {
      if (res.referralToken)
        setReferralToken(`${process.env.NEXT_PUBLIC_HOST}/points-program?refferal=${res.referralToken}`);
    });
  }, []);

  return (
    <div className={styles.referralPanel}>
      <Panel margin={styles.mainPanel}>
        <p>Your referral link to share:</p>
        {referralToken ? (
          <>
            <Link href={referralToken} target='_blank'>
              {referralToken}
            </Link>
            <Button
              variant='secondary'
              title=''
              onClick={() => {
                navigator.clipboard.writeText(referralToken);
                showToast(
                  {
                    id: new Date().getTime(),
                    title: 'Copied',
                    message: referralToken,
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
