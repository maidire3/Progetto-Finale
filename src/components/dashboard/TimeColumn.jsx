import React from 'react';

function TimeColumn({ hours }) {
  return (
    <div className="weekly-calendar__time-column">
      <div className="weekly-calendar__corner" />

      <div className="weekly-calendar__time-slots">
        {hours.map((hour) => (
          <div className="weekly-calendar__time-slot" key={hour}>
            <span>{`${String(hour).padStart(2, '0')}:00`}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TimeColumn;
