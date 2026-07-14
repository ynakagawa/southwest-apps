import { FormEvent, useEffect, useState } from 'react';

type Accomplished = 'yes' | 'no' | '';

interface FormState {
  goal: string;
  accomplished: Accomplished;
  comments: string;
}

const initialState: FormState = {
  goal: '',
  accomplished: '',
  comments: '',
};

const GOAL_OPTIONS = [
  'Book a flight',
  'Check in for a flight',
  'Manage an existing trip',
  'Check flight status',
  'Look up Rapid Rewards points',
  'Something else',
];

const CONTACT_URL = 'https://www.southwest.com/contact-us';
const SUBMISSION_POLICY_URL = 'https://www.southwest.com/legal/website-terms-conditions.html';

function HeartLogo() {
  return (
    <svg viewBox="0 0 32 28" width="28" height="24" aria-hidden="true">
      <path
        d="M16 28C7 21 0 15.5 0 9a9 9 0 0 1 16-5.6A9 9 0 0 1 32 9c0 6.5-7 12-16 19Z"
        fill="#e31837"
      />
      <path d="M16 28C21.5 23.7 26 20 28.7 16H3.3C6 20 10.5 23.7 16 28Z" fill="#f9a01b" />
    </svg>
  );
}

export interface FeedbackProps {
  /** Called instead of the built-in "thanks" stub, if the host page wants to handle the submission itself (e.g. send it to a real endpoint). */
  onSubmit?: (form: FormState) => void;
}

export default function Feedback({ onSubmit }: FeedbackProps) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>(initialState);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    if (open) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleClose() {
    setOpen(false);
    setSubmitted(false);
    setForm(initialState);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (onSubmit) {
      onSubmit(form);
    } else {
      // eslint-disable-next-line no-console
      console.log('[sw-feedback] submitted (no onSubmit handler wired up):', form);
    }
    setSubmitted(true);
  }

  return (
    <div className="sw-fb">
      <button
        type="button"
        className="sw-fb__tab"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        Feedback
      </button>

      {open && (
        <>
          <div className="sw-fb__backdrop" onClick={handleClose} />
          <div className="sw-fb__panel" role="dialog" aria-label="Feedback">
            <div className="sw-fb__header">
              <span className="sw-fb__logo">
                Southwest<HeartLogo />
              </span>
              <button
                type="button"
                className="sw-fb__close"
                aria-label="Close feedback"
                onClick={handleClose}
              >
                &times;
              </button>
            </div>

            <div className="sw-fb__body">
              {submitted ? (
                <div className="sw-fb__thanks">
                  <h3>Thanks for your feedback!</h3>
                  <p>We appreciate you helping us improve Southwest.com.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <label className="sw-fb__label" htmlFor="sw-fb-goal">
                    What was your goal for visiting Southwest.com today?
                  </label>
                  <select
                    id="sw-fb-goal"
                    value={form.goal}
                    onChange={(e) => update('goal', e.target.value)}
                  >
                    <option value="" />
                    {GOAL_OPTIONS.map((goal) => (
                      <option key={goal} value={goal}>
                        {goal}
                      </option>
                    ))}
                  </select>

                  <p className="sw-fb__label">Were you able to accomplish your goal?</p>
                  <div className="sw-fb__radio-group">
                    {(['yes', 'no'] as const).map((value) => (
                      <label key={value} className="sw-fb__radio">
                        <input
                          type="radio"
                          name="sw-fb-accomplished"
                          value={value}
                          checked={form.accomplished === value}
                          onChange={() => update('accomplished', value)}
                        />
                        {value === 'yes' ? 'Yes' : 'No'}
                      </label>
                    ))}
                  </div>

                  <p className="sw-fb__label">
                    Please provide any feedback or let us know how we can improve
                    Southwest.com.
                  </p>
                  <p className="sw-fb__hint">
                    Do not enter personal information. Review submission policies{' '}
                    <a href={SUBMISSION_POLICY_URL} target="_blank" rel="noopener noreferrer">
                      here
                    </a>
                    .
                  </p>
                  <textarea
                    rows={4}
                    value={form.comments}
                    onChange={(e) => update('comments', e.target.value)}
                  />

                  <p className="sw-fb__contact">
                    Have a specific question or need assistance?{' '}
                    <a href={CONTACT_URL} target="_blank" rel="noopener noreferrer">
                      Contact Us
                    </a>
                    .
                  </p>

                  <div className="sw-fb__actions">
                    <button type="submit" className="sw-fb__submit">
                      Send Feedback
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
