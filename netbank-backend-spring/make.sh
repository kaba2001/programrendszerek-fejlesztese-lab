#!/bin/bash

# ==========================================
# Spring Boot Feature Generator
# ==========================================

# 1. Settings
BASE_PACKAGE="dev.kabastack.netbank"
BASE_DIR="src/main/java/$(echo $BASE_PACKAGE | tr '.' '/')"
MIGRATION_DIR="src/main/resources/db/migration"

# 2. Input validation
if [ -z "$1" ]; then
    echo "Error: Missing feature name!"
    echo "Usage: ./make.sh <feature_name> (e.g.: ./make.sh account)"
    exit 1
fi

FEATURE_NAME=$(echo "$1" | tr '[:upper:]' '[:lower:]')
CLASS_NAME="$(tr '[:lower:]' '[:upper:]' <<< ${FEATURE_NAME:0:1})${FEATURE_NAME:1}"
TARGET_DIR="$BASE_DIR/$FEATURE_NAME"

echo "Starting generation: $CLASS_NAME (into package $FEATURE_NAME)..."

# 3. Create directories
mkdir -p "$TARGET_DIR"
mkdir -p "$MIGRATION_DIR"

# 4. Generate JPA Entity
cat <<EOF > "$TARGET_DIR/${CLASS_NAME}.java"
package ${BASE_PACKAGE}.${FEATURE_NAME};

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.Data;
import java.util.UUID;

@Data
@Entity
public class ${CLASS_NAME} {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

}
EOF
echo "  ${CLASS_NAME}.java (Entity) created."

# 5. Generate Repository
cat <<EOF > "$TARGET_DIR/${CLASS_NAME}Repository.java"
package ${BASE_PACKAGE}.${FEATURE_NAME};

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface ${CLASS_NAME}Repository extends JpaRepository<${CLASS_NAME}, UUID> {
}
EOF
echo "  ${CLASS_NAME}Repository.java created."

# 6. Generate Service
cat <<EOF > "$TARGET_DIR/${CLASS_NAME}Service.java"
package ${BASE_PACKAGE}.${FEATURE_NAME};

import org.springframework.stereotype.Service;

@Service
public class ${CLASS_NAME}Service {

    private final ${CLASS_NAME}Repository repository;

    public ${CLASS_NAME}Service(${CLASS_NAME}Repository repository) {
        this.repository = repository;
    }
}
EOF
echo "  ${CLASS_NAME}Service.java created."

# 7. Generate Controller
cat <<EOF > "$TARGET_DIR/${CLASS_NAME}Controller.java"
package ${BASE_PACKAGE}.${FEATURE_NAME};

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/${FEATURE_NAME}s")
public class ${CLASS_NAME}Controller {

    private final ${CLASS_NAME}Service service;

    public ${CLASS_NAME}Controller(${CLASS_NAME}Service service) {
        this.service = service;
    }
}
EOF
echo "  ${CLASS_NAME}Controller.java created."

# 8. Generate Seeder
cat <<EOF > "$TARGET_DIR/${CLASS_NAME}Seeder.java"
package ${BASE_PACKAGE}.${FEATURE_NAME};

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class ${CLASS_NAME}Seeder implements CommandLineRunner {

    private final ${CLASS_NAME}Repository repository;

    public ${CLASS_NAME}Seeder(${CLASS_NAME}Repository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() > 0) {
            System.out.println("[SEEDER] ${CLASS_NAME} table is not empty. Skipping seeding.");
            return;
        }

        System.out.println("[SEEDER] Generating initial ${CLASS_NAME} data...");
        // TODO: Generate and save dummy data
        System.out.println("[SEEDER] ${CLASS_NAME} seeding completed.");
    }
}
EOF
echo "  ${CLASS_NAME}Seeder.java created."

# 9. Generate Flyway Migration Template
EXISTING_FILES=$(ls -1 "$MIGRATION_DIR"/V*__*.sql 2>/dev/null | wc -l)
NEXT_VERSION=$((EXISTING_FILES + 1))
MIGRATION_FILE="$MIGRATION_DIR/V${NEXT_VERSION}__create_${FEATURE_NAME}s_table.sql"

cat <<EOF > "$MIGRATION_FILE"
-- Flyway Migration: V${NEXT_VERSION}__create_${FEATURE_NAME}s_table.sql
-- TODO: Add your CREATE TYPE statements for enums here (if any)

CREATE TABLE ${FEATURE_NAME}s (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- TODO: Add your columns here
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
EOF
echo "  Migration file created at: $MIGRATION_FILE"

echo "Done! The Neovim LSP will process the new files shortly."
