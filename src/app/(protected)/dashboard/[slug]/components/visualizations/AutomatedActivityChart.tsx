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
  ChartData,
  ChartOptions,
  ScriptableContext,
} from 'chart.js';
import { ChevronRight } from 'lucide-react';

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
    padding: 0
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
          tooltipEl.style.transition = 'all 0.15s ease-in-out';
          tooltipEl.style.pointerEvents = 'none';
          document.body.appendChild(tooltipEl);
        }
        // Create dashed line element if it doesn't exist
        if (!dashedLineEl) {
          dashedLineEl = document.createElement('div');
          dashedLineEl.id = 'chartjs-dashed-line';
          dashedLineEl.style.transition = 'all 0.15s ease-in-out';
          dashedLineEl.style.borderLeft = '1.5px dashed rgba(74, 144, 226, 0.5)';
          dashedLineEl.style.pointerEvents = 'none';
          document.body.appendChild(dashedLineEl);
        }

        const tooltipModel = context.tooltip;
        
        // Handle hiding both elements
        if (tooltipModel.opacity === 0) {
          tooltipEl.style.opacity = '0';
          tooltipEl.style.transform = 'translateY(4px)';
          if (dashedLineEl) {
            dashedLineEl.style.opacity = '0';
          }
          return;
        }

        const position = context.chart.canvas.getBoundingClientRect();

        if (tooltipModel.body) {
          const value = tooltipModel.dataPoints[0].raw as number;
          const formattedValue = Math.round(value).toString();
          const dataPoint = context.tooltip.dataPoints[0];
          const yPos = dataPoint.element.y;
          const yScale = context.chart.scales.y;
          const pointRadius = 4; 
          const lineHeight = yScale.bottom - (yPos + pointRadius * 2);

          // Calculate tooltip position
          const tooltipX = position.left + window.pageXOffset + tooltipModel.caretX;
          const tooltipY = position.top + window.pageYOffset + yPos - 16; // Reduced offset to be closer to the point

          const innerHtml = `
            <div class="tooltip-content" style="
              background: linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 100%);
              border: 1px solid rgba(74, 144, 226, 0.15);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(74, 144, 226, 0.08);
              backdrop-filter: blur(8px);
              border-radius: 12px;
              padding: 8px 12px;
              min-width: 80px;
              transform-origin: center bottom;
              position: relative;
              margin-bottom: 4px;
            ">
              <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 2px;
              ">
                <span style="
                  font-weight: 600;
                  font-size: 14px;
                  color: #1a1a1a;
                  font-family: var(--font-raleway), sans-serif;
                ">${formattedValue}k</span>
                <span style="
                  font-weight: 400;
                  font-size: 12px;
                  color: #8c92a0;
                  font-family: var(--font-raleway), sans-serif;
                ">automations</span>
              </div>
              <div style="
                position: absolute;
                bottom: -5px;
                left: 50%;
                transform: translateX(-50%) rotate(45deg);
                width: 10px;
                height: 10px;
                background: linear-gradient(135deg, transparent 50%, white 50%);
                border-right: 1px solid rgba(74, 144, 226, 0.15);
                border-bottom: 1px solid rgba(74, 144, 226, 0.15);
                z-index: -1;
              "></div>
            </div>
          `;

          tooltipEl.innerHTML = innerHtml;
          
          // Position tooltip and apply styles
          tooltipEl.style.position = 'absolute';
          tooltipEl.style.left = tooltipX + 'px';
          tooltipEl.style.top = tooltipY + 'px';
          tooltipEl.style.transform = 'translate(-50%, -100%)'; // Changed transform to ensure proper positioning above point
          tooltipEl.style.opacity = '1';
          
          // Update dashed line position and visibility
          dashedLineEl.style.position = 'absolute';
          dashedLineEl.style.left = tooltipX + 'px';
          dashedLineEl.style.top = (position.top + window.pageYOffset + yPos + pointRadius * 2) + 'px';
          dashedLineEl.style.height = `${lineHeight}px`;
          dashedLineEl.style.opacity = '1';
          dashedLineEl.style.transform = 'translateX(-50%)';
        }
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
      ticks: { display: false },
      beginAtZero: true,
      afterFit: (scale) => {
        scale.width = 0;
      }
    },
    x: {
      type: 'category',
      offset: false,
      grid: {
        display: false,
        drawTicks: false
      },
      border: {
        display: true,
        color: '#E2E8F0',
        width: 1
      },
      ticks: {
        color: '#94A3B8',
        font: {
          size: 11,
          family: 'var(--font-raleway), sans-serif',
          weight: 'normal'
        },
        padding: 8,
        maxRotation: 0,
        autoSkip: false,
        align: 'center',
        callback: function(value, index) {
          const timePoints = [1, 6, 12, 18, 22];
          if (timePoints.includes(index)) {
            const hour = index;
            const ampm = hour < 12 ? 'AM' : 'PM';
            const displayHour = hour === 0 ? '12' : hour > 12 ? `${hour-12}` : `${hour}`;
            return displayHour + (index === 22 ? 'PM' : ampm);
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
      borderColor: '#4A90E2',
      fill: true,
      capBezierPoints: true
    },
    point: {
      radius: 0,
      hitRadius: 5,
      hoverRadius: 3,
      borderWidth: 0,
      pointStyle: 'circle',
      rotation: 0
    }
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
        borderWidth: 2.5,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointHitRadius: 5,
        borderCapStyle: 'round',
        segment: {
          borderColor: () => '#4A90E2'
        }
      },
    ],
  };

  return (
    <div className='bg-white rounded-[16px] p-4 h-full max-w-[600px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow duration-200'>
      <div className='flex justify-between items-start mb-4'>
        <div className='space-y-2.5'>
          <div className='flex items-center gap-1.5 group cursor-pointer'>
            <h2 className='text-[15px] font-semibold leading-[22px] text-gray-800/90 tracking-[-0.2px] transition-colors group-hover:text-gray-900 font-sans'>
              Automated Activity
            </h2>
            <ChevronRight className='w-[14px] h-[14px] text-gray-400 transition-all duration-200 group-hover:text-gray-500 group-hover:translate-x-0.5' />
          </div>
          <div className='flex items-baseline gap-2.5'>
            <span className='text-[40px] font-bold leading-[44px] tracking-[-0.8px] text-gray-900 font-sans'>
              24
            </span>
            <span className='text-[15px] font-medium leading-[22px] tracking-[-0.1px] text-gray-500/90 font-sans'>
              automations
            </span>
          </div>
        </div>
        <div className='inline-flex items-center border border-gray-200 rounded-[20px] p-1 shadow-sm bg-gray-50/50'>
          <button 
            onClick={() => setSelectedRange('today')}
            className={`px-3 py-1.5 text-sm font-medium transition-all duration-200 rounded-[16px] ${
              selectedRange === 'today'
                ? 'bg-[#FFE600] text-black shadow-sm'
                : 'text-[#94A3B8] hover:text-gray-600 hover:bg-gray-100'
            }`}
          >
            Today
          </button>
          <button 
            onClick={() => setSelectedRange('week')}
            className={`px-3 py-1.5 text-sm font-medium transition-all duration-200 rounded-[16px] ${
              selectedRange === 'week'
                ? 'bg-[#FFE600] text-black shadow-sm'
                : 'text-[#94A3B8] hover:text-gray-600 hover:bg-gray-100'
            }`}
          >
            This Week
          </button>
          <button 
            onClick={() => setSelectedRange('year')}
            className={`px-3 py-1.5 text-sm font-medium transition-all duration-200 rounded-[16px] ${
              selectedRange === 'year'
                ? 'bg-[#FFE600] text-black shadow-sm'
                : 'text-[#94A3B8] hover:text-gray-600 hover:bg-gray-100'
            }`}
          >
            This Year
          </button>
        </div>
      </div>

      <div className='h-[180px] -mx-4 -mb-2 mt-2'>
        <div className='h-full w-full px-4 relative'>
          <div className='absolute inset-0 overflow-hidden'>
            <Line 
              options={{
                ...options,
                maintainAspectRatio: false,
                layout: {
                  padding: {
                    left: -0.5,
                    right: -0.5,
                    top: 0,
                    bottom: 4
                  }
                },
                scales: options?.scales ? {
                  ...options.scales,
                  x: {
                    ...options.scales.x,
                    min: 0,
                    max: 23,
                    offset: false,
                    grid: {
                      offset: false,
                      display: false,
                      drawTicks: false
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
                        family: 'var(--font-raleway), sans-serif',
                        weight: 'normal'
                      },
                      padding: 4,  
                      maxRotation: 0,
                      autoSkip: false,
                      align: 'center',
                      callback: function(value, index) {
                        const timePoints = [1, 6, 12, 18, 22];
                        if (timePoints.includes(index)) {
                          const hour = index;
                          const ampm = hour < 12 ? 'AM' : 'PM';
                          const displayHour = hour === 0 ? '12' : hour > 12 ? `${hour-12}` : `${hour}`;
                          return displayHour + (index === 22 ? 'PM' : ampm);
                        }
                        return '';
                      }
                    },
                    afterFit: function(axis) {
                      const chartWidth = axis.chart.width;
                      axis.paddingLeft = -0.5;
                      axis.paddingRight = -0.5;
                      axis.width = chartWidth + 1;
                      axis.left = 0;
                      axis.height = axis.height - 6;  
                    }
                  }
                } : {},
              }}
              data={{
                ...data,
                datasets: [{
                  ...data.datasets[0],
                  borderWidth: 2.5,
                  pointRadius: 0,
                  pointHoverRadius: 3,
                  pointHitRadius: 5,
                  tension: 0.4,
                  borderColor: '#4A90E2',
                  fill: true,
                  borderCapStyle: 'round',
                  clip: {
                    left: -0.5,
                    right: -0.5,
                    top: 0,
                    bottom: 0
                  },
                  backgroundColor: (context: ScriptableContext<'line'>) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return 'rgba(233, 244, 255, 0.85)';
                    
                    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                    gradient.addColorStop(0, 'rgba(74, 144, 226, 0.12)');
                    gradient.addColorStop(0.5, 'rgba(74, 144, 226, 0.05)');
                    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                    return gradient;
                  }
                }]
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
