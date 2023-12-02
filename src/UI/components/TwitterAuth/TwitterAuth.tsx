import Button from '@/UI/components/Button/Button';
import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';

interface TwitterAuthProps {
  children?: (renderProps: TwitterAuthChildProps) => ReactNode;
}

export interface TwitterAuthChildProps {
  onStart: () => void;
}

const requestTwitterAuthToken = async (code: string) => {
  const url = process.env.NEXT_PUBLIC_TWITTER_OAUTH_TOKEN_END_POINT || '';
  const clientId = process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID || '';
  const data = new URLSearchParams();
  data.append('code', code);
  data.append('grant_type', 'authorization_code');
  data.append('client_id', clientId);
  data.append('redirect_uri', document.URL);
  data.append('code_verifier', 'challenge');

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization' : 'Basic AAAAAAAAAAAAAAAAAAAAAI4lrQEAAAAAAJ9oTNrHL7o5Y65cvZjKg6PZgsk%3DUxI2LmT2OxwYnxnMrqwc9l6KuU4d1EYVvFLAkCzspm0mqX5wvm'
    },
    body: data,
  };

  try {
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error: any) {
    console.error('Error:', error.message);
    return error;
  }
};

const TwitterAuth: React.FC<TwitterAuthProps> = ({ children }) => {
  const router = useRouter();
  const { state, code } = router.query;

  useEffect(() => {
    console.log(state, ' => ', code);
    if (code && state) {
      router.replace(router.pathname, undefined, { shallow: true });
      (async () => {
        const result = await requestTwitterAuthToken(`${code}`);
        console.log('Token Result => ', result);
      })();
    }
  }, [code, state]);

  const onStart = () => {
    const url =
      process.env.NEXT_PUBLIC_TWITTER_OAUTH_URL?.replace('{redirect_uri}', document.URL)?.replace(
        '{client_id}',
        `${process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID}`
      ) || '';
    window.location.href = url;
  };

  return <>{children && children({ onStart })}</>;
};

export default TwitterAuth;
