# redgoose-note

## Install

저장소를 클론 받으면 다음 명령어로 실행해줘야한다.

```bash
git clone https://github.com/gooose-eth/note.redgoose.me.git
cd note.redgoose.me
bun install
```


## Usage

### Development

```bash
bun run dev
bun run dev:live
```

### Production

```bash
npm run build
npm run start
```


## .env

`.env.local`파일을 만들어서 `.env` 내용을 참고하여 사용한다.


## docker

### make image

이미지 만들기

```shell
# Mac Silicone for Linux
docker buildx build --platform=linux/amd64 -t redgoose/note.redgoose.me:latest .
# Mac Silicone for MacOS
docker buildx build --platform=linux/arm64/v8 -t redgoose/note.redgoose.me:latest .
# Mac Intel
docker build -t redgoose/note.redgoose.me:latest .
```
