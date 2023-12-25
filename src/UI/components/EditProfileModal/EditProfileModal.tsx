import React, { ReactElement, useState, useEffect } from 'react';
import { useAppStore } from '@/UI/lib/zustand/store';
import { useAccount } from 'wagmi';

//Components
import Modal from '@/UI/components/Modal/Modal';
import Button from '@/UI/components/Button/Button';
import Avatar from '@/UI/components/Icons/Avatar';
import Input from '@/UI/components/Input/Input';
import Toast from '../Toast/Toast';
import WalletIcon from '../Icons/Wallet';
import CopyIcon from '../Icons/CopyIcon';

// Utils
import { GetOLMemberData, UpdateUsername } from '@/UI/components/Points/PointsAPI';
import { formatEthAddress } from '@/UI/utils/Numbers';
import useToast from '@/UI/hooks/useToast';

// Styles
import styles from './EditProfileModal.module.scss';

type EditProfileProps = {
  trigger: ReactElement;
};

const EditProfileModal = ({ trigger }: EditProfileProps) => {
  const { isAuthenticated } = useAppStore();
  const [showTrigger, setShowTrigger] = useState(false);
  const { address, isConnected } = useAccount();
  const [leaderboardName, setLeaderboardName] = useState('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { toastList, showToast } = useToast();

  useEffect(() => {
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

  const closeDialog = () => {
    setIsOpen(false);
  };

  const getAccountInfo = async () => {
    if (isAuthenticated) {
      GetOLMemberData().then(member => {
        const { firstName } = member;
        setLeaderboardName(firstName);
      });
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

  const handleSaveChanges = () => {
    UpdateUsername(leaderboardName).then(res => {
      showToast(
        {
          id: new Date().getTime(),
          title: 'Saved',
          message: `Profile information has been saved.`,
          type: 'success',
        },
        'top-right'
      );
    });
  };

  return (
    <>
      {showTrigger && (
        <button className={styles.transparentBtn} onClick={openDialog}>
          {React.cloneElement(trigger)}
        </button>
      )}

      <Modal isOpen={isOpen} onCloseModal={closeDialog} title='Edit Profile' className={styles.editProfileModal}>
        <div className={styles.dialogBody}>
          <div className={styles.profilePhotoCtrl}>
            <Avatar />
            {/*<Button title='' variant='secondary' className={styles.hideAvatarBtn}>*/}
            {/*  Hide Avatar*/}
            {/*</Button>*/}
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
          <Button onClick={handleSaveChanges} title=''>
            Save Changes
          </Button>
        </div>
      </Modal>
      <Toast toastList={toastList} position='bottom-right' autoDelete={true} autoDeleteTime={2000} />
    </>
  );
};

export default EditProfileModal;
