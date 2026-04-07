package dev.kabastack.netbank.user;

import java.util.ArrayList;
import java.util.List;
import net.datafaker.Faker;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class UserSeeder implements CommandLineRunner {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public UserSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  public void run(String... args) {
    if (userRepository.count() > 0) {
      System.out.println("Database already contains users. Seeder omitted.");
      return;
    }

    System.out.println("Generating users (Seeding)...");
    Faker faker = new Faker();
    List<User> users = new ArrayList<>();

    User admin = new User();
    admin.setFirstName("Admin");
    admin.setLastName("User");
    admin.setEmail("admin@kabastack.dev");
    admin.setPassword(passwordEncoder.encode("password123"));
    admin.setRole(User.Role.ADMIN);
    admin.setStatus(User.Status.ACTIVE);
    admin.setActive(true);
    users.add(admin);

    for (int i = 0; i < 10; i++) {
      User user = new User();
      user.setFirstName(faker.name().firstName());
      user.setLastName(faker.name().lastName());
      user.setEmail(faker.internet().emailAddress());

      user.setPassword(passwordEncoder.encode("password"));
      user.setRole(User.Role.USER);
      user.setStatus(User.Status.ACTIVE);
      user.setActive(true);

      users.add(user);
    }

    userRepository.saveAll(users);
    System.out.println("11 users successfully generated!");
  }
}
