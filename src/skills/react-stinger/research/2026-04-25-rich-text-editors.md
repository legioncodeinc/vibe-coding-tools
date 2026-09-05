# Rich Text & Block Editors: research notes

**Retrieved:** 2026-04-25
**For guide:** `guides/15-rich-text-editors.md`

## Sources

From `cursor-subagent-research-combined.md` (Rich Text & Block Editors, ~line 736):

- [TipTap](https://tiptap.dev)
- [BlockNote](https://www.blocknotejs.org/)
- [Lexical](https://lexical.dev/)
- [Plate](https://platejs.org/)
- [ProseMirror](https://prosemirror.net/)
- [Novel](https://novel.sh/)
- [Yoopta-Editor](https://yoopta.dev/)

## Adjacent references

- TipTap Cloud (commercial collab + storage + AI): https://tiptap.dev/cloud
- Lexical's Meta usage (FB / IG / Threads composers): linked from lexical.dev homepage.
- Yjs (CRDT engine many of these editors use for collaboration): https://docs.yjs.dev/ (already cited in `realtime-infra` section of source doc).

## Notes

Decision axes that came out of the doc and are reflected in the guide:
1. Notion-likeness vs blank-canvas customization
2. Collaborative vs solo
3. AI completions out of the box vs build-your-own
4. A11y floor (Lexical leads)
5. Mobile / RN story (Lexical leads)

No new web_search_exa expansions performed. The source URLs in the research doc are the canonical references and the guide cites them directly. Realtime collab infra (Yjs / Liveblocks / PartyKit) is handed off to `devops-worker-bee` rather than expanded here.
