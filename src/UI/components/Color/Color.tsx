// Types
export type SolidColor = {
  name: string;
  hex: string;
};

export type TransparentColor = {
  name: string;
  hex: string;
  opacity: number;
};

type ColorProps = SolidColor | TransparentColor;

// Styles
import styles from './Color.module.scss';

const Color = (props: ColorProps) => {
  const isTransparent = 'opacity' in props;

  const style = {
    backgroundColor: isTransparent
      ? `rgba(${parseInt(props.hex.slice(1, 3), 16)}, ${parseInt(props.hex.slice(3, 5), 16)}, ${parseInt(
          props.hex.slice(5, 7),
          16
        )}, ${props.opacity / 100})`
      : props.hex,
    color: props.hex === '#FFFFFF' ? 'black' : 'white',
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.color}
        style={{
          ...style,
        }}
      />
      <div className={styles.description}>
        <p>{props.name}</p>
        <p>
          {isTransparent ? (
            <>
              {props.hex}, <span>opacity {props.opacity}%</span>
            </>
          ) : (
            props.hex
          )}
        </p>
      </div>
    </div>
  );
};

export default Color;
