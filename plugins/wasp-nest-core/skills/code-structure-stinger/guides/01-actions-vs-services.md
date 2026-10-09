# Actions versus services

Grounded in `../references/research/distilled.md`, which cites the archived
sources in `../references/research/raw/`.

## The two layers

| Layer | Owns | Never owns |
|---|---|---|
| Actions (orchestration) | business rules, state transitions, auth and ownership checks, failure classification, retries as policy, user-facing errors | provider SDK detail, command mechanics |
| Services (shared mechanics) | provider and SDK interactions, command execution detail, health checks, retries as mechanics, structured results | domain state, database rows uninvited, auth decisions |

Rule of thumb: "what this product flow means" stays in actions; "how to do
this operation reliably" moves to a service.

## Capability blocks, not monoliths

Design service functions as composable blocks so each caller picks what it
needs:

```ts
createManagedSandbox(...)
prepareRepo(...)
detectPackageManager(...)
installDependencies(...)
runBuildCommand(...)
startSandboxRuntime(...)
```

Each function: explicit parameters only, structured outputs
(`{ ready, previewUrl, proxyPort }`), explicit failure (structured result,
never a swallowed error), no hidden global state.

## Extraction decision

Extract when the same operational chunk appears in 2 or more callers. Do not
extract logic with one caller, however repetitive it looks inside itself:
over-abstraction is an anti-pattern, not a virtue. Write the flow in action
code first; repetition across callers is the trigger, repetition within one
caller is not.

## Migration checklist

1. Write the flow in action code first so the behavior is unambiguous.
2. Mark the operational chunks repeated across callers.
3. Extract only repeated, non-domain chunks to the service.
4. Replace one caller, verify (typecheck, lint, flow still works), then
   replace the remaining callers.
5. Keep domain policy in actions: auth, status transitions, error
   classification.
6. Re-verify every affected flow before calling the migration done.

## Anti-patterns

| Anti-pattern | The tell |
|---|---|
| God service | one huge function hides all control flow |
| Leaky service | the service mutates database tables directly |
| Inconsistent API | sibling functions take different argument styles and error semantics |
| Over-abstraction | a service for a single caller |

## Worked example (email mechanic)

```ts
// emailService.ts - shared mechanics
export async function sendWelcomeEmail(params: { to: string; name: string }) {
  const html = `<h1>Welcome ${params.name}</h1>`;
  await emailProvider.send(params.to, "Welcome", html);
}

// userSignup.ts - orchestration owns WHEN
if (user.marketingOptIn) {
  await sendWelcomeEmail({ to: user.email, name: user.name });
}

// adminInvite.ts - different business rule, same mechanic
await sendWelcomeEmail({ to: invitee.email, name: invitee.name });
```

## Mental model

New feature: write it in the action. See the same operation in a second
caller: extract that operation to the service, migrate one caller at a time,
verify between each. No second caller yet: leave it in the action.
