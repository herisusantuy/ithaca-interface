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
