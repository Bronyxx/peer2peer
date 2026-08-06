function SessionSummary({
  duration,
  endedBy,
}) {

  return (
    <div>

      <h2>
        Session Completed
      </h2>

      <p>
        Duration:
        {duration}
      </p>

      <p>
        Ended By:
        {endedBy}
      </p>

    </div>
  );

}

export default SessionSummary;