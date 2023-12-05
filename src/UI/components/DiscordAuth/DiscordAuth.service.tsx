// Import axios
import axios, { AxiosResponse } from 'axios';

export interface GuildMember {
  user: {
    id: string;
    username: string;
    discriminator: string;
    avatar: string | null;
    bot?: boolean; // Optional: Indicates if the user is a bot
    system?: boolean; // Optional: Indicates if the user is a system user
    mfa_enabled?: boolean; // Optional: Indicates if the user has two-factor authentication enabled
    locale?: string; // Optional: The user's chosen language
    verified?: boolean; // Optional: Indicates if the user's account is verified
    email?: string | null; // Optional: The user's email address (requires the 'email' OAuth2 scope)
  };
  nick: string | null;
  avatar: string | null;
  roles: string[]; // Array of role IDs
  joined_at: string; // ISO 8601 timestamp
  deaf: boolean;
  mute: boolean;
}

// Function to make a PUT call to the Discord API endpoint
async function joinGuild(memberId: string, guildId: string, accessToken: string): Promise<GuildMember | null> {
  try {
    // Discord API endpoint URL
    const apiUrl = `https://discord.com/api/v10/guilds/${guildId}/members/${memberId}`;

    // Request headers
    const headers = {
      Authorization: `Bot ${process.env.NEXT_PUBLIC_DISCORD_BOT_TOKEN}`, // Replace YOUR_BOT_TOKEN with your actual bot token
      'Content-Type': 'application/json',
    };

    // PUT request payload (empty for this example)
    const data = {access_token: accessToken};

    // Make the PUT request
    const response: AxiosResponse<GuildMember> = await axios.put(apiUrl, data, { headers });

    console.log('User joined the guild successfully.');
    return response.data;
  } catch (error: unknown) {
    console.error('Error joining guild:', error);
    return null;
  }
}

export default joinGuild;
