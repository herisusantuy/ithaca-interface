const RequestHandle = async ({ method = 'POST', data, url }: { method?: string; data?: object; url: string }) => {
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
    const response = await fetch(`http://192.168.0.20:8000/api/${url}`, requestOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch {
    return undefined;
  }
};

const getSessionInfo = () => {
  const session = localStorage.getItem('ithaca.session');
  if (!session) throw new Error('No session info');
  return JSON.parse(session);
};

export const JoinPointsProgram = async () => {
  const session = getSessionInfo();

  const data = {
    customer: {
      loyaltyCardNumber: session.ethAddress,
    },
  };

  return await RequestHandle({ data: data, url: 'points/join' });
};

export const Test = async () => {
  const eventSource = new EventSource('http://localhost:8000/sse');

  eventSource.onmessage = function (event) {
    console.log(event);
  };
};

export const GetOLMemberData = async () => {
  const session = getSessionInfo();

  const data = {
    card: session.ethAddress,
  };

  const result = await RequestHandle({ data: data, url: 'ol/member' });

  if (!result.isExist) {
    await JoinPointsProgram();
    const { member } = await RequestHandle({ data: data, url: 'ol/member' });
    return member;
  }

  return result.member;
};

export const JoinTwitter = async () => {
  const session = getSessionInfo();

  return await RequestHandle({ method: 'GET', url: `auth/twitter/login?card=${session.ethAddress}` });
};

export const JoinDiscord = async () => {
  const session = getSessionInfo();

  const data = {
    card: session.ethAddress,
    type: 'DISCORD',
  };

  return await RequestHandle({ data: data, url: 'ol/event' });
};

export const JoinTelegram = async () => {
  const session = getSessionInfo();

  const data = {
    card: session.ethAddress,
    type: 'TELEGRAM',
  };

  return await RequestHandle({ data: data, url: 'ol/event' });
};

export const GetReferrals = async () => {
  return await RequestHandle({ url: `ol/referrals` });
};
