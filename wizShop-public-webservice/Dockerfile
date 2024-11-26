# Step 1: Build Stage
FROM maven:3.9.9-eclipse-temurin-21 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the pom.xml file and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the source code and build the application
COPY src ./src
RUN mvn clean package -DskipTests

# Step 2: Run Stage
FROM eclipse-temurin:21

# Set the working directory inside the container
WORKDIR /app

# Copy the jar file from the build stage
COPY --from=builder /app/target/wizshop-public-webservice-0.0.3-SNAPSHOT.jar app.jar

# Expose the port the service will run on
EXPOSE 9002

# Set the entry point to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
