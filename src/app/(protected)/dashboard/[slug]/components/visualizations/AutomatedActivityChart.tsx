'use client';

import React from 'react';
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
    padding: {
      left: 8,
      right: 8
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

        if (!tooltipEl) {
          tooltipEl = document.createElement('div');
          tooltipEl.id = 'chartjs-tooltip';
          tooltipEl.innerHTML = '<div></div>';
          document.body.appendChild(tooltipEl);
        }

        const tooltipModel = context.tooltip;
        if (tooltipModel.opacity === 0) {
          tooltipEl.style.opacity = '0';
          return;
        }

        if (tooltipModel.body) {
          const value = tooltipModel.dataPoints[0].raw as number;
          const innerHtml = `
            <div class="px-3 py-2 bg-black rounded-md shadow-lg">
              <span class="text-white text-sm font-medium">${value}K</span>
            </div>
          `;
          tooltipEl.innerHTML = innerHtml;
        }

        const position = context.chart.canvas.getBoundingClientRect();
        tooltipEl.style.opacity = '1';
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX - 40 + 'px';
        tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY - 45 + 'px';
        tooltipEl.style.pointerEvents = 'none';
      }
    }
  },
  scales: {
    y: {
      display: false,
      beginAtZero: true,
      grid: {
        display: false
      },
      border: {
        display: false
      }
    },
    x: {
      grid: {
        display: false
      },
      border: {
        display: false
      },
      ticks: {
        color: 'rgb(156, 163, 175)',
        font: {
          size: 12,
        },
        padding: 4,
        maxRotation: 0
      },
    },
  },
  elements: {
    line: {
      tension: 0.4,
      borderWidth: 2,
      borderColor: 'rgb(168, 85, 247)',
    },
    point: {
      radius: 0,
      hitRadius: 8,
      hoverRadius: 6,
      hoverBorderWidth: 3,
      backgroundColor: '#fff',
      borderColor: 'rgb(168, 85, 247)',
      hoverBackgroundColor: '#fff',
      hoverBorderColor: 'rgb(168, 85, 247)',
    },
  },
  hover: {
    mode: 'index',
    intersect: false,
  },
};

const data = {
  labels: ['1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM'],
  datasets: [
    {
      fill: {
        target: 'origin',
        above: 'rgba(168, 85, 247, 0.1)',
      },
      data: [110, 95, 87, 125.2, 75, 98, 110],
      borderColor: 'rgb(168, 85, 247)',
      tension: 0.4,
    },
  ],
};

export function AutomatedActivityChart() {
  return (
    <div className="h-[180px] w-full">
      <Line options={options} data={data} />
    </div>
  );
}
