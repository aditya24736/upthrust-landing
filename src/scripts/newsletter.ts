// Newsletter form: validate -> POST to Netlify Forms -> success state -> GTM `form_submit` event.
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

const form = document.querySelector<HTMLFormElement>('[data-news]');

if (form) {
  const fields = form.querySelector<HTMLElement>('[data-news-fields]')!;
  const success = form.querySelector<HTMLElement>('[data-news-success]')!;
  const email = form.querySelector<HTMLInputElement>('#email')!;
  const consent = form.querySelector<HTMLInputElement>('#consent')!;
  const errEmail = form.querySelector<HTMLElement>('[data-err-email]')!;
  const errConsent = form.querySelector<HTMLElement>('[data-err-consent]')!;
  const errServer = form.querySelector<HTMLElement>('[data-err-server]')!;
  const button = form.querySelector<HTMLButtonElement>('.news__submit')!;

  const setError = (input: HTMLInputElement, msg: HTMLElement, bad: boolean) => {
    msg.hidden = !bad;
    input.setAttribute('aria-invalid', String(bad));
  };

  // Clear a field's error as soon as it becomes valid.
  email.addEventListener('input', () => email.validity.valid && setError(email, errEmail, false));
  consent.addEventListener('change', () => consent.checked && setError(consent, errConsent, false));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errServer.hidden = true;

    const emailBad = !email.validity.valid || !/^\S+@\S+\.\S+$/.test(email.value.trim());
    const consentBad = !consent.checked;
    setError(email, errEmail, emailBad);
    setError(consent, errConsent, consentBad);
    if (emailBad || consentBad) {
      (emailBad ? email : consent).focus();
      return;
    }

    button.disabled = true;
    button.textContent = 'Sending…';

    try {
      const body = new URLSearchParams(new FormData(form) as unknown as Record<string, string>).toString();
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // Conversion event for Google Tag Manager — only after a successful submission.
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'form_submit',
        form_name: 'newsletter',
        form_location: 'footer',
      });

      fields.hidden = true;
      success.hidden = false;
      success.focus();
    } catch (err) {
      console.error('Newsletter submit failed', err);
      errServer.hidden = false;
      button.disabled = false;
      button.textContent = button.getAttribute('data-label') || 'Submit';
    }
  });

  button.setAttribute('data-label', button.textContent || 'Submit');
}

export {};
