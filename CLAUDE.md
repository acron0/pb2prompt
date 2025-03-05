# pb2prompt - Claude Assistant Guide

## Build & Test Commands
- Build: `pnpm build` (or `pnpm build:ts` for TS only)
- Check types: `pnpm check`
- Lint: `pnpm lint` (fix with `pnpm lint-fix`)
- Run tests: `pnpm test`
- Run single test: `pnpm vitest run test/path/to/file.test.ts`
- Test coverage: `pnpm coverage`

## Code Style Guidelines
- **TypeScript**: Strict mode, ES modules, NodeNext resolution
- **Formatting**: 2-space indentation, 120 char width, double quotes, no semicolons
- **Imports**: Use Effect import style (e.g., `import * as Effect from "effect/Effect"`)
- **Naming**: camelCase for variables/functions, PascalCase for types/classes
- **Error Handling**: Use Effect for functional error handling
- **Types**: Prefer explicit types, use generics when appropriate
- **Project Structure**: Core logic in `src/`, tests in `test/`
- **Testing**: Using @effect/vitest with describe/it pattern

## Development Workflow
- Use tsx for running TypeScript files directly
- Follow consistent commit message format for changesets