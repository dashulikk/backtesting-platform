docker run -d \
  --name test-mongo \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=mongouser \
  -e MONGO_INITDB_ROOT_PASSWORD=secret \
  mongo:latest