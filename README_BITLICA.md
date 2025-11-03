1. Сборка образа Docker

```bash 
docker build \
  --target dev \
  --platform linux/amd64 \
  --build-arg INCLUDE_CHROMIUM=false \
  --build-arg INCLUDE_FIREFOX=false \
  --build-arg BUILD_TRANSLATIONS=false \
  --build-arg LOAD_EXAMPLES_DUCKDB=false \
  -t gcr.io/analytic-bi-1/superset-fork:latest  \
  .
```

2. Публикация образа в Google Container Registry

```bash
docker push gcr.io/analytic-bi-1/superset-fork:latest
```

3. Подключитесь к интансу и сконфигурируйте доступ к реджистри:
   * `gcloud auth configure-docker gcr.io`
   * `gcloud config set project analytic-bi-1`
   * `docker pull gcr.io/analytic-bi-1/superset-fork:latest`
4. В случае возникновения проблем с аутентификацией:
   * Проверьте настройку докер https://docs.docker.com/engine/install/linux-postinstall/
   * Используя команду `gcloud auth list`, убедитесь, что у выбранного аккаунта есть роль с пермишном **artifactregistry.repositories.downloadArtifacts** 
5. Передеплойте контейнеры с помощью docker compose:
```bash
docker compose -f docker-compose-image-tag.yml down
docker compose -f docker-compose-image-tag.yml up -d
```
