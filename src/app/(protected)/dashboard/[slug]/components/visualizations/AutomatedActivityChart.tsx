'use client';

import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ChartOptions,
  ScriptableContext,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const options: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    // Adjust overall chart padding if desired
    padding: {
      left: 0,
      right: 0,
      top: 12,
      bottom: 0
    }
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false,
      external: function(context) {
        let tooltipEl = document.getElementById('chartjs-tooltip');
        let dashedLineEl = document.getElementById('chartjs-dashed-line');

        // Create tooltip element if it doesn't exist
        if (!tooltipEl) {
          tooltipEl = document.createElement('div');
          tooltipEl.id = 'chartjs-tooltip';
          tooltipEl.innerHTML = '<div></div>';
          document.body.appendChild(tooltipEl);
        }
        // Create dashed line element if it doesn't exist
        if (!dashedLineEl) {
          dashedLineEl = document.createElement('div');
          dashedLineEl.id = 'chartjs-dashed-line';
          document.body.appendChild(dashedLineEl);
        }

        const tooltipModel = context.tooltip;
        
        // Handle hiding both elements
        if (tooltipModel.opacity === 0) {
          tooltipEl.style.opacity = '0';
          if (dashedLineEl) {
            dashedLineEl.style.opacity = '0';
          }
          return;
        }

        const position = context.chart.canvas.getBoundingClientRect();

        if (tooltipModel.body) {
          const value = tooltipModel.dataPoints[0].raw as number;
          const formattedValue = value.toString().replace(/\B(?=(\d{1})+(?!\d))/g, ",");
          const dataPoint = context.tooltip.dataPoints[0];
          const yPos = dataPoint.element.y;
          const yScale = context.chart.scales.y;
          const pointRadius = 4; 
          const lineHeight = yScale.bottom - (yPos + pointRadius);

          const innerHtml = `
            <div>
              <div class="px-3 py-1.5 bg-[#000000] rounded-lg text-center shadow-lg"
                   style="min-width: 48px;">
                <span class="text-[#FFFFFF] text-sm font-medium"
                      style="font-family: Inter, sans-serif;">
                  ${formattedValue}k
                </span>
              </div>
            </div>
          `;
          tooltipEl.innerHTML = innerHtml;
          
          // Update dashed line position and visibility
          dashedLineEl.style.position = 'absolute';
          dashedLineEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
          dashedLineEl.style.top = position.top + window.pageYOffset + yPos + pointRadius + 'px';
          dashedLineEl.style.height = `${lineHeight}px`;
          dashedLineEl.style.width = '1px';
          dashedLineEl.style.borderLeft = '1px dashed #A3C8F0';
          dashedLineEl.style.pointerEvents = 'none';
          dashedLineEl.style.zIndex = '998';
          dashedLineEl.style.opacity = '1';
          dashedLineEl.style.transition = 'opacity 0.1s ease-out';
        }

        tooltipEl.style.opacity = '1';
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX - 24 + 'px';
        tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY - 45 + 'px';
        tooltipEl.style.pointerEvents = 'none';
        tooltipEl.style.zIndex = '999';
        tooltipEl.style.transition = 'opacity 0.1s ease-out';
      }
    }
  },
  scales: {
    y: {
      min: 0,
      max: 75,
      display: false,
      grid: { display: false },
      border: { display: false },
      ticks: { display: false }
    },
    x: {
      type: 'category',
      // Shift the axis so it lines up neatly with the first and last labels.
      min: -0.5,   // Slightly left of the 0th label (12AM)
      max: 23.4,   // Slightly right of the 23rd label (11PM)
      offset: false,
      grid: {
        display: false
      },
      border: {
        display: true,
        color: '#E2E8F0',
        width: 1,
        dash: []
      },
      ticks: {
        color: '#94A3B8',
        font: {
          size: 11,
          family: 'Inter',
          weight: 'normal'
        },
        padding: 8,
        maxRotation: 0,
        autoSkip: false,
        align: 'center', // keep the labels centered under their ticks
        callback: function(value, index) {
          const timePoints = [0, 6, 12, 18, 23];
          if (timePoints.includes(index)) {
            const hour = index;
            const ampm = hour < 12 ? 'AM' : 'PM';
            const displayHour = hour === 0 ? '12' : hour > 12 ? `${hour-12}` : `${hour}`;
            return displayHour + (index === 23 ? 'PM' : ampm);
          }
          return '';
        }
      }
    }
  },
  elements: {
    line: {
      tension: 0.4,
      borderWidth: 2.5,
      borderColor: '#4A90E2'
    },
    point: {
      radius: 0,
      hitRadius: 8,
      hoverRadius: 4,
      borderWidth: 1.5,
      backgroundColor: '#fff',
      borderColor: '#4A90E2',
      hoverBackgroundColor: '#fff',
      hoverBorderColor: '#4A90E2'
    },
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
  datasets: {
    line: {
      order: 1
    }
  }
};

type TimeRange = 'today' | 'week' | 'year';

export function AutomatedActivityChart() {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('year');

  const data = {
    labels: Array.from({ length: 24 }, (_, i) => {
      const ampm = i < 12 ? 'AM' : 'PM';
      const hour = i === 0 ? 12 : i > 12 ? i - 12 : i;
      return `${hour}${ampm}`;
    }),
    datasets: [
      {
        fill: true,
        backgroundColor: (context: ScriptableContext<'line'>) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return 'rgba(233, 244, 255, 0.85)';
          
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(233, 244, 255, 0.85)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0.85)');
          return gradient;
        },
        data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 50) + 15),
        borderColor: '#4A90E2',
        tension: 0.4,
        pointBackgroundColor: '#4A90E2',
        pointBorderColor: '#4A90E2',
        borderWidth: 2.5
      },
    ],
  };

  return (
    <div className="bg-white rounded-[32px] px-0 pt-4 pb-5 h-full">
      <div className="flex justify-between items-center mb-2 px-4">
        <h3 className="text-lg font-semibold text-gray-900">Automated Activity</h3>
        <div className="inline-flex items-center border border-gray-200 rounded-[20px] p-1">
          <button 
            onClick={() => setSelectedRange('today')}
            className={`px-2.5 py-1 text-sm transition-colors rounded-[16px] ${
              selectedRange === 'today'
                ? 'bg-[#FFE600] text-black'
                : 'text-[#94A3B8] hover:text-gray-600'
            }`}
          >
            Today
          </button>
          <button 
            onClick={() => setSelectedRange('week')}
            className={`px-2.5 py-1 text-sm transition-colors rounded-[16px] ${
              selectedRange === 'week'
                ? 'bg-[#FFE600] text-black'
                : 'text-[#94A3B8] hover:text-gray-600'
            }`}
          >
            This Week
          </button>
          <button 
            onClick={() => setSelectedRange('year')}
            className={`px-2.5 py-1 text-sm transition-colors rounded-[16px] ${
              selectedRange === 'year'
                ? 'bg-[#FFE600] text-black'
                : 'text-[#94A3B8] hover:text-gray-600'
            }`}
          >
            This Year
          </button>
        </div>
      </div>

      {/* Removed w-[calc(100%+20px)] and -mr-5 to avoid pushing the chart out of view */}
      <div className="h-[240px] w-full mt-1 px-3">
        <Line 
          options={options}
          data={data}
        />
      </div>
    </div>
  );
}
