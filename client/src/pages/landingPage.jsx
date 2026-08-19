export default function LandingPage({
  onContinue,
}) {
  return (
    <div>
      <h1>Peer Support</h1>

      <p>
        Anonymous peer-to-peer
        emotional support.
      </p>

      <h2>
        Important Notice
      </h2>

      <p>
        Peer Support is not an
        emergency service.
      </p>

      <p>
        If you are in immediate
        danger or experiencing a
        medical emergency, please
        contact local emergency
        services.
      </p>

      <ul>
        <li>
          Emergency: 112
        </li>

        <li>
          Ambulance: 108
        </li>
      </ul>

      <button
        onClick={onContinue}
      >
        I Understand
      </button>
    </div>
  );
}