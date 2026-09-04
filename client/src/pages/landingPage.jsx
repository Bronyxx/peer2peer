import styles from './landingPage.module.css';

export default function LandingPage({
  onContinue,
}) {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Peer Support</h1>

        <p className={styles.subtitle}>
          Anonymous peer-to-peer  support.
        </p>

        <div className={styles.notice}>
          <h2>Important Notice</h2>

          <p>Peer Support is not an emergency service.</p>

          <p>
            If you are in immediate danger or experiencing a
            medical emergency, please contact local emergency
            services.
          </p>
        </div>

        <ul className={styles.panel}>
          <li>
            <span>Emergency</span>
            <span>112</span>
          </li>
          <li>
            <span>TELE-MANAS</span>
            <span>14416</span>
          </li>
        </ul>

        <button className={styles.button} onClick={onContinue}>
          I Understand
        </button>
      </div>
    </div>
  );
}