import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Box, Paper, Typography, Chip, Tooltip } from '@mui/material';
import { format, addDays, startOfDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import { TSelectionState } from '@/types';

type TBookingTimeFrame = {
  currentDate: string;
  weeklySchedule: Record<string, string[]>;
  setSelection: (value: TSelectionState) => void;
  selection: TSelectionState;
};

const TIME_START = 6;
const TIME_END = 22;
const SLOT_MINS = 30;
const TOTAL_SLOTS = (TIME_END - TIME_START) * 2;
const DAY_NAMES = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

function slotLabel(idx: number): string {
  const totalMins = TIME_START * 60 + idx * SLOT_MINS;
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function buildUnavailableMap(
  weeklySchedule: Record<string, string[]>,
): Record<string, Set<number>> {
  const map: Record<string, Set<number>> = {};
  for (const [dateKey, slots] of Object.entries(weeklySchedule)) {
    map[dateKey] = new Set();
    for (const slot of slots) {
      const [start, end] = slot.split(' - ');
      const toIdx = (t: string) => {
        const [h, m] = t.split(':').map(Number);
        return (h - TIME_START) * 2 + (m >= 30 ? 1 : 0);
      };
      for (let i = toIdx(start); i < toIdx(end); i++) {
        if (i >= 0 && i < TOTAL_SLOTS) map[dateKey].add(i);
      }
    }
  }
  return map;
}

const BookingTimeFrame: FC<TBookingTimeFrame> = ({
  currentDate,
  weeklySchedule,
  setSelection,
  selection,
}) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const dragging = useRef(false);
  const dragDate = useRef<string | null>(null);
  const dragStart = useRef<number>(-1);
  const dragEnd = useRef<number>(-1);
  const [liveSelection, setLiveSelection] = useState<TSelectionState>(null);

  const unavailableMap = buildUnavailableMap(weeklySchedule);

  const days = Array.from({ length: 7 }, (_, i) => startOfDay(addDays(currentDate, i)));

  const todayKey = format(startOfDay(new Date()), 'yyyy-MM-dd');

  const isUnavailable = (dateKey: string, slot: number) =>
    unavailableMap[dateKey]?.has(slot) ?? false;

  const rangeHasUnavailable = (dateKey: string, from: number, to: number) => {
    for (let i = from; i <= to; i++) {
      if (isUnavailable(dateKey, i)) return true;
    }
    return false;
  };

  const handleMouseDown = useCallback((dateKey: string, slot: number) => {
    if (isUnavailable(dateKey, slot)) return;
    dragging.current = true;
    dragDate.current = dateKey;
    dragStart.current = slot;
    dragEnd.current = slot;
    setLiveSelection({ dateKey, startSlot: slot, endSlot: slot });
    setSelection(null);
    setErrorMsg(null);
  }, []);

  const handleMouseEnter = useCallback((dateKey: string, slot: number) => {
    if (!dragging.current || dragDate.current !== dateKey) return;
    dragEnd.current = slot;
    setLiveSelection({
      dateKey,
      startSlot: Math.min(dragStart.current, slot),
      endSlot: Math.max(dragStart.current, slot),
    });
  }, []);

  useEffect(() => {
    const onMouseUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      const from = Math.min(dragStart.current, dragEnd.current);
      const to = Math.max(dragStart.current, dragEnd.current);
      const key = dragDate.current!;

      if (rangeHasUnavailable(key, from, to)) {
        setLiveSelection(null);
        setErrorMsg('Bạn chọn khung thời gian bị đè lên sân đã đặt, vui lòng chọn lại');
        return;
      }
      setSelection({ dateKey: key, startSlot: from, endSlot: to });
      setLiveSelection(null);
    };
    window.addEventListener('mouseup', onMouseUp);
    return () => window.removeEventListener('mouseup', onMouseUp);
  }, []);

  const getSlotBg = (dateKey: string, slot: number): string => {
    const live = liveSelection;
    const sel = selection;

    // Live dragging
    if (live && live.dateKey === dateKey && slot >= live.startSlot && slot <= live.endSlot)
      return '#dbeafe'; // blue-200

    // Confirmed selection
    if (sel && sel.dateKey === dateKey && slot >= sel.startSlot && slot <= sel.endSlot)
      return '#bfdbfe'; // blue-400

    // Unavailable
    if (isUnavailable(dateKey, slot)) return '#fef2f2'; // red-50

    return '#ffffff';
  };

  const getSlotBorder = (dateKey: string, slot: number): string => {
    const sel = selection;
    if (sel && sel.dateKey === dateKey && slot >= sel.startSlot && slot <= sel.endSlot)
      return '1px solid #a9c9ff';
    if (isUnavailable(dateKey, slot)) return '1px solid #fecaca';
    return '1px solid #f1f5f9';
  };

  return (
    <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden', userSelect: 'none' }}>
      {/* Legend */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          px: 2.5,
          py: 1.5,
          borderBottom: '1px solid #e2e8f0',
          bgcolor: '#fafafa',
        }}
      >
        {[
          { color: '#ffffff', border: '#cbd5e1', label: 'Khả dụng' },
          { color: '#fef2f2', border: '#fca5a5', label: 'Đã được đặt' },
          { color: '#3b82f6', border: '#2563eb', label: 'Được chọn' },
        ].map(({ color, border, label }) => (
          <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box
              sx={{
                width: 14,
                height: 14,
                borderRadius: 0.75,
                bgcolor: color,
                border: `1.5px solid ${border}`,
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Scrollable grid */}
      <Box sx={{ overflowX: 'auto' }}>
        <Box sx={{ minWidth: 960 }}>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              borderBottom: '2px solid #e2e8f0',
              bgcolor: '#fff',
              position: 'sticky',
              top: 0,
              zIndex: 1,
            }}
          >
            <Box sx={{ width: 90, minWidth: 90, p: 1, borderRight: '1px solid #e2e8f0' }}>
              <Typography
                variant="caption"
                sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', fontSize: 10 }}
              >
                Ngày / giờ
              </Typography>
            </Box>
            {Array.from({ length: TOTAL_SLOTS }, (_, i) => i)
              .filter((i) => i % 2 === 0)
              .map((i) => (
                <Box
                  key={i}
                  sx={{ flex: 2, textAlign: 'center', py: 1, borderRight: '1px solid #e2e8f0' }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: '#64748b', fontWeight: 600, fontSize: 11 }}
                  >
                    {slotLabel(i)}
                  </Typography>
                </Box>
              ))}
          </Box>

          {/* Rows */}
          {days.map((day) => {
            const key = format(day, 'yyyy-MM-dd');
            const isToday = key === todayKey;
            return (
              <Box
                key={key}
                sx={{
                  display: 'flex',
                  borderBottom: '1px solid #e2e8f0',
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                {/* Date label */}
                <Box
                  sx={{
                    width: 90,
                    minWidth: 90,
                    p: 1,
                    borderRight: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: '#475569',
                      textTransform: 'uppercase',
                      fontSize: 10,
                      letterSpacing: '0.05em',
                    }}
                  >
                    {DAY_NAMES[day.getDay()]}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: isToday ? '#2563eb' : '#1e293b',
                      fontWeight: isToday ? 700 : 400,
                      fontSize: 13,
                    }}
                  >
                    {format(day, 'd MMM', { locale: vi })}
                  </Typography>
                </Box>

                {/* Slots */}
                <Box sx={{ flex: 1, display: 'flex', minHeight: 52 }}>
                  {Array.from({ length: TOTAL_SLOTS }, (_, i) => i).map((slot) => {
                    const unavail = isUnavailable(key, slot);
                    return (
                      <Tooltip
                        key={slot}
                        title={unavail ? 'Đã được đặt' : ''}
                        placement="top"
                        arrow
                        disableHoverListener={!unavail}
                      >
                        <Box
                          onMouseDown={() => handleMouseDown(key, slot)}
                          onMouseEnter={() => handleMouseEnter(key, slot)}
                          sx={{
                            flex: 1,
                            bgcolor: getSlotBg(key, slot),
                            border: getSlotBorder(key, slot),
                            cursor: unavail ? 'not-allowed' : 'crosshair',
                            transition: 'background 0.1s',
                            minHeight: 52,
                            '&:hover': !unavail
                              ? { bgcolor: liveSelection || selection ? undefined : '#eff6ff' }
                              : {},
                          }}
                        />
                      </Tooltip>
                    );
                  })}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Result */}
      <Box sx={{ px: 2.5, py: 2, borderTop: '2px solid #e2e8f0', bgcolor: '#f8fafc' }}>
        <Typography
          variant="caption"
          sx={{
            color: '#94a3b8',
            fontWeight: 700,
            textTransform: 'uppercase',
            fontSize: 10,
            letterSpacing: '0.05em',
            display: 'block',
            mb: 1,
          }}
        >
          Khung giờ được chọn
        </Typography>
        {errorMsg ? (
          <Typography variant="body2" sx={{ color: '#ef4444', fontWeight: 600 }}>
            ⚠ {errorMsg}
          </Typography>
        ) : selection ? (
          <Chip
            label={`${format(new Date(selection.dateKey), 'EEE, d MMM', { locale: vi })}  ·  ${slotLabel(selection.startSlot)} – ${slotLabel(selection.endSlot + 1)}`}
            sx={{
              bgcolor: '#eff6ff',
              border: '1.5px solid #3b82f6',
              color: '#1d4ed8',
              fontWeight: 700,
              fontSize: 14,
              height: 36,
              borderRadius: 2,
            }}
          />
        ) : (
          <Typography variant="body2" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
            Kéo thả để chọn khung thời gian phù hợp
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default BookingTimeFrame;
