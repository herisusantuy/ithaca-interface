import {
  PointsProgramMember,
  ReferralsRequestProps,
  ReferralsDataType,
  LeaderboardUserDataType,
} from '@/UI/constants/pointsProgram';

export const SSEConnect = () => {
  const sse = new EventSource(`${process.env.NEXT_PUBLIC_BACKEND_POINTS_URL}/sse`);

  sse.onopen = () => {
    console.log('SSE is connected successfully');
  };

  sse.onmessage = event => {
    console.log(`SSE Message: ${event.data}`);
  };

  sse.onerror = event => {
    console.log('SSE Error occurred: ', event);
    sse.close();
  };
};

const RequestHandle = async ({ method = 'POST', data, path }: { method?: string; data?: object; path: string }) => {
  const headers = {
    'Content-Type': 'application/json;charset=UTF-8',
    Accept: 'application/json, text/plain, */*',
  };

  const requestOptions = {
    method,
    headers,
    ...(data && { body: JSON.stringify(data) }),
  };

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_POINTS_URL}/api/${path}`, requestOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return error;
  }
};

const getSessionInfo = () => {
  const session = localStorage.getItem('ithaca.session');
  if (!session) throw new Error('No session info');
  return JSON.parse(session);
};

export const JoinPointsProgram = async (referralToken?: string) => {
  const session = getSessionInfo();

  const data = {
    customer: {
      loyaltyCardNumber: session.ethAddress,
      referrerToken: referralToken,
    },
  };

  return await RequestHandle({ data: data, path: 'points/join' });
};

export const GetOLMemberData = async (referralToken?: string): Promise<PointsProgramMember> => {
  const session = getSessionInfo();

  const result = await RequestHandle({ method: 'GET', path: `ol/member?card=${session.ethAddress}` });

  if (!result.isExist) {
    await JoinPointsProgram(referralToken);
    return await GetOLMemberData(referralToken);
  }

  return result.member;
};

export const JoinTwitter = async () => {
  const session = getSessionInfo();

  return await RequestHandle({ method: 'GET', path: `auth/twitter/login?card=${session.ethAddress}` });
};

export const JoinDiscord = async () => {
  const session = getSessionInfo();

  const data = {
    card: session.ethAddress,
    type: 'DISCORD',
  };

  return await RequestHandle({ data: data, path: 'ol/event' });
};

export const JoinTelegram = async () => {
  const session = getSessionInfo();

  const data = {
    card: session.ethAddress,
    type: 'TELEGRAM',
  };

  return await RequestHandle({ data: data, path: 'ol/event' });
};

export const GetReferrals = async ({ page }: ReferralsRequestProps): Promise<ReferralsDataType> => {
  const session = getSessionInfo();

  const result = await RequestHandle({ method: 'GET', path: `ol/member?card=${session.ethAddress}` });

  if (!result.isExist) {
    await JoinPointsProgram();
    return await GetReferrals({ page });
  }

  return await RequestHandle({
    method: 'GET',
    path: `ol/referrals?card=${session.ethAddress}&page=${page}&count=9`,
  });
};

export const UpdateUsername = async ({ username, avatarUrl, isHide }: LeaderboardUserDataType) => {
  const session = getSessionInfo();

  const data = {
    customer: {
      loyaltyCardNumber: session.ethAddress,
      firstName: username,
    },
    avatar: {
      url: avatarUrl,
      isHide: isHide,
    },
  };

  return await RequestHandle({ method: 'put', path: `ol/member`, data: data });
};
