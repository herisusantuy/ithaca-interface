import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DiscordUser } from '@/UI/constants/discordAuth';
import joinGuild from './DiscordAuth.service';

interface DiscordAuthProps {
  children?: (renderProps: DiscordAuthChildProps) => ReactNode;
  onConnected: () => void;
}

export interface DiscordAuthChildProps {
  onStart: () => void;
  userName: string;
  isConnected: boolean;
}

const redirectURL = () => window.location.origin + window.location.pathname;

const fetchDiscordUser = async (accessToken: string): Promise<DiscordUser> => {
  const apiUrl = 'https://discord.com/api/v10/users/@me';

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

const DiscordAuth: React.FC<DiscordAuthProps> = ({ children, onConnected }) => {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    // Get the fragment identifier (values after the #)
    const fragment: string | undefined = router.asPath.split('#')[1];
    (async () => {
      if (fragment) {
        // Split the fragment into key-value pairs
        const keyValuePairs: string[] = fragment.split('&');

        // Create an object to store the key-value pairs
        const queryParams: Record<string, string> = {};

        // Loop through the key-value pairs and store them in the object
        for (const pair of keyValuePairs) {
          const [key, value] = pair.split('=');
          queryParams[key] = value;
        }

        localStorage.setItem('discordAccessToken', queryParams.accessToken);
        const user = await fetchDiscordUser(queryParams.access_token);
        const memberId = '730670802009194516';
        const guildId = '1181417822308536340';
        const accessToken = queryParams.access_token;
        const guildMember = await joinGuild(memberId, guildId, accessToken);
        console.log('Discord User => ', user);
        console.log('Guild member => ', guildMember);
        if (user) {
          setUserName(user.username);
          setIsConnected(true);
          onConnected();
        } else {
          setIsConnected(false);
        }
        // Remove the hash from the URL
        const newUrl = router.asPath.replace(`#${fragment}`, '');
        router.replace(newUrl, undefined, { shallow: true });
      }
    })();
  }, [router, router.asPath, onConnected]);

  const onStart = () => {
    const url =
      process.env.NEXT_PUBLIC_DISCORD_OAUTH_IMPLICIT_GRANT_URL?.replace('{redirect_uri}', redirectURL())?.replace(
        '{client_id}',
        `${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}`
      ) || '';
    window.location.href = url;
  };

  return <>{children && children({ onStart, userName, isConnected })}</>;
};

export default DiscordAuth;
