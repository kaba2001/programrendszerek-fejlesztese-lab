#!/bin/bash

# ==========================================
# Spring Boot Feature Generator
# ==========================================

# 1. Settings (To be modified for the "production" project)
BASE_PACKAGE="dev.kabastack.netbank"
BASE_DIR="src/main/java/$(echo $BASE_PACKAGE | tr '.' '/')"

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

# 3. Create directory
mkdir -p "$TARGET_DIR"

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

        // TODO: Generate and save dummy data using Datafaker
        // ${CLASS_NAME} dummy = new ${CLASS_NAME}();
        // repository.save(dummy);

        System.out.println("[SEEDER] ${CLASS_NAME} seeding completed.");
    }
}
EOF
echo "  ${CLASS_NAME}Seeder.java created."

echo "Done! The Neovim LSP will process the new files shortly."
