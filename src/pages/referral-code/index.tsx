import { useEffect, useState } from 'react';
import Link from 'next/link';

// Components
import Container from '@/UI/layouts/Container/Container';
import Main from '@/UI/layouts/Main/Main';
import Meta from '@/UI/components/Meta/Meta';
import Panel from '@/UI/layouts/Panel/Panel';
import Button from '@/UI/components/Button/Button';
import Loader from '@/UI/components/Loader/Loader';
import Toast from '@/UI/components/Toast/Toast';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// Utils
import { useAccount } from 'wagmi';
import { GetOLMemberData } from '@/UI/components/Points/PointsAPI';
import { useAppStore } from '@/UI/lib/zustand/store';
import useToast from '@/UI/hooks/useToast';

// Styles
import styles from '@/pages/referral-code/referral-code.module.scss';

const ReferralCode = () => {
  const { isAuthenticated } = useAppStore();
  const { isConnected } = useAccount();
  const { toastList, showToast } = useToast();
  const [referralToken, setReferralToken] = useState<string>();

  useEffect(() => {
    if (!isConnected || !isAuthenticated) return;
    GetOLMemberData().then(res => {
      if (res.referralToken)
        setReferralToken(`${process.env.NEXT_PUBLIC_HOST}/points-program?refferal=${res.referralToken}`);
    });
  }, [isConnected, isAuthenticated]);

  useAccount({
    onDisconnect: () => {
      setReferralToken('');
    },
  });

  return (
    <>
      <Meta />
      <Main>
        <Container>
          <div className={styles.referralPanel}>
            <h1>Referrals</h1>
            <Panel margin={styles.mainPanel}>
              {isConnected ? (
                <>
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
                </>
              ) : (
                <ConnectButton.Custom>
                  {({ openConnectModal }) => {
                    return (
                      <Button title='Connect Wallet' onClick={openConnectModal}>
                        Connect Wallet
                      </Button>
                    );
                  }}
                </ConnectButton.Custom>
              )}
            </Panel>
          </div>
        </Container>
      </Main>
      <Toast toastList={toastList} position='bottom-right' autoDelete={true} autoDeleteTime={2000} />
    </>
  );
};

export default ReferralCode;
