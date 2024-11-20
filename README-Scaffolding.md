# Yacg scaffolding
- Check dev environment Setup
```sh
node --version
npm --version
git --version
nx --version
create-nx-workspace  --version
```

- Create a new Nx workspace
```sh
npx create-nx-workspace@latest        
cd new-nx-workspace-dir
nx add @nx/node
nx add @nx/angular
```

- Create a core library
```sh
nx g @nx/node:library --directory=libs/core --name=core --publishable=true --importPath=@yacg/core --setParserOptionsProject=true --simpleModuleName=true --strict=true --no-interactive --dry-run
nx lint core
nx build core
nx test core
```

- Create a node cmd application
```sh
nx g @nx/node:application --directory=apps/yacg-cmd --name=yacg-cmd --setParserOptionsProject=true --swcJest=true --no-interactive --dry-run
nx lint yacg-cmd
nx build yacg-cmd
nx test yacg-cmd
```

- Create a angular application
```sh
nx g @nx/angular:application --directory=apps/yacg-ng --name=yacg-ng --routing=false --addTailwind=true --e2eTestRunner=none --minimal=true --setParserOptionsProject=true --skipTests=true --style=scss  --no-interactive --dry-run
nx g @schematics/angular:component --name=header --project=yacg-ng --style=scss --changeDetection=OnPush --displayBlock=true --path=apps/yacg-ng/src/components --prefix=yacg --selector=yacg-header --skipTests=true --type=  --no-interactive --dry-run
nx g @schematics/angular:component --name=footer --project=yacg-ng --style=scss --changeDetection=OnPush --displayBlock=true --path=apps/yacg-ng/src/components --prefix=yacg --selector=yacg-footer --skipTests=true --type=  --no-interactive --dry-run
nx g @schematics/angular:component --name=resources --project=yacg-ng --style=scss --changeDetection=OnPush --displayBlock=true --path=apps/yacg-ng/src/components --prefix=yacg --selector=yacg-resources --skipTests=true --type=  --no-interactive --dry-run
nx g @schematics/angular:component --name=input --project=yacg-ng --style=scss --changeDetection=OnPush --displayBlock=true --path=apps/yacg-ng/src/components --prefix=yacg --selector=yacg-input --skipTests=true --type=  --no-interactive --dry-run
nx g @schematics/angular:component --name=output --project=yacg-ng --style=scss --changeDetection=OnPush --displayBlock=true --path=apps/yacg-ng/src/components --prefix=yacg --selector=yacg-output --skipTests=true --type=  --no-interactive --dry-run

npm install @ctrl/ngx-github-buttons --save
npm install monaco-editor ngx-monaco-editor-v2 --save

nx g @schematics/angular:service --name=parser --project=yacg-ng --path=apps/yacg-ng/src/app --skipTests=true --no-interactive --dry-run

nx lint yacg-ng
nx build yacg-ng
```
> Add provideMonacoEditor() to the  appConfig.providers see [ngx monaco](https://javascript.plainenglish.io/integrate-ngx-monaco-editor-in-your-angular-18-project-31aeab5cc971)



- Clone and run
```sh
git clone https://github.com/cdecu/yacg.git  ~/Src/yacg
cd ~/Src/yacg
npm install
npm run cmd
```

- Update all using npm-check-updates
```bash
ncu 
ncu -u
```


## Inspiration to read 
- https://github.com/Himenon/openapi-typescript-code-generator
- https://ts-ast-viewer.com/

- https://hiphip.app/?s=09
- https://jsonapi.org/examples/?s=09
- https://github.com/bcherny/json-schema-to-typescript?s=09
- https://indepth.dev/posts/1442/ngrx-bad-practices?s=09
- https://twitter.com/stack_tracy_/status/1370983902718791683?s=09
- https://dev-academy.com/angular-user-login-and-registration-guide-cookies-and-jwt/?utm_source=twitter&s=09
- https://www.jayfreestone.com/writing/bulletproof-flag/
- https://github.com/kapunahelewong/module-injector-tree/blob/master/src/app/lazy/lazy.module.ts

- https://github.com/compodoc
- https://ngx-codemirror.vercel.app/
- https://les-enovateurs.com/
- https://tsquery-playground.firebaseapp.com/

- https://github.com/dalenguyen/dalenguyen.github.io
- https://danielcaballero88.github.io/
- https://github.com/angular-schule/angular-cli-ghpages/tree/main
- https://ej2.syncfusion.com/angular/demos/#/fluent2/range-slider/orientation
- 

``- Deplay to Github Pages
```bash
git fetch 
git status 
git checkout gh-pages
git merge --squash main
nx run yacg-ng:build:gh-pages
rm -Rv docs/*
mv -v  dist/apps/yacg-ng/browser/*  docs/
git add docs
git commit -m "Published"
git push 
```

