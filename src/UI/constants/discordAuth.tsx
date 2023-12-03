export interface DiscordUser {
  id: string;
  username: string;
  avatar: any;
  discriminator: string;
  public_flags: number;
  premium_type: number;
  flags: number;
  banner: any;
  accent_color: any;
  global_name: string;
  avatar_decoration_data: any;
  banner_color: any;
  mfa_enabled: boolean;
  locale: string;
}
