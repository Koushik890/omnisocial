'use client';

const timeSlots = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
const daysMap = [
  { short: 'S', full: 'Sun' },
  { short: 'M', full: 'Mon' },
  { short: 'T', full: 'Tue' },
  { short: 'W', full: 'Wed' },
  { short: 'Th', full: 'Thu' },
  { short: 'F', full: 'Fri' },
  { short: 'Sa', full: 'Sat' }
];

const data = [
  { day: 'Sun', time: '04:00', value: 3 },
  { day: 'Sun', time: '12:00', value: 2 },
  { day: 'Sun', time: '20:00', value: 3 },
  { day: 'Mon', time: '08:00', value: 3 },
  { day: 'Mon', time: '16:00', value: 2 },
  { day: 'Tue', time: '00:00', value: 2 },
  { day: 'Tue', time: '08:00', value: 3 },
  { day: 'Tue', time: '16:00', value: 3 },
  { day: 'Wed', time: '04:00', value: 2 },
  { day: 'Wed', time: '12:00', value: 3 },
  { day: 'Wed', time: '20:00', value: 2 },
  { day: 'Thu', time: '08:00', value: 3 },
  { day: 'Thu', time: '16:00', value: 2 },
  { day: 'Fri', time: '04:00', value: 3 },
  { day: 'Fri', time: '12:00', value: 2 },
  { day: 'Fri', time: '20:00', value: 3 },
  { day: 'Sat', time: '00:00', value: 2 },
  { day: 'Sat', time: '08:00', value: 3 },
  { day: 'Sat', time: '16:00', value: 3 },
];

export function SessionTimeHeatmap() {
  const getColor = (day: string, time: string) => {
    const cell = data.find(d => d.day === day && d.time === time);
    if (!cell) return 'bg-gray-100';
    return cell.value === 3 ? 'bg-purple-500/80' : 'bg-purple-300/80';
  };

  return (
    <div className="w-full h-full">
      <div className="flex mb-2">
        <div className="w-8" />
        <div className="flex flex-1 justify-between text-xs text-gray-500">
          {timeSlots.map((time) => (
            <div key={time} className="text-center w-8">{time}</div>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        {daysMap.map((day) => (
          <div key={day.full} className="flex items-center">
            <div className="w-8 text-xs text-gray-500">{day.short}</div>
            <div className="flex flex-1 justify-between">
              {timeSlots.map((time) => (
                <div key={`${day.full}-${time}`} className="w-8 flex justify-center">
                  <div
                    className={`w-3 h-3 rounded-full ${getColor(day.full, time)} transition-colors duration-200`}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}