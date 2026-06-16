# ---- Build stage: compile & package the Spring Boot jar with Maven ----
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
# Cache dependencies in their own layer (re-resolved only when pom.xml changes).
COPY pom.xml .
RUN mvn -B -ntp dependency:go-offline
COPY src ./src
RUN mvn -B -ntp clean package -DskipTests

# ---- Runtime stage: small JRE image running the fat jar ----
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
# Play nice with small instances (e.g. Render free tier, 512MB).
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75.0"
# Spring binds to ${PORT:8080}; Render injects PORT at runtime.
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
