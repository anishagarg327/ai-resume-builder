import { MONTHS, YEARS } from '../../constants/dates'

export function DatePickerModal({
  activeDatePicker,
  setActiveDatePicker,
  startMonth,
  setStartMonth,
  startYear,
  setStartYear,
  endMonth,
  setEndMonth,
  endYear,
  setEndYear,
  isPresent,
  setIsPresent,
  isYearOnly,
  setIsYearOnly,
  applySelectedDate,
  clearSelectedDate,
  isInvalidDateRange,
}) {
  if (!activeDatePicker) return null

  return (
    <div className="date-picker-modal">
      <div className="date-picker-content">
        <h4>📅 Select Dates / Duration</h4>

        <div className="date-picker-toggle">
          <label>
            <input
              type="checkbox"
              checked={isYearOnly}
              onChange={(e) => setIsYearOnly(e.target.checked)}
            />
            Year Only (e.g. for Education)
          </label>
        </div>

        <div className="date-picker-row">
          <div className="date-picker-col">
            <label>Start Date</label>
            <div className="date-picker-selects">
              {!isYearOnly && (
                <select value={startMonth} onChange={(e) => setStartMonth(e.target.value)}>
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              )}
              <select value={startYear} onChange={(e) => setStartYear(e.target.value)}>
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="date-picker-col">
            <label>End Date</label>
            {!isPresent ? (
              <div className="date-picker-selects">
                {!isYearOnly && (
                  <select value={endMonth} onChange={(e) => setEndMonth(e.target.value)}>
                    {MONTHS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                )}
                <select value={endYear} onChange={(e) => setEndYear(e.target.value)}>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="present-label">Present</div>
            )}
          </div>
        </div>

        {!isYearOnly && (
          <div className="date-picker-present-container">
            <label className="present-checkbox">
              <input
                type="checkbox"
                checked={isPresent}
                onChange={(e) => setIsPresent(e.target.checked)}
              />
              I currently work/study here (Present)
            </label>
          </div>
        )}

        {isInvalidDateRange && (
          <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '-0.5rem', marginBottom: '1rem', textAlign: 'center', fontWeight: '500' }}>
            ⚠️ Start date cannot be after the end date.
          </div>
        )}

        <div className="date-picker-actions">
          <div style={{ marginRight: 'auto' }}>
            <button
              type="button"
              className="ghost-btn"
              style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)', padding: '0.55rem 1rem' }}
              onClick={clearSelectedDate}
            >
              Clear
            </button>
          </div>
          <button
            type="button"
            className="ghost-btn"
            onClick={() => setActiveDatePicker(null)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="primary-btn"
            onClick={applySelectedDate}
            disabled={isInvalidDateRange}
            style={{
              opacity: isInvalidDateRange ? 0.4 : 1,
              cursor: isInvalidDateRange ? 'not-allowed' : 'pointer',
            }}
          >
            Set Date
          </button>
        </div>
      </div>
    </div>
  )
}
