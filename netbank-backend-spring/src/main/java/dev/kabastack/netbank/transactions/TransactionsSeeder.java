package dev.kabastack.netbank.transactions;

import dev.kabastack.netbank.account.Account;
import dev.kabastack.netbank.account.AccountRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Random;
import net.datafaker.Faker;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(4)
public class TransactionsSeeder implements CommandLineRunner {

  private final TransactionsRepository repository;
  private final AccountRepository accountRepository;

  public TransactionsSeeder(
      TransactionsRepository repository, AccountRepository accountRepository) {
    this.repository = repository;
    this.accountRepository = accountRepository;
  }

  @Override
  public void run(String... args) {
    if (repository.count() > 0) {
      System.out.println("[SEEDER] Transactions table is not empty. Skipping seeding.");
      return;
    }

    List<Account> accounts = accountRepository.findAll();
    if (accounts.size() < 2) {
      System.out.println("[SEEDER] Not enough accounts to seed transactions. Skipping.");
      return;
    }

    System.out.println("[SEEDER] Generating initial Transaction data...");

    Faker faker = new Faker();
    Random random = new Random();
    String[] descriptions = {
      "Rent payment", "Grocery shopping", "Utility bill", "Monthly subscription",
      "Restaurant dinner", "Online purchase", "Transfer", "Salary payment"
    };

    for (int i = 0; i < 30; i++) {
      Account from = accounts.get(random.nextInt(accounts.size()));
      Account to = accounts.get(random.nextInt(accounts.size()));
      if (from.getId().equals(to.getId())) continue;

      BigDecimal amount =
          BigDecimal.valueOf(random.nextInt(49900) + 100).divide(BigDecimal.valueOf(100));
      String description = descriptions[random.nextInt(descriptions.length)];

      Transaction expense = new Transaction();
      expense.setAccount(from);
      expense.setAmount(amount);
      expense.setTransactionType(Transaction.TransactionType.EXPENSE);
      expense.setStatus(Transaction.TransactionStatus.COMPLETED);
      expense.setPartnerAccountNumber(to.getAccountNumber());
      expense.setDescription(description);
      repository.save(expense);

      Transaction income = new Transaction();
      income.setAccount(to);
      income.setAmount(amount);
      income.setTransactionType(Transaction.TransactionType.INCOME);
      income.setStatus(Transaction.TransactionStatus.COMPLETED);
      income.setPartnerAccountNumber(from.getAccountNumber());
      income.setDescription(description);
      repository.save(income);
    }

    System.out.println("[SEEDER] Transaction seeding completed.");
  }
}
