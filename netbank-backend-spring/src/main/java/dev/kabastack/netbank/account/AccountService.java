package dev.kabastack.netbank.account;

import dev.kabastack.netbank.user.User;
import dev.kabastack.netbank.user.UserRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class AccountService {

  private final AccountRepository repository;
  private final UserRepository userRepository;
  private final Random random = new Random();

  public AccountService(AccountRepository repository, UserRepository userRepository) {
    this.repository = repository;
    this.userRepository = userRepository;
  }

  public Account createAccountForUser(User user, Account.Currency currency) {
    Account account = new Account();
    account.setUser(user);
    account.setAccountNumber(generateHungarianIban());
    account.setBalance(BigDecimal.ZERO);
    account.setCurrency(currency);
    account.setStatus(Account.Status.ACTIVE);
    return repository.save(account);
  }

  public AccountResponse createAccount(AccountRequest request) {
    User user =
        userRepository
            .findById(request.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found"));
    return mapToResponse(createAccountForUser(user, request.getCurrency()));
  }

  public void deleteAccount(UUID id) {
    Account account =
        repository.findById(id).orElseThrow(() -> new RuntimeException("Account not found"));
    repository.delete(account);
  }

  public AccountResponse updateAccountStatus(UUID id, Account.Status status) {
    Account account =
        repository.findById(id).orElseThrow(() -> new RuntimeException("Account not found"));
    account.setStatus(status);
    return mapToResponse(repository.save(account));
  }

  private String generateHungarianIban() {
    StringBuilder iban = new StringBuilder("HU");
    int checkDigits = random.nextInt(99) + 1;
    iban.append(String.format("%02d", checkDigits));
    for (int i = 0; i < 24; i++) {
      iban.append(random.nextInt(10));
    }
    return iban.toString();
  }

  public List<AccountResponse> getAllAccounts() {
    return repository.findAll().stream().map(this::mapToResponse).toList();
  }

  public List<AccountResponse> getAccountsByUser(User user) {
    return repository.findAllByUser(user).stream().map(this::mapToResponse).toList();
  }

  public AccountResponse getAccountByIdForUser(UUID accountId, User user) {
    Account account =
        repository.findById(accountId).orElseThrow(() -> new RuntimeException("Account not found"));

    if (!account.getUser().getId().equals(user.getId()) && user.getRole() != User.Role.ADMIN) {
      throw new RuntimeException("Access denied to this account");
    }

    return mapToResponse(account);
  }

  private AccountResponse mapToResponse(Account account) {
    return AccountResponse.builder()
        .id(account.getId())
        .userId(account.getUser().getId())
        .accountNumber(account.getAccountNumber())
        .balance(account.getBalance())
        .currency(account.getCurrency().name())
        .status(account.getStatus().name())
        .build();
  }
}
