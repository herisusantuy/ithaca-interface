import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

// Components
import Meta from '@/UI/components/Meta/Meta';
import Main from '@/UI/layouts/Main/Main';
import Container from '@/UI/layouts/Container/Container';
import Panel from '@/UI/layouts/Panel/Panel';
import Button from '@/UI/components/Button/Button';
import WalletIcon from '@/UI/components/Icons/Wallet';
import TwitterIcon from '@/UI/components/Icons/Twitter';
import DiscordIcon from '@/UI/components/Icons/Discord';
import TelegramIcon from '@/UI/components/Icons/Telegram';
import { PointsProgramAccountsEnum } from '@/UI/constants/pointsProgram';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// API
import { GetOLMemberData, JoinDiscord, JoinTelegram, JoinTwitter } from '@/UI/components/Points/PointsAPI';
import { useAccount } from 'wagmi';
import { useAppStore } from '@/UI/lib/zustand/store';

// Styles
import styles from './points-program.module.scss';
import DiscordAuth from '@/UI/components/DiscordAuth/DiscordAuth';
import Link from 'next/link';

const DISCORD_LINK = 'https://discord.gg/ithaca';
const TELEGRAM_LINK = 'https://t.me/+E7KmlGwmxmtkOWU1';

type PointProgramActions = Record<keyof typeof PointsProgramAccountsEnum, boolean>;

type OpenLoyaltyLabel = {
  key: string;
  value: string;
};

const PointsProgram = () => {
  const { isAuthenticated } = useAppStore();
  const { isConnected } = useAccount();
  const searchParams = useSearchParams();

  const [isOLConnected, setIsOLConnected] = useState<boolean | null>(null);
  const [referralToken, setReferralToken] = useState<string>();
  const [actionsPerformed, setActionsPerformed] = useState<PointProgramActions>({
    WALLET: false,
    TWITTER: false,
    DISCORD: false,
    TELEGRAM: false,
  });

  useEffect(() => {
    const token = searchParams.get('referral');
    if (token) setReferralToken(token);
  }, [searchParams]);

  useEffect(() => {
    if (!isConnected || !isAuthenticated) return;
    SetIsOLConnected(false);
    GetOLMemberData(referralToken).then(data => {
      if (data) {
        SetIsOLConnected(true);
        if (data.labels && data.labels.length) {
          const actionPerforming: PointProgramActions = actionsPerformed;
          const labelsArray: OpenLoyaltyLabel[] = Object.values(data.labels);
          labelsArray.forEach((value: OpenLoyaltyLabel) => {
            switch (value.key) {
              case 'connectionWallet':
                actionPerforming.WALLET = true;
                break;
              case 'connectionX':
                actionPerforming.TWITTER = true;
                break;
              case 'connectionDiscord':
                actionPerforming.DISCORD = true;
                break;
              case 'connectionTelegram':
                actionPerforming.TELEGRAM = true;
                break;
            }
          });

          setActionsPerformed(() => ({
            ...actionPerforming,
          }));
        }
      }
    });
  }, [isConnected, isAuthenticated]);

  // reset completed action on wallet disconnect
  useAccount({
    onDisconnect: () => {
      setActionsPerformed(state => ({
        ...state,
        WALLET: false,
      }));
      resetActions();
      SetIsOLConnected(null);
    },
  });

  const resetActions = () => {
    setActionsPerformed(state => ({
      ...state,
      TWITTER: false,
      DISCORD: false,
      TELEGRAM: false,
    }));
  };

  const openUrl = (url: string) => {
    window.open(url, '_blank');
  };

  const handleTwitterClick = async () => {
    JoinTwitter().then(result => {
      if (result && result.url) {
        openUrl(result.url);
        setActionsPerformed(state => ({ ...state, TWITTER: true }));
        // TODO: change setActionsPerformed after checking OL API
      }
    });
  };

  const handleDiscordClick = async () => {
    JoinDiscord().then(() => {
      setActionsPerformed(state => ({ ...state, DISCORD: true }));
      // TODO: change setActionsPerformed after checking OL API
    });
  };

  const handleTelegramClick = async () => {
    openUrl(TELEGRAM_LINK);
    JoinTelegram().then(() => {
      setActionsPerformed(state => ({ ...state, TELEGRAM: true }));
      // TODO: change setActionsPerformed after checking OL API
    });
  };

  const ActionCompleted = useCallback(({ action }: { action: boolean }) => {
    return action ? <span className={styles.completedTxt}>+ Points Earned</span> : <></>;
  }, []);

  const ActionButton = useCallback(
    ({ action, text, onBtnClick }: { action: boolean; text: string; onBtnClick: () => void }) => {
      if (action) {
        return (
          <Button title='Completed' variant='outline' className={styles.completedBtn}>
            <>Completed</>
          </Button>
        );
      } else {
        return (
          <Button title='' disabled={!actionsPerformed.WALLET} onClick={onBtnClick}>
            {text}
          </Button>
        );
      }
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
                  <div className={`${styles.itemName} ${actionsPerformed.WALLET ? styles.isConnected : ''}`}>
                    Connect Your Wallet
                  </div>
                  <div className={styles.buttonContainer}>
                    <ActionCompleted action={actionsPerformed.WALLET} />
                    <ConnectButton.Custom>
                      {({ openConnectModal }) => {
                        if (actionsPerformed.WALLET) {
                          return (
                            <Button title='Completed' variant='outline' className={styles.completedBtn}>
                              {!isOLConnected ? 'Loading' : 'Completed'}
                            </Button>
                          );
                        } else {
                          return (
                            <Button title='Connect Wallet' onClick={openConnectModal}>
                              {isOLConnected === null ? 'Connect Wallet' : 'Loading'}
                            </Button>
                          );
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
                  <div className={`${styles.itemName} ${actionsPerformed.TWITTER ? styles.isConnected : ''}`}>
                    Follow Ithaca on X (Twitter)
                  </div>
                  <div className={styles.buttonContainer}>
                    <ActionCompleted action={actionsPerformed.TWITTER} />
                    <ActionButton action={actionsPerformed.TWITTER} text='Follow' onBtnClick={handleTwitterClick} />
                  </div>
                </li>
                {/* Join Discord */}
                <DiscordAuth onConnected={handleDiscordClick}>
                  {({ onStart, isConnected }) => {
                    return (
                      <li className={styles.listItem}>
                        <div className={styles.listIcon}>
                          <DiscordIcon />
                        </div>
                        <div className={`${styles.itemName} ${actionsPerformed.DISCORD ? styles.isConnected : ''}`}>
                          <a onClick={() => openUrl(DISCORD_LINK)}>Join Ithaca Discord</a>
                        </div>
                        <div className={styles.buttonContainer}>
                          <ActionCompleted action={actionsPerformed.DISCORD} />
                          {isConnected || actionsPerformed.DISCORD ? (
                            <Button title='Completed' variant='outline' className={styles.completedBtn}>
                              Completed
                            </Button>
                          ) : (
                            <Button title='' disabled={!actionsPerformed.WALLET} onClick={onStart}>
                              Join
                            </Button>
                          )}
                        </div>
                      </li>
                    );
                  }}
                </DiscordAuth>
                {/* Join Telegram */}
                <li className={styles.listItem}>
                  <div className={styles.listIcon}>
                    <TelegramIcon />
                  </div>
                  <div className={`${styles.itemName} ${actionsPerformed.TELEGRAM ? styles.isConnected : ''}`}>
                    Join Ithaca Telegram
                  </div>
                  <div className={styles.buttonContainer}>
                    <ActionCompleted action={actionsPerformed.TELEGRAM} />
                    <ActionButton action={actionsPerformed.TELEGRAM} text='Join' onBtnClick={handleTelegramClick} />
                  </div>
                </li>
              </ul>
              {actionsPerformed.WALLET && (
                <div className={styles.regerralCodeContainer}>
                  <p>Registration successful thank you joining the Ithaca Points Program.</p>
                  <Link href='/referral-code'>
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
