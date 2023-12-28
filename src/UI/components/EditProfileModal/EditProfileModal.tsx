import React, { ReactElement, useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

//Components
import Modal from '@/UI/components/Modal/Modal';
import Button from '@/UI/components/Button/Button';
import Avatar from '@/UI/components/Icons/Avatar';
import Input from '@/UI/components/Input/Input';
import Toast from '../Toast/Toast';
import WalletIcon from '../Icons/Wallet';
import CopyIcon from '../Icons/CopyIcon';

// Constants
import { LeaderboardUserDataType } from '@/UI/constants/pointsProgram';

// Utils
import { GetOLMemberData, UpdateUsername } from '@/UI/components/Points/PointsAPI';
import { formatEthAddress } from '@/UI/utils/Numbers';
import useToast from '@/UI/hooks/useToast';

// Styles
import styles from './EditProfileModal.module.scss';
import Loader from '@/UI/components/Loader/Loader';

type EditProfileProps = {
  trigger: ReactElement;
};

const EditProfileModal = ({ trigger }: EditProfileProps) => {
  const [showTrigger, setShowTrigger] = useState(false);
  const { address, isConnected } = useAccount();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toastList, showToast } = useToast();

  const [leaderboardUserData, setLeaderboardUserData] = useState<LeaderboardUserDataType>({
    username: null,
    avatarUrl: null,
    isHide: false,
  });

  const cleanUserData = () => {
    setLeaderboardUserData({
      username: null,
      avatarUrl: null,
      isHide: false,
    });
  };

  useEffect(() => {
    setShowTrigger(isConnected);
  }, [isConnected]);

  const openDialog = () => {
    if (leaderboardUserData.username === null) {
      setIsLoading(true);
      GetOLMemberData().then(member => {
        const { firstName } = member;
        const avatarUrl = member.labels.find(label => label.key === 'avatar');
        const isHide = member.labels.find(label => label.key === 'isHide');

        setLeaderboardUserData(prevState => {
          return {
            username: firstName,
            avatarUrl: avatarUrl?.value || '',
            isHide: isHide?.value === 'true' || false,
          };
        });
        setIsLoading(false);
      });
    }
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    cleanUserData();
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
    UpdateUsername(leaderboardUserData).then(() => {
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

  const handleChangeUsername = (value: string) => {
    setLeaderboardUserData(prevState => ({
      ...prevState,
      username: value,
    }));
  };

  const handleChangeAvatarVisible = (value: boolean) => {
    setLeaderboardUserData(prevState => ({
      ...prevState,
      isHide: value,
    }));
  };

  return (
    <>
      {showTrigger && (
        <button className={styles.transparentBtn} onClick={openDialog}>
          {React.cloneElement(trigger)}
        </button>
      )}

      <Modal isOpen={isOpen} onCloseModal={closeDialog} title='Edit Profile' className={styles.editProfileModal}>
        {isLoading ? (
          <div className={styles.loaderWrapper}>
            <Loader />
          </div>
        ) : (
          <div className={styles.dialogBody}>
            <div className={styles.profilePhotoCtrl}>
              {leaderboardUserData.avatarUrl && !leaderboardUserData.isHide ? (
                <img className={styles.avatar} src={leaderboardUserData.avatarUrl} alt='Leaderboard avatarUrl' />
              ) : (
                <Avatar />
              )}
              {leaderboardUserData.isHide ? (
                <Button
                  title=''
                  variant='secondary'
                  className={styles.hideAvatarBtn}
                  onClick={() => handleChangeAvatarVisible(false)}
                >
                  Show Avatar
                </Button>
              ) : (
                <Button
                  title=''
                  variant='secondary'
                  className={styles.hideAvatarBtn}
                  onClick={() => handleChangeAvatarVisible(true)}
                >
                  Hide Avatar
                </Button>
              )}
            </div>
            <Input
              id='leaderboardName'
              value={leaderboardUserData.username || ''}
              onChange={({ target: { value } }) => handleChangeUsername(value)}
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
        )}
      </Modal>
      <Toast toastList={toastList} position='bottom-right' autoDelete={true} autoDeleteTime={2000} />
    </>
  );
};

export default EditProfileModal;
