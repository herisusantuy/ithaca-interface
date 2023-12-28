export enum PointsProgramAccountsEnum {
  WALLET = 'sn_wallet',
  TWITTER = 'sn_twitter',
  DISCORD = 'sn_discord',
  TELEGRAM = 'sn_telegram',
}

export type OpenLoyaltyLabel = {
  key: string;
  value: string;
};

export type PointsProgramMember = {
  customerId: string;
  firstName: string;
  lastName: string;
  loyaltyCardNumber: string;
  referralToken: string;
  labels: OpenLoyaltyLabel[];
};

export type ReferralsRequestProps = {
  page: number;
};

export type ReferralMemberType = {
  acceptedInvites: number;
  id: string;
  invitedBy: string;
  referrerToken: string;
  username: string;
};

export type ReferralsDataType = {
  currentUser: [ReferralMemberType];
  referralsData: ReferralMemberType[];
};

export type LeaderboardUserDataType = {
  username: string | null;
  avatarUrl: string | null;
  isHide: boolean;
};
