import { SessionTimeHeatmap } from '../visualizations/SessionTimeHeatmap';

export function SessionTimeCard() {
  return (
    <div className="bg-white/50 backdrop-blur-lg rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-200 p-6 h-[314px]">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-[15px] font-semibold text-gray-900">Session Time</h2>
            <p className="text-sm text-gray-500 mt-0.5">Engagement distribution</p>
          </div>
          <select className="text-sm border rounded-lg px-2 py-1.5 bg-white/80">
            <option>Hourly</option>
          </select>
        </div>
        <div className="flex-1">
          <SessionTimeHeatmap />
        </div>
      </div>
    </div>
  );
}