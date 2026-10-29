# yacg

Yet another Code generator. It is a spare time project !  
Test site live at https://cdecu.github.io/yacg/  
No it is not yacc :( it is just a small personal project.  
It is just the beginning but the idea is to

- Transform raw text data into code.
  - guess type
  - guess required
  - guess enum

# Build with

- [Nx Workspace 24](https://nx.dev). (I know it is a bazooka for a small project)
- [TypeScript](https://www.typescriptlang.org/)
- [Angular 22](https://angular.dev/)
- [Vite+](https://viteplus.dev/) for tests, linting, formatting, and packaging.
  and of course node, npm|yarn, ....

# Development

Use `npm run cmd` to build and run the command-line app, `npx nx build yacg-ng` to build the Angular app, and `npx nx run-many -t lint test build` to run workspace checks. Run `npm test` for the Vitest suites and `npm run fmt` to format the workspace.

# Planning

# License

Copyright (c) 2021-2024 Carlos.<br>
Licensed under the [MIT](https://opensource.org/licenses/MIT) License.
