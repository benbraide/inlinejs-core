# InlineJS Core

InlineJS Core is a TypeScript library that provides core directives and magic properties for the InlineJS reactive framework. The project compiles to both CommonJS and ES modules and provides webpack distributions for browser use.

Always reference these instructions first and only fallback to additional search and bash commands if the information here is incomplete or found to be incorrect.

## Working Effectively

### Initial Setup and Dependencies
Run these commands in sequence to set up the development environment:

- `npm install` -- installs all dependencies in ~15 seconds. You may see 3 moderate security vulnerabilities which are expected and can be ignored for development.

### Build Process
The project has two main build processes that must be run in the correct order:

1. **TypeScript Compilation** (REQUIRED FIRST):
   - `npm run compile` -- compiles TypeScript to CommonJS and ES modules. Takes ~5 seconds. NEVER CANCEL.
   - Creates `lib/common/` (CommonJS) and `lib/esm/` (ES modules) directories
   - Also runs automatically during `npm run prepublishOnly`

2. **Webpack Bundling** (OPTIONAL for development):
   - `npm run build` -- creates browser distribution bundles. Takes ~10 seconds. NEVER CANCEL.
   - Creates `dist/inlinejs-core.js` (599KB) and `dist/inlinejs-core.min.js` (168KB)
   - Only needed for testing browser distributions or publishing

### Testing
- `npm test` -- runs Mocha test suite with jsdom. Takes ~3 seconds. NEVER CANCEL.
  - Expects 1 failing test in lifecycle.spec (hx-uninit test) - this is a known issue and not your responsibility to fix
  - Runs 150 tests, 149 should pass
- `npm run ts-test` -- runs tests directly from TypeScript source. Takes ~6 seconds. Same test failure expected.
- `npm run dbg-test` -- runs TypeScript tests with debugger for troubleshooting
- `npm run dbg-js-test` -- runs compiled JavaScript tests with debugger

### Clean Development Workflow
For a complete development cycle with validation:

1. `rm -rf lib/ dist/` -- clean previous builds (optional)
2. `npm install` -- ensure dependencies are current
3. `npm run compile` -- compile TypeScript 
4. `npm test` -- validate functionality (149/150 tests should pass)
5. `npm run build` -- create distributions (if needed)

## Validation

### Build Validation
Always validate your changes using this complete sequence:
1. **ALWAYS** run `npm run compile` first - this is required for all other operations
2. **ALWAYS** run `npm test` to ensure no new test failures beyond the expected lifecycle test
3. Optionally run `npm run build` if you need to test browser distributions
4. The compiled outputs should include:
   - `lib/common/index.js` and `lib/common/index.d.ts` (CommonJS)
   - `lib/esm/index.js` and `lib/esm/index.d.ts` (ES modules)
   - `dist/inlinejs-core.js` and `dist/inlinejs-core.min.js` (browser bundles, if built)

### Manual Testing Scenarios
Since this is a DOM manipulation library, you should test functionality after making changes:
1. Create a simple HTML file that includes the distribution script
2. Test basic directives like `hx-data`, `hx-text`, `hx-on:click`
3. Verify reactivity works (data changes update the DOM)
4. Test that magic properties like `$component`, `$refs` are accessible

### Do NOT:
- Try to import the CommonJS modules directly in Node.js - they require a DOM environment (jsdom or browser)
- Run builds longer than 30 seconds - all operations complete in under 10 seconds
- Fix the failing lifecycle test - it's an existing issue unrelated to your changes
- Add linting tools - there are no linting configurations in this project

## Common Tasks

### Repository Structure
```
/src/                    # TypeScript source code
  /directive/           # Core directives (hx-data, hx-if, hx-each, etc.)
  /magic/              # Magic properties ($component, $refs, etc.)
  /test/               # Test files (*.spec.ts)
  /concepts/           # Core concepts and utilities
  index.ts             # Main exports
  entry.ts             # Entry point for InlineJS integration
  inlinejs-core.ts     # Webpack entry point

/lib/                   # Compiled output (created by npm run compile)
  /common/             # CommonJS modules  
  /esm/                # ES modules

/dist/                  # Webpack bundles (created by npm run build)
  inlinejs-core.js     # Development bundle
  inlinejs-core.min.js # Production bundle

package.json           # Dependencies and scripts
tsconfig.json         # TypeScript config for CommonJS
tsconfig.esm.json     # TypeScript config for ES modules
webpack.config.js     # Development bundle config
webpack2.config.js    # Production bundle config
```

### Key Dependencies
- `@benbraide/inlinejs` -- the core InlineJS framework this package extends
- `mocha` + `jsdom` -- testing framework with DOM simulation
- `typescript` + `ts-loader` -- TypeScript compilation
- `webpack` -- browser bundle creation

### Frequently Used Commands Output
These are commonly used commands and their expected outputs:

#### npm run
Lists all available scripts including:
- `test`, `ts-test`, `dbg-test`, `dbg-js-test` (testing)
- `compile`, `prepublishOnly` (compilation)
- `build` (webpack bundling)
- `upload`, `download`, `push` (publishing workflows)

#### Project Status Check
After successful compilation, you should see:
- `lib/common/` with 6+ files including index.js and index.d.ts
- `lib/esm/` with 5+ files including index.js and index.d.ts
- Test suite runs with 149/150 passing (lifecycle test failure is expected)

## Environment Requirements
- Node.js v20+ (tested with v20.19.5)
- npm v10+ (tested with v10.8.2)
- No additional global dependencies required
- Works on Linux/Unix systems (development environment)

## Security Note
The project may show npm audit warnings for mocha dependencies. These are development-only dependencies and can be safely ignored for development work.