package dev.kabastack.netbank.card;

import dev.kabastack.netbank.account.Account;
import dev.kabastack.netbank.account.AccountRepository;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import net.datafaker.Faker;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(4)
public class CardSeeder implements CommandLineRunner {

  private final CardRepository repository;
  private final AccountRepository accountRepository;

  public CardSeeder(CardRepository repository, AccountRepository accountRepository) {
    this.repository = repository;
    this.accountRepository = accountRepository;
  }

  @Override
  public void run(String... args) {
    if (repository.count() > 0) {
      System.out.println("[SEEDER] Card table is not empty. Skipping seeding.");
      return;
    }

    System.out.println("[SEEDER] Generating initial Card data...");

    List<Account> accounts = accountRepository.findAll();

    if (accounts.isEmpty()) {
      System.out.println("[SEEDER] No accounts found. Please ensure AccountSeeder runs first.");
      return;
    }

    Faker faker = new Faker();
    String expirationDate =
        LocalDate.now().plusYears(3).format(DateTimeFormatter.ofPattern("MM/yy"));

    for (Account account : accounts) {
      Card card = new Card();
      card.setAccount(account);
      card.setCardNumber(faker.numerify("#### #### #### ####"));
      card.setExpirationDate(expirationDate);
      card.setCvv(faker.numerify("###"));
      card.setIsLocked(false);
      card.setCardType(Card.CardTypeEnum.PHYSICAL);
      repository.save(card);
    }

    System.out.println("[SEEDER] Card seeding completed. Created one card per account.");
  }
}
