package dev.kabastack.netbank.transactions;

import dev.kabastack.netbank.account.Account;
import dev.kabastack.netbank.account.AccountRepository;
import dev.kabastack.netbank.user.User;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TransactionsService {

  private final TransactionsRepository repository;
  private final AccountRepository accountRepository;

  public TransactionsService(
      TransactionsRepository repository, AccountRepository accountRepository) {
    this.repository = repository;
    this.accountRepository = accountRepository;
  }

  @Transactional
  public TransactionResponse sendMoney(SendMoneyRequest request, User user) {
    if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
      throw new RuntimeException("Amount must be positive");
    }

    Account fromAccount =
        accountRepository
            .findById(request.getFromAccountId())
            .orElseThrow(() -> new RuntimeException("Source account not found"));

    if (!fromAccount.getUser().getId().equals(user.getId()) && user.getRole() != User.Role.ADMIN) {
      throw new RuntimeException("Access denied to source account");
    }

    Account toAccount =
        accountRepository
            .findByAccountNumber(request.getToAccountNumber())
            .orElseThrow(() -> new RuntimeException("Destination account not found"));

    if (fromAccount.getId().equals(toAccount.getId())) {
      throw new RuntimeException("Cannot transfer to the same account");
    }

    // Acquire pessimistic write locks in UUID order to prevent deadlock
    // when concurrent transfers go in opposite directions (A→B and B→A).
    UUID firstId =
        fromAccount.getId().compareTo(toAccount.getId()) < 0
            ? fromAccount.getId()
            : toAccount.getId();
    UUID secondId =
        fromAccount.getId().compareTo(toAccount.getId()) < 0
            ? toAccount.getId()
            : fromAccount.getId();

    Account locked1 =
        accountRepository
            .findByIdForUpdate(firstId)
            .orElseThrow(() -> new RuntimeException("Account not found"));
    Account locked2 =
        accountRepository
            .findByIdForUpdate(secondId)
            .orElseThrow(() -> new RuntimeException("Account not found"));

    fromAccount = locked1.getId().equals(fromAccount.getId()) ? locked1 : locked2;
    toAccount = locked1.getId().equals(toAccount.getId()) ? locked1 : locked2;

    if (fromAccount.getStatus() != Account.Status.ACTIVE) {
      throw new RuntimeException("Source account is not active");
    }
    if (toAccount.getStatus() != Account.Status.ACTIVE) {
      throw new RuntimeException("Destination account is not active");
    }

    BigDecimal amount = request.getAmount();
    if (fromAccount.getBalance().compareTo(amount) < 0) {
      throw new RuntimeException("Insufficient balance");
    }

    fromAccount.setBalance(fromAccount.getBalance().subtract(amount));
    toAccount.setBalance(toAccount.getBalance().add(amount));
    accountRepository.save(fromAccount);
    accountRepository.save(toAccount);

    Transaction expense = buildTransaction(fromAccount, toAccount.getAccountNumber(), amount,
        Transaction.TransactionType.EXPENSE, request.getDescription());
    Transaction income = buildTransaction(toAccount, fromAccount.getAccountNumber(), amount,
        Transaction.TransactionType.INCOME, request.getDescription());

    repository.save(expense);
    repository.save(income);

    return mapToResponse(expense);
  }

  public List<TransactionResponse> getTransactionsForAccount(UUID accountId, User user) {
    Account account =
        accountRepository
            .findById(accountId)
            .orElseThrow(() -> new RuntimeException("Account not found"));

    if (!account.getUser().getId().equals(user.getId()) && user.getRole() != User.Role.ADMIN) {
      throw new RuntimeException("Access denied to this account");
    }

    return repository.findAllByAccount_IdOrderByCreatedAtDesc(accountId).stream()
        .map(this::mapToResponse)
        .toList();
  }

  public List<TransactionResponse> getAllTransactions() {
    return repository.findAll().stream().map(this::mapToResponse).toList();
  }

  private Transaction buildTransaction(
      Account account,
      String partnerAccountNumber,
      BigDecimal amount,
      Transaction.TransactionType type,
      String description) {
    Transaction tx = new Transaction();
    tx.setAccount(account);
    tx.setAmount(amount);
    tx.setTransactionType(type);
    tx.setStatus(Transaction.TransactionStatus.COMPLETED);
    tx.setPartnerAccountNumber(partnerAccountNumber);
    tx.setDescription(description);
    return tx;
  }

  private TransactionResponse mapToResponse(Transaction tx) {
    return TransactionResponse.builder()
        .id(tx.getId())
        .accountId(tx.getAccount().getId())
        .amount(tx.getAmount())
        .transactionType(tx.getTransactionType().name())
        .status(tx.getStatus().name())
        .partnerAccountNumber(tx.getPartnerAccountNumber())
        .description(tx.getDescription())
        .createdAt(tx.getCreatedAt())
        .build();
  }
}
