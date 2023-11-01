// Components
import Panel from '@/UI/layouts/Panel/Panel';

// Styles
import styles from './Typography.module.scss';

const Typography = () => {
  // Font weights
  const variations = ['Regular', 'Medium', 'Semibold', 'Bold'];

  // Font family
  const fonts = ['Roboto', 'Lato'];

  // Font sizes and conversions
  const fontSizes = [
    { name: 'TextXl', size: '24px | 1.5rem' },
    { name: 'TextLg', size: '18px | 1.125rem' },
    { name: 'TextMd', size: '16px | 1rem' },
    { name: 'TextSm', size: '14px | 0.875rem' },
    { name: 'TextXs', size: '12px | 0.75rem' },
    { name: 'TextXs', size: '10px | 0.6rem' },
  ];

  return (
    <>
      {fonts.map(font => (
        <div key={font}>
          <h1 className={font === 'Lato' ? 'mt-64 mb-24 font-lato' : 'mb-24'}>{font}</h1>
          <Panel>
            {fontSizes.map(({ name, size }) => {
              return (
                <div className='mb-32' key={name}>
                  <p className={styles.label}>{size}</p>
                  <div className={styles.row}>
                    {variations.map(variation => (
                      <div key={name + variation} className={styles.column}>
                        <p className={styles[`${font}${name}${variation}`]}>{`${font} ${name}`}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </Panel>
        </div>
      ))}
    </>
  );
};

export default Typography;
