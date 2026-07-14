import { FormEvent, useMemo, useState } from 'react';

type TripType = 'roundtrip' | 'oneway' | 'multicity';
type FareDisplay = 'dollars' | 'points' | 'both';

interface FormState {
  tripType: TripType;
  origin: string;
  destination: string;
  departDate: string;
  returnDate: string;
  passengers: number;
  promoCode: string;
  fareDisplay: FareDisplay;
  lowFareCalendar: boolean;
}

const initialState: FormState = {
  tripType: 'roundtrip',
  origin: 'OAK',
  destination: '',
  departDate: '',
  returnDate: '',
  passengers: 1,
  promoCode: '',
  fareDisplay: 'dollars',
  lowFareCalendar: false,
};

function toISODate(value: string): string {
  // <input type="date"> already gives YYYY-MM-DD.
  return value;
}

/** Best-effort mapping to the public southwest.com results-page query params. */
function buildSouthwestUrl(form: FormState): string {
  const params = new URLSearchParams({
    originationAirportCode: form.origin.trim().toUpperCase(),
    destinationAirportCode: form.destination.trim().toUpperCase(),
    departureDate: toISODate(form.departDate),
    tripType: form.tripType === 'multicity' ? 'multicity' : form.tripType,
    adultPassengersCount: String(form.passengers),
    fareType: form.fareDisplay === 'points' ? 'POINTS' : 'USD',
  });
  if (form.tripType === 'roundtrip' && form.returnDate) {
    params.set('returnDate', toISODate(form.returnDate));
  }
  if (form.promoCode.trim()) {
    params.set('promoCode', form.promoCode.trim());
  }
  return `https://www.southwest.com/air/booking/select.html?${params.toString()}`;
}

export interface FlightSearchProps {
  /** Called instead of navigating, if the host page wants to handle the result itself. */
  onSearch?: (url: string, form: FormState) => void;
}

export default function FlightSearch({ onSearch }: FlightSearchProps) {
  const [form, setForm] = useState<FormState>(initialState);

  const swapDisabled = form.tripType === 'multicity';

  const departDateLabel = useMemo(
    () => formatLongDate(form.departDate),
    [form.departDate],
  );
  const returnDateLabel = useMemo(
    () => formatLongDate(form.returnDate),
    [form.returnDate],
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function swapAirports() {
    if (swapDisabled) return;
    setForm((prev) => ({ ...prev, origin: prev.destination, destination: prev.origin }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const url = buildSouthwestUrl(form);
    if (onSearch) {
      onSearch(url, form);
    } else {
      window.open(url, '_blank', 'noopener');
    }
  }

  return (
    <div className="sw-fs">
      <form className="sw-fs__form" onSubmit={handleSubmit}>
        <p className="sw-fs__required">*Required fields</p>

        <div className="sw-fs__row">
          <div className="sw-fs__field">
            <label htmlFor="sw-trip-type">Trip type</label>
            <select
              id="sw-trip-type"
              value={form.tripType}
              onChange={(e) => update('tripType', e.target.value as TripType)}
            >
              <option value="roundtrip">Round-trip</option>
              <option value="oneway">One-way</option>
              <option value="multicity">Multi-city</option>
            </select>
          </div>
        </div>

        <div className="sw-fs__row sw-fs__row--airports">
          <div className="sw-fs__field">
            <label htmlFor="sw-origin">Depart*</label>
            <input
              id="sw-origin"
              required
              value={form.origin}
              onChange={(e) => update('origin', e.target.value)}
              placeholder="City or airport"
            />
          </div>

          <button
            type="button"
            className="sw-fs__swap"
            aria-label="Swap origin and destination"
            onClick={swapAirports}
            disabled={swapDisabled}
          >
            ⇄
          </button>

          <div className="sw-fs__field">
            <label htmlFor="sw-destination">Arrive*</label>
            <input
              id="sw-destination"
              required
              value={form.destination}
              onChange={(e) => update('destination', e.target.value)}
              placeholder="City or airport"
            />
          </div>
        </div>

        <div className="sw-fs__row sw-fs__row--dates">
          <div className="sw-fs__field">
            <label htmlFor="sw-depart-date">Depart date*</label>
            <input
              id="sw-depart-date"
              type="date"
              required
              value={form.departDate}
              onChange={(e) => update('departDate', e.target.value)}
            />
            {departDateLabel && <span className="sw-fs__date-hint">{departDateLabel}</span>}
          </div>

          {form.tripType === 'roundtrip' && (
            <div className="sw-fs__field">
              <label htmlFor="sw-return-date">Return date*</label>
              <input
                id="sw-return-date"
                type="date"
                required
                value={form.returnDate}
                onChange={(e) => update('returnDate', e.target.value)}
              />
              {returnDateLabel && <span className="sw-fs__date-hint">{returnDateLabel}</span>}
            </div>
          )}

          <div className="sw-fs__field">
            <label htmlFor="sw-passengers">Passengers*</label>
            <input
              id="sw-passengers"
              type="number"
              min={1}
              max={8}
              required
              value={form.passengers}
              onChange={(e) => update('passengers', Number(e.target.value))}
            />
          </div>
        </div>

        <div className="sw-fs__row sw-fs__row--promo">
          <div className="sw-fs__field">
            <label htmlFor="sw-promo">Promo code</label>
            <input
              id="sw-promo"
              value={form.promoCode}
              onChange={(e) => update('promoCode', e.target.value)}
            />
          </div>

          <fieldset className="sw-fs__fares">
            <legend>Show fares in</legend>
            {(
              [
                ['dollars', '$'],
                ['points', 'Points'],
                ['both', '$ + Points'],
              ] as [FareDisplay, string][]
            ).map(([value, label]) => (
              <label key={value} className="sw-fs__radio">
                <input
                  type="radio"
                  name="sw-fare-display"
                  value={value}
                  checked={form.fareDisplay === value}
                  onChange={() => update('fareDisplay', value)}
                />
                {label}
              </label>
            ))}
          </fieldset>
        </div>

        <label className="sw-fs__checkbox">
          <input
            type="checkbox"
            checked={form.lowFareCalendar}
            onChange={(e) => update('lowFareCalendar', e.target.checked)}
          />
          Search with low fare calendar
        </label>

        <button type="submit" className="sw-fs__submit">
          Search flights
        </button>
      </form>
    </div>
  );
}

function formatLongDate(value: string): string {
  if (!value) return '';
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return '';
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
