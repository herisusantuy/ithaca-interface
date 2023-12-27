import { uuid } from '@walletconnect/legacy-utils';

type AvatarProps = {
  colors?: [string, string];
};

const Avatar = ({ colors = ['#4949A2', '#5EE192'] }: AvatarProps) => {
  const id = uuid();

  return (
    <svg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <rect width='30' height='30' rx='8' fill={`url(#${id})`} />
      <defs>
        <radialGradient
          id={id}
          cx='0'
          cy='0'
          r='1'
          gradientUnits='userSpaceOnUse'
          gradientTransform='translate(15 15) rotate(90) scale(15)'
        >
          <stop offset='0.491319' stopColor={colors[0]} />
          <stop offset='1' stopColor={colors[1]} />
        </radialGradient>
      </defs>
    </svg>
  );
};

export default Avatar;
