package dev.kabastack.netbank.contact;

import dev.kabastack.netbank.account.Account;
import dev.kabastack.netbank.account.AccountRepository;
import dev.kabastack.netbank.user.User;
import dev.kabastack.netbank.user.UserRepository;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class ContactSeeder implements CommandLineRunner {

  private final ContactRepository contactRepository;
  private final AccountRepository accountRepository;
  private final UserRepository userRepository;

  public ContactSeeder(
      ContactRepository contactRepository,
      AccountRepository accountRepository,
      UserRepository userRepository) {
    this.contactRepository = contactRepository;
    this.accountRepository = accountRepository;
    this.userRepository = userRepository;
  }

  @Override
  @Transactional
  public void run(String... args) {
    if (contactRepository.count() > 0) {
      System.out.println("[SEEDER] Contact table is not empty. Skipping seeding.");
      return;
    }

    System.out.println("[SEEDER] Generating initial internal Contact data...");

    List<User> users = userRepository.findAll();
    List<Account> allAccounts = accountRepository.findAll();

    if (users.isEmpty() || allAccounts.isEmpty()) {
      System.out.println(
          "[SEEDER] Missing users or accounts. Please ensure UserSeeder and AccountSeeder run"
              + " first.");
      return;
    }

    for (User user : users) {
      List<Account> otherAccounts =
          allAccounts.stream()
              .filter(account -> !account.getUser().getId().equals(user.getId()))
              .collect(Collectors.toList());

      Collections.shuffle(otherAccounts);

      int contactsToCreate = Math.min(3, otherAccounts.size());

      for (int i = 0; i < contactsToCreate; i++) {
        Account targetAccount = otherAccounts.get(i);
        User targetUser = targetAccount.getUser();

        Contact contact = new Contact();
        contact.setUser(user);

        contact.setPartnerName("Contact: " + targetUser.getEmail());

        contact.setPartnerAccountNumber(targetAccount.getAccountNumber());

        contactRepository.save(contact);
      }
    }

    System.out.println(
        "[SEEDER] Contact seeding completed. Wired real internal accounts together.");
  }
}
