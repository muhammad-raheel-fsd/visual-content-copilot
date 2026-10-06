---
kind: chapter_slides_index
chapter: 4
chapter_title: "Development of Graphical User Interface (GUI)"
theme: class-12
deck_count_planned: 9
deck_count_shipped: 9
last_updated: 2026-10-03
---

# Chapter 4 · Slide Decks

The `.tsx` deck source files physically live in `apps/slides/src/decks/` (Vite requires that location). This file is the chapter-level index with deck IDs + preview URLs.

**Theme for every deck in this chapter: `github-dark`** (GitHub Dark: near-black canvas, grey panels, blue accent), set in `CHAPTER_THEMES` in `apps/slides/src/themes.ts`.

## How to preview

```bash
pnpm run slides:dev
# then open the URL for the deck you want
```

## Decks in this chapter (all 9 shipped)

| # | Deck ID | Purpose | Source file | Preview URL |
|---|---|---|---|---|
| 1 | `class-12-ch4-t4.1a-tkinter-intro` | 4.1a  ·  GUI Basics + Tkinter Introduction (12 slides) | apps/slides/src/decks/class-12-ch4-t4.1a-tkinter-intro.tsx | http://localhost:3030/?deck=class-12-ch4-t4.1a-tkinter-intro |
| 2 | `class-12-ch4-t4.1b-widgets-frames` | 4.1b  ·  Tkinter Widgets + Frames (14 slides) | apps/slides/src/decks/class-12-ch4-t4.1b-widgets-frames.tsx | http://localhost:3030/?deck=class-12-ch4-t4.1b-widgets-frames |
| 3 | `class-12-ch4-t4.1c-layout-management` | 4.1c  ·  Layout Management: pack, grid, place (15 slides) | apps/slides/src/decks/class-12-ch4-t4.1c-layout-management.tsx | http://localhost:3030/?deck=class-12-ch4-t4.1c-layout-management |
| 4 | `class-12-ch4-t4.1d-event-handling` | 4.1d  ·  Event Handling + Login Form (14 slides) | apps/slides/src/decks/class-12-ch4-t4.1d-event-handling.tsx | http://localhost:3030/?deck=class-12-ch4-t4.1d-event-handling |
| 5 | `class-12-ch4-t4.2a-database-concepts` | 4.2a  ·  Database Concepts + SQL Structure (15 slides) | apps/slides/src/decks/class-12-ch4-t4.2a-database-concepts.tsx | http://localhost:3030/?deck=class-12-ch4-t4.2a-database-concepts |
| 6 | `class-12-ch4-t4.2b-python-db-connection` | 4.2b  ·  Connecting Python to a Database (13 slides) | apps/slides/src/decks/class-12-ch4-t4.2b-python-db-connection.tsx | http://localhost:3030/?deck=class-12-ch4-t4.2b-python-db-connection |
| 7 | `class-12-ch4-t4.2c-crud-operations` | 4.2c  ·  CRUD Operations (16 slides) | apps/slides/src/decks/class-12-ch4-t4.2c-crud-operations.tsx | http://localhost:3030/?deck=class-12-ch4-t4.2c-crud-operations |
| 8 | `class-12-ch4-revision` | Chapter Revision deck (14 slides) | apps/slides/src/decks/class-12-ch4-revision.tsx | http://localhost:3030/?deck=class-12-ch4-revision |
| 9 | `class-12-ch4-quiz` | Chapter Quick Quiz (17 slides: 7 Q+Reveal pairs) | apps/slides/src/decks/class-12-ch4-quiz.tsx | http://localhost:3030/?deck=class-12-ch4-quiz |

**Convention:** decks do not set a theme. The chapter's theme (`github-dark`) is set once in `CHAPTER_THEMES` in `apps/slides/src/themes.ts`; decks use only `var(--...)` colour tokens. Browse all decks with the **Library** button (or `L`) in the slides app.

## Why the .tsx files are not physically here

Vite compiles from `apps/slides/src/` and only that directory. Moving `.tsx` files into `content/` or `curriculum/` would break the build. The physical .tsx stays in the app; this README is the chapter-level index.
