export default function Heatmap() {
  // 1) Generate past 52 weeks (364 days) data (grayscale, keep count for future coloring)
  const generateHeatmapData = () => {
    const data = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364); // 52 weeks ago (including start date)

    for (let w = 0; w < 52; w++) {
      for (let d = 0; d < 7; d++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + (w * 7) + d);
        if (date <= today) {
          data.push({
            date: date.toISOString().split("T")[0],
            count: Math.floor(Math.random() * 5),
            week: w,
            day: d,
          });
        }
      }
    }
    return data;
  };

  const data = generateHeatmapData();

  // 2) Left weekday labels (only show Mon / Wed / Fri)
  const weekDayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

  // 3) Colors (grayscale; keep intensity mapping but unified grayscale)
  const getCellClass = (count) => {
    if (count === 0) return "bg-gray-100";
    if (count === 1) return "bg-gray-200";
    if (count === 2) return "bg-gray-300";
    if (count === 3) return "bg-gray-400";
    return "bg-gray-500";
  };

  // 4) Generate top month labels: continuously display from start month to end month (including both), and calculate width by "week column span" each month occupies
  const generateMonthSpans = () => {
    const months = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);

    let currentMonth = startDate.getMonth();

    // First put the start month in (month appears from left end in figure 2)
    months.push({
      label: startDate.toLocaleDateString("en-US", { month: "short" }),
      span: 0,
    });

    for (let w = 0; w < 52; w++) {
      const weekStart = new Date(startDate);
      weekStart.setDate(startDate.getDate() + (w * 7));
      const m = weekStart.getMonth();

      if (m !== currentMonth) {
        // Month change, append new month label
        months.push({
          label: weekStart.toLocaleDateString("en-US", { month: "short" }),
          span: 0,
        });
        currentMonth = m;
      }
      months[months.length - 1].span += 1;
    }

    // If the last week spans to a new month (very low probability), the above loop has already handled it. Return directly here.
    return months;
  };

  const monthSpans = generateMonthSpans();

  // 5) Organize as 7 rows × 52 columns (column=week, row=weekday)
  const gridData = [];
  for (let day = 0; day < 7; day++) {
    const row = [];
    for (let week = 0; week < 52; week++) {
      const item = data.find((d) => d.week === week && d.day === day);
      row.push(item ? { date: item.date, count: item.count } : { date: "", count: 0 });
    }
    gridData.push(row);
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg h-full flex flex-col">
      {/* Heatmap content area */}
      <div className="p-3 pb-2 flex-1">
        <div className="flex gap-2 items-start">
          {/* Left weekday labels */}
          <div className="flex flex-col gap-1">
            <div className="h-4"></div>
            {weekDayLabels.map((d, i) => (
              <div key={i} className="h-3 flex items-center justify-end">
                <span className="text-xs text-gray-500 w-8 text-right leading-none">{d}</span>
              </div>
            ))}
          </div>

          {/* Right main body - scrollable content */}
          <div className="flex-1 overflow-hidden">
            {/* Top month labels */}
            <div className="flex gap-1 mb-2 min-w-max" id="heatmap-content">
              {monthSpans.map((m, i) => (
                <div
                  key={i}
                  className="text-xs text-gray-500"
                  style={{ width: `${m.span * 13}px` }}
                >
                  {m.label}
                </div>
              ))}
            </div>

            {/* Grid (7 rows × 52 columns) */}
            <div className="flex flex-col gap-1 min-w-max">
              {gridData.map((row, rIdx) => (
                <div key={rIdx} className="flex gap-1 h-3">
                  {row.map((cell, cIdx) => (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      title={cell.date ? `${cell.date}` : "No data"}
                      className={`w-3 h-3 rounded-sm ${getCellClass(cell.count)} hover:opacity-80`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollbar area - placed at red box position, controls scrolling of content above */}
      <div className="px-3 pb-3">
        <div 
          className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
          onScroll={(e) => {
            const heatmapContent = document.getElementById('heatmap-content');
            if (heatmapContent) {
              heatmapContent.scrollLeft = e.target.scrollLeft;
            }
          }}
        >
          <div className="h-2 min-w-max" style={{ width: '676px' }}></div>
        </div>
      </div>
    </div>
  );
}