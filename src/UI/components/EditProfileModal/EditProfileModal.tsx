import React, { ReactElement, useState, useCallback, useEffect } from 'react';
import { AuthClient } from '@ithaca-finance/sdk';
import { useAppStore } from '@/UI/lib/zustand/store';
// Styles
import styles from './EditProfileModal.module.scss';
import Modal from '@/UI/components/Modal/Modal';
import Button from '@/UI/components/Button/Button';
import Avatar from '@/UI/components/Icons/Avatar';
import Input from '@/UI/components/Input/Input';
import WalletIcon from '../Icons/Wallet';
import CopyIcon from '../Icons/CopyIcon';
import { PointsProgramAccountsEnum } from '@/UI/constants/pointsProgram';
import { useAccount } from 'wagmi';
import { formatEthAddress } from '@/UI/utils/Numbers';
import useToast from '@/UI/hooks/useToast';
import Toast from '../Toast/Toast';

type EditProfileProps = {
  trigger: ReactElement;
};

const EditProfileModal = ({ trigger }: EditProfileProps) => {
  const { ithacaSDK, isAuthenticated } = useAppStore();
  const [showTrigger, setShowTrigger] = useState(false);
  const { address, isConnected } = useAccount();
  const [leaderboardName, setLeaderboardName] = useState('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { toastList, showToast } = useToast();

  useEffect(() => {
    console.log();
    if (isAuthenticated) {
      getAccountInfo();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setShowTrigger(isConnected);
  }, [isConnected]);

  const openDialog = () => {
    setIsOpen(true);
  };
  // fetch current session and read accounts info
  const getAccountInfo = async () => {
    if (isAuthenticated) {
      try {
        const {
          accountInfos: { sn_discord, sn_telegram, sn_twitter },
        }: AuthClient & { accountInfos: Record<PointsProgramAccountsEnum, string> } = await ithacaSDK.auth.getSession();
        setLeaderboardName(sn_discord ? sn_discord : sn_telegram ? sn_telegram : sn_twitter ? sn_twitter : '');
      } catch {
        setLeaderboardName('');
      }
    }
  };
  const copyAddress = () => {
    navigator.clipboard.writeText(`${address}`);
    showToast(
      {
        id: new Date().getTime(),
        title: 'Copied',
        message: `${address}`,
        type: 'success',
      },
      'top-right'
    );
  };
  return (
    <>
      {showTrigger && (
        <button className={styles.transparentBtn} onClick={openDialog}>
          {React.cloneElement(trigger)}
        </button>
      )}

      <Modal
        isOpen={isOpen}
        onCloseModal={() => setIsOpen(false)}
        title='Edit Profile'
        className={styles.editProfileModal}
      >
        <div className={styles.dialogBody}>
          <div className={styles.profilePhotoCtrl}>
            <Avatar />
            <Button title='' variant='secondary' className={styles.hideAvatarBtn}>
              Hide Avatar
            </Button>
          </div>
          <Input
            id='leaderboardName'
            value={leaderboardName}
            onChange={({ target: { value } }) => setLeaderboardName(value)}
            label='Leaderboard Name'
            type='text'
            className={styles.leaderboardName}
          />
          <div className={styles.walletAddressField}>
            <label>Connected Wallet (Hidden)</label>
            <div className={styles.walletAddress}>
              <WalletIcon />
              {address ? (
                <>
                  <span className={styles.ethAddress}>{formatEthAddress(`${address}`)}</span>
                  <button className={styles.transparentBtn} onClick={copyAddress}>
                    <CopyIcon />
                  </button>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
          <Button title=''>Save Changes</Button>
        </div>
      </Modal>
      <Toast toastList={toastList} position='bottom-right' autoDelete={true} autoDeleteTime={2000} />
    </>
  );
};

export default EditProfileModal;
