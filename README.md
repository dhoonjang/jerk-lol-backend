# Typescript-Template


해당 템플릿은 Github Private Packages에 배포된 eslint-config를 사용하고 있기 때문에 아래와 같이 로그인이 필요합니다.

```shell
npm login --registry=https://npm.pkg.github.com --scope=@scatterlab

Username: 깃허브 username
Password: 깃허브 Personal Access Token (repo, read:packages 권한 필요)
Email: 깃허브 email
```

## 기본 세팅

- [issue-pr-template](https://github.com/scatterlab/issue-pr-template)
- jest
- eslint-config
- scripts (build, start, dev, test, lint)
- github actions (lint, test)
- husky, lint-staged (lint)
