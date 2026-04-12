package dev.kabastack.netbank.account;

import dev.kabastack.netbank.user.User;
import dev.kabastack.netbank.user.UserRepository;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(2)
public class AccountSeeder implements CommandLineRunner {

  private final AccountRepository accountRepository;
  private final UserRepository userRepository;
  private final AccountService accountService;

  public AccountSeeder(
      AccountRepository accountRepository,
      UserRepository userRepository,
      AccountService accountService) {
    this.accountRepository = accountRepository;
    this.userRepository = userRepository;
    this.accountService = accountService;
  }

  @Override
  public void run(String... args) {
    if (accountRepository.count() > 0) {
      System.out.println("[SEEDER] Account table is not empty. Skipping seeding.");
      return;
    }

    System.out.println("[SEEDER] Generating initial Account data...");

    List<User> users = userRepository.findAll();

    if (users.isEmpty()) {
      System.out.println(
          "[SEEDER] No users found in database. Please ensure UserSeeder runs first.");
      return;
    }

    for (User user : users) {
      accountService.createAccountForUser(user, Account.Currency.HUF);

      if (user.getRole() == User.Role.ADMIN) {
        accountService.createAccountForUser(user, Account.Currency.EUR);
        System.out.println("[SEEDER] Created extra EUR account for Admin.");
      }
    }

    System.out.println(
        "[SEEDER] Account seeding completed. Created accounts for " + users.size() + " users.");
  }
}
