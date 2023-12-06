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
import { useAppStore } from '@/UI/lib/zustand/store';
import { PointsProgramAccountsEnum } from '@/UI/constants/pointsProgram';

const TWITTER_LINK = 'https://twitter.com/ithacaprotocol';
const DISCORD_LINK = 'https://discord.gg/ithacaprotocol';
const TELEGRAM_LINK = 'https://t.me/+E7KmlGwmxmtkOWU1';

type PointProgramActions = Record<keyof typeof PointsProgramAccountsEnum, boolean>;
const PointsProgram = () => {
  const { ithacaSDK } = useAppStore();

  const [actionsPerformed, setActionsPerformed] = useState<PointProgramActions>({
    WALLET: false,
    TWITTER: false,
    DISCORD: false,
    TELEGRAM: false,
  });

  useAccount({
    onConnect: () => {
      setActionsPerformed(state => ({
        ...state,
        WALLET: true,
      }));
    },
    onDisconnect: () => {
      setActionsPerformed(state => ({
        ...state,
        WALLET: false,
      }));
    },
  });

  const openUrl = (url: string) => {
    window.open(url, '_blank');
  };

  const addAccountData = async (account: PointsProgramAccountsEnum, userName: string): Promise<boolean> => {
    try {
      await ithacaSDK.points.addAccountData(account, userName);
      return true;
    } catch {
      return false;
    }
  };

  const handleTwitterClick = async () => {
    openUrl(TWITTER_LINK);
    const flag = await addAccountData(PointsProgramAccountsEnum.TWITTER, 'ithacaUser');
    setActionsPerformed(state => ({ ...state, TWITTER: flag }));
  };

  const handleDiscordClick = async () => {
    openUrl(DISCORD_LINK);
    const flag = await addAccountData(PointsProgramAccountsEnum.DISCORD, 'ithacaUser');
    setActionsPerformed(state => ({ ...state, DISCORD: flag }));
  };

  const handleTelegramClick = async () => {
    openUrl(TELEGRAM_LINK);
    const flag = await addAccountData(PointsProgramAccountsEnum.TELEGRAM, 'ithacaUser');
    setActionsPerformed(state => ({ ...state, TELEGRAM: flag }));
  };

  const ActionCompleted = useCallback(({ action }: { action: boolean }) => {
    return action ? <span className={styles.completedTxt}>+ points earned</span> : <></>;
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
                    Connect your wallet
                  </div>
                  <div className={styles.buttonContainer}>
                    <ActionCompleted action={actionsPerformed.WALLET} />
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
                  <div className={`${styles.itemName} ${actionsPerformed.TWITTER ? styles.isConnected : ''}`}>
                    Follow Ithaca on X (Twitter)
                  </div>
                  <div className={styles.buttonContainer}>
                    <ActionCompleted action={actionsPerformed.TWITTER} />
                    <ActionButton action={actionsPerformed.TWITTER} text='Follow' onBtnClick={handleTwitterClick} />
                  </div>
                </li>
                {/* Join Discord */}
                <li className={styles.listItem}>
                  <div className={styles.listIcon}>
                    <DiscordIcon />
                  </div>
                  <div className={`${styles.itemName} ${actionsPerformed.DISCORD ? styles.isConnected : ''}`}>
                    Join Ithaca Discord
                  </div>
                  <div className={styles.buttonContainer}>
                    <ActionCompleted action={actionsPerformed.DISCORD} />
                    <ActionButton action={actionsPerformed.DISCORD} text='Join' onBtnClick={handleDiscordClick} />
                  </div>
                </li>
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
            </Panel>
          </div>
        </Container>
      </Main>
    </>
  );
};

export default PointsProgram;
