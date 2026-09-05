# Forms & Validation (extended): research notes

**Retrieved:** 2026-04-25
**For guide:** `guides/14-forms-and-validation.md`

## Sources

From `cursor-subagent-research-combined.md` (Forms & Schema Validation, ~line 808):

- [React Hook Form](https://react-hook-form.com/)
- [TanStack Form](https://tanstack.com/form)
- [Zod](https://zod.dev/)
- [Valibot](https://valibot.dev/)
- [Conform](https://conform.guide/)
- [Formbricks](https://formbricks.com/)

## Cross-references in this Stinger

- `guides/06-forms.md`: canonical RHF + Zod stack and React 19 Server Action forms.
- `research/2026-04-24-forms-rhf-zod.md`: original digest of the default stack.
- `research/2026-04-24-react-19-actions-hooks.md`: `useActionState`, `useOptimistic`, `useFormStatus`.

## Adjacent specs / docs

- [Standard Schema spec](https://standardschema.dev/): the cross-validator interface that Zod 3.24+ and Valibot 1.0+ implement; lets RHF / TanStack Form / Conform accept either with one resolver.
- [Conform Zod integration](https://conform.guide/integration/zod): `parseWithZod` server-side, `onValidate` client-side.
- [React Hook Form resolvers](https://github.com/react-hook-form/resolvers): official adapter hub (Zod, Valibot, Yup, Joi, ArkType).

## Notes

The choice tree narrows quickly. The default (RHF + Zod) only loses to deviations in three contexts: cross-framework (TanStack Form), bundle-budget pressure (Valibot), and progressive-enhancement requirements (Conform). Formbricks belongs in this catalog only as the "don't author, embed" option for in-app surveys.

No new web_search_exa expansions needed: the source URLs in the research doc cover the canonical references for each library.
