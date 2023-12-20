// Layout
import Main from '@/UI/layouts/Main/Main';
import Container from '@/UI/layouts/Container/Container';

// Components
import Meta from '@/UI/components/Meta/Meta';

const TermAndCondition = () => {
  return (
    <>
      <Meta />
      <Main>
        <Container>
          <h1 className='mb-20' style={{ fontSize: '24px' }}>
            Terms and Conditions
          </h1>
          <h5 className='mb-20'>Updated 01Dec23</h5>
          <h1>Eligibility</h1>
          <h4 style={{ fontWeight: 'normal', marginBottom: -10 }}>To access and use the Application, you must:</h4>
          <ol type='1'>
            <li>
              If you are an individual, be at least 18 years of age or the age at which a person is taken to have
              capacity to contract in the jurisdiction where you reside;
            </li>
            <li>
              If you are accessing or using the Application on behalf of a company or other legal entity, have all power
              and authority to bind that entity;
            </li>
            <li>Be legally capable of entering into binding contracts;</li>
            <li>Have the capacity to meet all of your obligations under these Terms;</li>
            <li> Not have been previously suspended or removed from accessing or using the Application;</li>
            <li> Not be an Australian or United States of America tax resident; and </li>
            <li>
              Ensure the representations and warranties set out in section 3.1 remain true and accurate at all times.
            </li>
          </ol>
          <h1>Your Access to the Application</h1>
          <h4 style={{ marginBottom: 10 }}>Your representations and warranties</h4>
          <h4 style={{ fontWeight: 'normal', marginBottom: -10 }}>
            By accessing and using the Application you represent and warrant on a continuing basis that:
          </h4>
          <ol type='1'>
            <li>You meet the eligibility criteria set out in clause</li>
            <li>
              You are not:
              <ol type='i'>
                <li>A Sanctioned Person; or</li>
                <li>A Restricted Person;</li>
              </ol>
            </li>
            <li>
              You are not accessing or using the Application on behalf of a Sanctioned Person or Restricted Person;d.
              You do not intend to transact with any Restricted Person or Sanctioned Person;e. You do not and will not
              use a virtual private network (VPN) or any other privacy or anonymisation tools or techniques to
              circumvent or attempt to circumvent any restrictions that apply to the Application; andf. Your access and
              use of the Application does not breach any Applicable Law or facilitate any activity that could breach any
              Applicable Law.
            </li>
            <li>
              AcknowledgementsBy accessing and using the Application, you acknowledge, understand, and agree that:
              <ol type='a'>
                <li>
                  The Application may be inaccessible or inoperable for any reason from time to time, including due to:
                  <ol type='i'>
                    <li>equipment, hardware or software malfunction;</li>
                    <li>
                      periodic maintenance procedures or repairs that we or any of our service providers may undertake
                      from time to time;
                    </li>
                    <li>causes beyond our control or that we cannot reasonably foresee;</li>
                    <li>
                      disruptions and temporary or permanent unavailability of underlying blockchain infrastructure;
                      orv. unavailability of third party service providers or external partners for any reason. Where
                      possible and practicable, we will give you reasonable prior notice of an inaccessible or
                      inoperable period;or external factors.
                    </li>
                  </ol>
                </li>
              </ol>
            </li>
          </ol>
        </Container>
      </Main>
    </>
  );
};

export default TermAndCondition;
