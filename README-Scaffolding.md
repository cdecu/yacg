# Yacg scaffolding
- Environment Setup
```bash
node --version
npm --version
git --version
npm i -g nx
npm i -g @nrwl/schematics
npm i -g @angular/cli
npm i -g npm-check-updates
```

- Create a new Nx workspace
```bash
npx create-nx-workspace@latest    # blank app
npm install --save-dev @nrwl/angular`
```

- Create a library, app
```bash
nx g @nrwl/node:library --name=core --linter=eslint --unitTestRunner=jest --tags=core --publishable --buildable --compiler=tsc --importPath=@yacg/core --testEnvironment=node --strict --standaloneConfig --setParserOptionsProject --no-interactive --dry-run
nx g @nrwl/angular:application --name=yacg --style=scss --viewEncapsulation=Emulated --skipTests --unitTestRunner=jest --e2eTestRunner=cypress --linter=eslint --strict --standaloneConfig --setParserOptionsProject --addTailwind --no-interactive --dry-run
nx g @nrwl/angular:application --name=yacg-ng --style=scss --viewEncapsulation=Emulated --skipTests --unitTestRunner=jest --e2eTestRunner=cypress --linter=eslint --strict --standaloneConfig --setParserOptionsProject --addTailwind --no-interactive --dry-run
nx g @nrwl/node:application --name=yacg-cmd --linter=eslint --unitTestRunner=jest --standaloneConfig --no-interactive --dry-run
```
