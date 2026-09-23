# 08: Lead Capture & Contact Forms

Source PRD: `research/source-prds/prd-phase-08-lead-capture-contact-forms.md`

---

## Goal

Two-step lead capture form using SvelteKit form actions, superforms + Zod validation, exit-intent popup, attribution merge, and Supabase insert. No `react-hook-form`. No `shadcn/ui` Dialog (use shadcn-svelte or native SvelteKit overlay patterns).

---

## Installation

```bash
cd apps/web
pnpm add sveltekit-superforms zod
pnpm add bits-ui         # Svelte primitive for Dialog/Drawer
```

---

## Zod schema

```ts
// apps/web/src/lib/schemas/lead.ts
import { z } from 'zod';

export const step1Schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
});

export const step2Schema = z.object({
  message: z.string().min(10, 'Please provide a brief message').optional(),
  source: z.enum(['contact_form', 'popup', 'footer', 'hero']).default('contact_form'),
  referral_source: z.enum(['friend', 'search', 'social', 'event', 'other']).optional(),
  referral_name: z.string().optional(),  // conditional on referral_source === 'friend'
});

export const leadSchema = step1Schema.merge(step2Schema);
export type LeadInput = z.infer<typeof leadSchema>;
```

---

## Form action: +page.server.ts

```ts
// apps/web/src/routes/contact/+page.server.ts
import { superValidate, fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { leadSchema } from '$lib/schemas/lead';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const form = await superValidate(zod(leadSchema));
  return { form };
};

export const actions: Actions = {
  submit: async ({ request, locals }) => {
    const form = await superValidate(request, zod(leadSchema));
    if (!form.valid) return fail(400, { form });

    // Merge first-touch attribution (passed as hidden fields from client)
    const formData = await request.formData();
    const attribution = {
      utm_source: formData.get('utm_source') as string | null,
      utm_medium: formData.get('utm_medium') as string | null,
      utm_campaign: formData.get('utm_campaign') as string | null,
    };

    const { error } = await locals.supabase.from('leads').insert({
      ...form.data,
      ...Object.fromEntries(Object.entries(attribution).filter(([, v]) => v !== null)),
    });

    if (error) {
      console.error('[Lead capture error]', error);
      return fail(500, { form, error: 'Failed to save. Please try again.' });
    }

    // Trigger notification (Supabase triggers or Edge Function)
    // Optionally: await fetch('/api/notify-lead', { method: 'POST', ... })

    return { form, success: true };
  },
};
```

---

## Two-step form component

```svelte
<!-- apps/web/src/lib/components/LeadForm.svelte -->
<script lang="ts">
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { leadSchema } from '$lib/schemas/lead';
  import { getAttribution, clearAttribution } from '$lib/analytics/attribution';

  let { data, onSuccess } = $props<{ data: any; onSuccess?: () => void }>();

  let step = $state(1);
  const attribution = getAttribution();

  const { form, errors, enhance, submitting, message } = superForm(data.form, {
    validators: zodClient(leadSchema),
    onUpdated({ form }) {
      if (form.valid && form.message === 'success') {
        clearAttribution();
        step = 3; // Thank-you state
        onSuccess?.();
      }
    },
  });
</script>

<form method="POST" action="?/submit" use:enhance>
  <!-- Hidden attribution fields -->
  <input type="hidden" name="utm_source" value={attribution.utm_source ?? ''} />
  <input type="hidden" name="utm_medium" value={attribution.utm_medium ?? ''} />
  <input type="hidden" name="utm_campaign" value={attribution.utm_campaign ?? ''} />

  {#if step === 1}
    <h2>Get in Touch</h2>
    <label>
      Name
      <input bind:value={$form.name} name="name" type="text" required />
      {#if $errors.name}<span class="error">{$errors.name}</span>{/if}
    </label>
    <label>
      Email
      <input bind:value={$form.email} name="email" type="email" required />
      {#if $errors.email}<span class="error">{$errors.email}</span>{/if}
    </label>
    <button type="button" onclick={() => step = 2}>Next →</button>

  {:else if step === 2}
    <h2>Tell Us More</h2>
    <label>
      Message
      <textarea bind:value={$form.message} name="message" rows="4"></textarea>
    </label>
    <label>
      How did you hear about us?
      <select bind:value={$form.referral_source} name="referral_source">
        <option value="">Select...</option>
        <option value="friend">A friend</option>
        <option value="search">Search engine</option>
        <option value="social">Social media</option>
        <option value="event">Event</option>
        <option value="other">Other</option>
      </select>
    </label>
    {#if $form.referral_source === 'friend'}
      <label>
        Friend's name
        <input bind:value={$form.referral_name} name="referral_name" type="text" />
      </label>
    {/if}
    <input type="hidden" name="source" value="contact_form" />
    <button type="button" onclick={() => step = 1}>← Back</button>
    <button type="submit" disabled={$submitting}>
      {$submitting ? 'Sending...' : 'Send Message'}
    </button>

  {:else}
    <div class="thank-you">
      <h2>Thank you!</h2>
      <p>We'll be in touch shortly.</p>
    </div>
  {/if}
</form>
```

---

## Exit-intent popup

```svelte
<!-- apps/web/src/lib/components/LeadPopup.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';

  let { data } = $props();
  let open = $state(false);
  let dismissed = $state(false);

  onMount(() => {
    const alreadyDismissed = sessionStorage.getItem('lead_popup_dismissed');
    if (alreadyDismissed) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !dismissed) {
        open = true;
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  });

  function dismiss() {
    open = false;
    dismissed = true;
    sessionStorage.setItem('lead_popup_dismissed', '1');
  }
</script>

{#if open}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="popup-overlay" onclick={dismiss}>
    <div class="popup" onclick|stopPropagation>
      <button class="popup-close" onclick={dismiss} aria-label="Close">×</button>
      <LeadForm {data} onSuccess={dismiss} />
    </div>
  </div>
{/if}
```

---

## GA4 conversion event

After successful form submit, fire a `generate_lead` event:

```ts
// In the onUpdated callback of superForm, after success:
if (browser && window.gtag) {
  window.gtag('event', 'generate_lead', { method: 'contact_form' });
}
```

---

## Phase acceptance criteria

| ID | Criterion |
|---|---|
| 8.1 | Step 1 validates name + email before advancing to Step 2 |
| 8.2 | Form submission inserts a row in `public.leads` |
| 8.3 | Attribution fields (utm_*) populated from localStorage when present |
| 8.4 | Attribution cleared from localStorage after successful submit |
| 8.5 | `referral_name` field shown only when `referral_source === 'friend'` |
| 8.6 | Exit-intent popup fires on mouse-leave (not on mobile) |
| 8.7 | GA4 `generate_lead` event fires on success |
| 8.8 | Form accessible: labels, error messages announced to screen readers |
