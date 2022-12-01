# Yacg start development

- Clone Repo
```bash
git clone https://github.com/cdecu/yacg.git  Src/yacg
cd Src/yacg
npm install
```

- Run yacg-cmd
Set defaultProject in nx.json to yacg-cmd
```bash 
npm build
```

- Customize bash
  - add alias r='npm run'
  - add package.json scripts
    - "build-cmd": "nx build yacg-cmd",
    - "cmd": "nx build yacg-cmd && node dist/apps/yacg-cmd/main.js"
    - ...

so we can use `r cmd` to build code  
   

