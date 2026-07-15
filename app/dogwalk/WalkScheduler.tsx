'use client';

import { useState } from 'react';
import styles from './page.module.css';

const PHONE = '+13109025854';

const DAYS: [string, number][] = [
  ['MON', 1], ['TUE', 2], ['WED', 3], ['THU', 4], ['FRI', 5], ['SAT', 6], ['SUN', 0],
];

const TIMES: [string, number, number][] = [
  ['8:00 AM', 8, 0],
  ['10:00 AM', 10, 0],
  ['12:00 PM', 12, 0],
  ['2:00 PM', 14, 0],
  ['4:00 PM', 16, 0],
];

const SHIRTS = [
  { key: 'carthay', label: 'Carthay Square', src: '/dogwalk/CarthaySquare-print.png' },
  { key: 'wilshire', label: 'Wilshire Vista', src: '/dogwalk/WilshireVista-print.png' },
];

const SIZES = ['S', 'M', 'L', 'XL'];

const pad = (n: number) => String(n).padStart(2, '0');

/* Next calendar date whose weekday matches the pick (today counts). */
function nextDate(weekday: number) {
  const now = new Date();
  const diff = (weekday - now.getDay() + 7) % 7;
  const d = new Date(now);
  d.setDate(now.getDate() + diff);
  return d;
}

export default function WalkScheduler() {
  const [dayIdx, setDayIdx] = useState<number | null>(null);
  const [timeIdx, setTimeIdx] = useState<number | null>(null);
  const [weekly, setWeekly] = useState(true);
  const [shirt, setShirt] = useState<string | null>('carthay');
  const [size, setSize] = useState('M');
  const [dog, setDog] = useState('');

  const ready = dayIdx !== null && timeIdx !== null;
  const shirtLabel = SHIRTS.find((s) => s.key === shirt)?.label;

  const summary = ready
    ? `${DAYS[dayIdx][0]} · ${TIMES[timeIdx][0]}${weekly ? ' · WEEKLY' : ' · ONE-TIME'}${
        weekly && shirt ? ` · ${shirtLabel?.toUpperCase()} TEE (${size})` : ''
      }`
    : 'PICK A DAY AND TIME';

  function eventStamps() {
    const [, hh, mm] = TIMES[timeIdx!];
    const d = nextDate(DAYS[dayIdx!][1]);
    const base = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
    let eh = hh;
    let em = mm + 45;
    if (em >= 60) { eh += 1; em -= 60; }
    return { start: `${base}T${pad(hh)}${pad(mm)}00`, end: `${base}T${pad(eh)}${pad(em)}00` };
  }

  function bookingText() {
    return [
      `Booked via Dogwalk LA.`,
      weekly ? 'Repeats weekly.' : 'One-time walk.',
      weekly && shirt ? `Free tee: ${shirtLabel} (size ${size}).` : '',
    ].filter(Boolean).join(' ');
  }

  function calendarUrl() {
    const { start, end } = eventStamps();
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `Dog walk${dog ? ` — ${dog}` : ''}`,
      dates: `${start}/${end}`,
      ctz: 'America/Los_Angeles',
      details: bookingText(),
      add: 'jaidanmorello@gmail.com',
    });
    let url = `https://calendar.google.com/calendar/render?${params.toString()}`;
    if (weekly) url += `&recur=${encodeURIComponent('RRULE:FREQ=WEEKLY')}`;
    return url;
  }

  function smsUrl() {
    const body = encodeURIComponent(
      `Hi Jack — I'd like a dog walk${dog ? ` for ${dog}` : ''} on ${DAYS[dayIdx!][0]} at ${TIMES[timeIdx!][0]}${
        weekly ? ', weekly' : ''
      }.${weekly && shirt ? ` Free tee: ${shirtLabel}, size ${size}.` : ''}`
    );
    return `sms:${PHONE}?&body=${body}`;
  }

  return (
    <section className={styles.scheduler} id="schedule">
      <div className={styles.schedHead}>
        <span className={styles.label}>02 — SCHEDULE A WALK</span>
        <h2 className={styles.schedTitle}>Pick a day. Pick a time.</h2>
      </div>

      <div className={styles.step}>
        <span className={styles.stepLabel}>Day</span>
        <div className={styles.pills}>
          {DAYS.map(([lbl], i) => (
            <button
              key={lbl}
              type="button"
              className={`${styles.pill} ${dayIdx === i ? styles.pillOn : ''}`}
              onClick={() => setDayIdx(i)}
            >
              {lbl}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.step}>
        <span className={styles.stepLabel}>Time</span>
        <div className={styles.pills}>
          {TIMES.map(([lbl], i) => (
            <button
              key={lbl}
              type="button"
              className={`${styles.pill} ${timeIdx === i ? styles.pillOn : ''}`}
              onClick={() => setTimeIdx(i)}
            >
              {lbl}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.step}>
        <span className={styles.stepLabel}>Frequency</span>
        <div className={styles.pills}>
          <button
            type="button"
            className={`${styles.pill} ${weekly ? styles.pillOn : ''}`}
            onClick={() => setWeekly(true)}
          >
            WEEKLY · FREE TEE
          </button>
          <button
            type="button"
            className={`${styles.pill} ${!weekly ? styles.pillOn : ''}`}
            onClick={() => setWeekly(false)}
          >
            ONE-TIME
          </button>
        </div>
      </div>

      {weekly && (
        <div className={styles.step}>
          <span className={styles.stepLabel}>Your free tee</span>
          <div className={styles.shirtRow}>
            {SHIRTS.map((s) => (
              <button
                key={s.key}
                type="button"
                className={`${styles.shirtCard} ${shirt === s.key ? styles.shirtOn : ''}`}
                onClick={() => setShirt(s.key)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} alt={s.label} className={styles.shirtArt} />
                <span className={styles.shirtName}>{s.label}</span>
              </button>
            ))}
          </div>
          <div className={styles.pills}>
            {SIZES.map((sz) => (
              <button
                key={sz}
                type="button"
                className={`${styles.pill} ${size === sz ? styles.pillOn : ''}`}
                onClick={() => setSize(sz)}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.step}>
        <span className={styles.stepLabel}>Dog's name (optional)</span>
        <input
          className={styles.input}
          value={dog}
          onChange={(e) => setDog(e.target.value)}
          placeholder="Rex"
          maxLength={40}
        />
      </div>

      <p className={styles.summary}>{summary}</p>

      <div className={styles.ctaRow}>
        <a
          className={`${styles.cta} ${!ready ? styles.ctaOff : ''}`}
          href={ready ? calendarUrl() : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!ready}
        >
          Add to Google Calendar
        </a>
        <a
          className={`${styles.ctaGhost} ${!ready ? styles.ctaOff : ''}`}
          href={ready ? smsUrl() : undefined}
          aria-disabled={!ready}
        >
          Text Jack instead
        </a>
      </div>
      <p className={styles.finePrint}>
        Saving the calendar invite emails Jack and drops the walk on his schedule. No Google account? Use the text.
      </p>
    </section>
  );
}
