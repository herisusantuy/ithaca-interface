// Components
import Panel from '@/UI/layouts/Panel/Panel';

// Styles
import styles from './Typography.module.scss';

const Typography = () => {
  const fontSizes = [
    'Display2xl',
    'DisplayXl',
    'DisplayMd',
    'DisplayXs',
    'TextXl',
    'TextLg',
    'TextMd',
    'TextSm',
    'TextXs',
  ];

  const variations = ['Regular', 'Medium', 'Bold'];
  const fonts = ['Roboto', 'Lato'];

  return (
    <>
      {fonts.map(font => (
        <>
          <h1 className={font === 'Lato' ? 'mt-64 mb-24 font-lato' : 'mb-24'}>{font}</h1>
          <Panel>
            {fontSizes.map(fontSize => (
              <>
                <p className={styles.label}>{fontSize}</p>
                <div key={fontSize} className={styles.row}>
                  {variations.map(variation => (
                    <div key={fontSize + variation} className={styles.column}>
                      <p className={styles[`${font}${fontSize}${variation}`]}>{fontSize}</p>
                      <p className={styles[`${font}${fontSize}${variation}`]}>{variation}</p>
                    </div>
                  ))}
                </div>
              </>
            ))}
          </Panel>
        </>
      ))}
    </>
  );
};

export default Typography;
