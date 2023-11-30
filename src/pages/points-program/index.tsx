// Components
import Meta from '@/UI/components/Meta/Meta';
import Main from '@/UI/layouts/Main/Main';
import Container from '@/UI/layouts/Container/Container';
import Panel from '@/UI/layouts/Panel/Panel';
import Button from '@/UI/components/Button/Button';
import { ConnectButton } from '@rainbow-me/rainbowkit';
// Styles
import styles from './points-program.module.scss';
import WalletIcon from '@/UI/components/Icons/Wallet';
import TwitterIcon from '@/UI/components/Icons/Twitter';
import DiscordIcon from '@/UI/components/Icons/Discord';
import TelegramIcon from '@/UI/components/Icons/Telegram';
import { useAccount } from 'wagmi';
import { useState, useCallback } from 'react';
import Link from 'next/link';

const PointsProgram = () => {
  const [actionsPerformed, setActionsPerformed] = useState({
    wallet: false,
    twitter: false,
    discord: false,
    telegram: false,
  });

  useAccount({
    onConnect: () => {
      setActionsPerformed({
        ...actionsPerformed,
        wallet: true,
      });
    },
    onDisconnect: () => {
      setActionsPerformed({
        ...actionsPerformed,
        wallet: false,
      });
    },
  });

  const ActionCompleted = useCallback(
    ({ action }: { action: boolean }) => {
      return action ? <span className={styles.completedTxt}>+ points earned</span> : <></>;
    },
    [actionsPerformed]
  );
  return (
    <>
      <Meta />
      <Main>
        <Container>
          <div className={styles.wrapper}>
            <h1>Ithaca Points Program - Phase 0</h1>
            <Panel margin={styles.mainPanel}>
              <p>Complete the actions below to earn Ithaca points to be assigned in Phase 1.</p>
              <ul className={styles.programChecklist}>
                {/* Connect Wallet */}
                <li className={styles.listItem}>
                  <div className={styles.listIcon}>
                    <WalletIcon />
                  </div>
                  <div className={`${styles.itemName} ${actionsPerformed.wallet ? styles.isConnected : ''}`}>
                    Connect your wallet
                  </div>
                  <div className={styles.buttonContainer}>
                    <ActionCompleted action={actionsPerformed.wallet} />
                    <ConnectButton.Custom>
                      {({ account, chain, openConnectModal, authenticationStatus, mounted }) => {
                        const ready = mounted && authenticationStatus !== 'loading';
                        const connected =
                          ready &&
                          account &&
                          chain &&
                          (!authenticationStatus || authenticationStatus === 'authenticated');
                        if (ready) {
                          if (connected) {
                            return (
                              <Button title='Completed' variant='outline' className={styles.completedBtn}>
                                <>Completed</>
                              </Button>
                            );
                          } else {
                            return (
                              <Button title='Connect Wallet' onClick={openConnectModal}>
                                <>Connect Wallet</>
                              </Button>
                            );
                          }
                        } else {
                          return <></>;
                        }
                      }}
                    </ConnectButton.Custom>
                  </div>
                </li>
                {/* Follow on Twitter */}
                <li className={styles.listItem}>
                  <div className={styles.listIcon}>
                    <TwitterIcon />
                  </div>
                  <div className={`${styles.itemName} ${actionsPerformed.twitter ? styles.isConnected : ''}`}>
                    Follow Ithaca on X (Twitter)
                  </div>
                  <div className={styles.buttonContainer}>
                    <ActionCompleted action={actionsPerformed.twitter} />
                    <Button title='' disabled={!actionsPerformed.wallet}>
                      <>Follow</>
                    </Button>
                  </div>
                </li>
                {/* Join Discord */}
                <li className={styles.listItem}>
                  <div className={styles.listIcon}>
                    <DiscordIcon />
                  </div>
                  <div className={`${styles.itemName} ${actionsPerformed.discord ? styles.isConnected : ''}`}>
                    Join Ithaca Discord
                  </div>
                  <div className={styles.buttonContainer}>
                    <ActionCompleted action={actionsPerformed.discord} />
                    <Button title='' disabled={!actionsPerformed.wallet}>
                      <>Join</>
                    </Button>
                  </div>
                </li>
                {/* Join Telegram */}
                <li className={styles.listItem}>
                  <div className={styles.listIcon}>
                    <TelegramIcon />
                  </div>
                  <div className={`${styles.itemName} ${actionsPerformed.telegram ? styles.isConnected : ''}`}>
                    Join Ithaca TG
                  </div>
                  <div className={styles.buttonContainer}>
                    <ActionCompleted action={actionsPerformed.telegram} />
                    <Button title='' disabled={!actionsPerformed.wallet}>
                      Join
                    </Button>
                  </div>
                </li>
              </ul>
              {actionsPerformed.wallet && (
                <div className={styles.regerralCodeContainer}>
                  <p>Registration successful thank you joining the Ithaca Points Program.</p>
                  <Link href='/referrals'>
                    <Button title='Reveal Referral Code' variant='secondary'>
                      Reveal Referral Code
                    </Button>
                  </Link>
                </div>
              )}
            </Panel>
          </div>
        </Container>
      </Main>
    </>
  );
};

export default PointsProgram;
