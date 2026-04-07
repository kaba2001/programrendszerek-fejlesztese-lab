source .env
./mvnw flyway:clean -Dflyway.url=$SPRING_NETBANK_DB_URL -Dflyway.user=$SPRING_NETBANK_DB_USER -Dflyway.password=$SPRING_NETBANK_DB_PASSWORD
