import { useState, useCallback, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useAppStore } from '@/UI/lib/zustand/store';
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
import { GetOLMemberData, JoinDiscord, JoinPointsProgram, JoinTelegram, JoinTwitter, Test } from './PointsAPI';
// SDK
import { AuthClient } from '@ithaca-finance/sdk';
// Styles
import styles from './points-program.module.scss';
import DiscordAuth from '@/UI/components/DiscordAuth/DiscordAuth';

const TWITTER_LINK = 'https://twitter.com/ithacaprotocol';
const DISCORD_LINK = 'https://discord.gg/ithaca';
const TELEGRAM_LINK = 'https://t.me/+E7KmlGwmxmtkOWU1';

type PointProgramActions = Record<keyof typeof PointsProgramAccountsEnum, boolean>;
const PointsProgram = () => {
  const { ithacaSDK, isAuthenticated } = useAppStore();

  const [isOLConnected, SetIsOLConnected] = useState<boolean | null>(null);
  const [actionsPerformed, setActionsPerformed] = useState<PointProgramActions>({
    WALLET: false,
    TWITTER: false,
    DISCORD: false,
    TELEGRAM: false,
  });

  // update completed actions when authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      Test();
      SetIsOLConnected(false);

      GetOLMemberData().then(data => {
        if (data) {
          SetIsOLConnected(true);
          if (data.labels && data.labels.length) {
            const actionPerforming: PointProgramActions = actionsPerformed;
            Object.values(data.labels).forEach(({ key }: any) => {
              switch (key) {
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
    }
    // updateCompletedActions();
  }, [isAuthenticated]);

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

  // fetch current session and read accounts info to update completed actions
  const updateCompletedActions = async () => {
    if (isAuthenticated) {
      try {
        const {
          accountInfos: { sn_discord, sn_telegram, sn_twitter },
        }: AuthClient & { accountInfos: Record<PointsProgramAccountsEnum, string> } = await ithacaSDK.auth.getSession();

        setActionsPerformed(state => {
          return {
            ...state,
            TWITTER: !!sn_twitter,
            DISCORD: !!sn_discord,
            TELEGRAM: !!sn_telegram,
          };
        });
      } catch {
        resetActions();
      }
    }
  };

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

  // store completed actions on backend
  const addAccountData = async (account: PointsProgramAccountsEnum, userName: string): Promise<boolean> => {
    try {
      await ithacaSDK.points.addAccountData(account, userName);
      return true;
    } catch {
      return false;
    }
  };

  const handleTwitterClick = async () => {
    JoinTwitter().then(result => {
      if (result && result.url) {
        openUrl(result.url);
        setActionsPerformed(state => ({ ...state, TWITTER: true }));
        // TODO: change setActionsPerformed after checking OL API
      }
    });
    // await updateCompletedActions();
  };

  const handleDiscordClick = async () => {
    JoinDiscord().then(result => {
      setActionsPerformed(state => ({ ...state, DISCORD: true }));
      // openUrl(DISCORD_LINK);
      // TODO: change setActionsPerformed after checking OL API
    });
    // await updateCompletedActions();
  };

  const handleTelegramClick = async () => {
    openUrl(TELEGRAM_LINK);
    JoinTelegram().then(result => {
      setActionsPerformed(state => ({ ...state, TELEGRAM: true }));
      // TODO: change setActionsPerformed after checking OL API
    });
    // await updateCompletedActions();
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
              {/* {actionsPerformed.WALLET && (
                <div className={styles.regerralCodeContainer}>
                  <p>Registration successful thank you joining the Ithaca Points Program.</p>
                  <Link href='/referrals'>
                    <Button title='Reveal Referral Code' variant='secondary'>
                      Reveal Referral Code
                    </Button>
                  </Link>
                </div>
              )} */}
            </Panel>
          </div>
        </Container>
      </Main>
    </>
  );
};

export default PointsProgram;
