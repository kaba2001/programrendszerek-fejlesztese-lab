package dev.kabastack.netbank.card;

import dev.kabastack.netbank.account.Account;
import dev.kabastack.netbank.account.AccountRepository;
import dev.kabastack.netbank.user.User;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import net.datafaker.Faker;
import org.springframework.stereotype.Service;

@Service
public class CardService {

  private final CardRepository repository;
  private final AccountRepository accountRepository;

  public CardService(CardRepository repository, AccountRepository accountRepository) {
    this.repository = repository;
    this.accountRepository = accountRepository;
  }

  public List<CardResponse> getAllCards() {
    return repository.findAll().stream().map(this::mapToResponse).toList();
  }

  public List<CardResponse> getCardsByUser(User user) {
    return repository.findAllByAccount_User(user).stream().map(this::mapToResponse).toList();
  }

  public CardResponse getCardByIdForUser(UUID cardId, User user) {
    Card card = getCardAndVerifyOwnership(cardId, user);
    return mapToResponse(card);
  }

  public CardResponse createCard(CardRequest request) {
    Account account =
        accountRepository
            .findById(request.getAccountId())
            .orElseThrow(() -> new RuntimeException("Account not found."));

    Faker faker = new Faker();
    String cardNumber = faker.numerify("#### #### #### ####");
    String expirationDate =
        LocalDate.now().plusYears(3).format(DateTimeFormatter.ofPattern("MM/yy"));
    String cvv = faker.numerify("###");

    Card card = new Card();
    card.setAccount(account);
    card.setCardNumber(cardNumber);
    card.setExpirationDate(expirationDate);
    card.setCvv(cvv);
    card.setIsLocked(false);
    card.setCardType(request.getCardType());

    return mapToResponse(repository.save(card));
  }

  public void deleteCard(UUID cardId) {
    Card card =
        repository.findById(cardId).orElseThrow(() -> new RuntimeException("Card not found."));
    repository.delete(card);
  }

  public CardResponse updateCardLockStatus(UUID cardId, Boolean isLocked, User user) {
    Card card = getCardAndVerifyOwnership(cardId, user);
    card.setIsLocked(isLocked);
    return mapToResponse(repository.save(card));
  }

  public CardResponse adminUpdateCardLockStatus(UUID cardId, Boolean isLocked) {
    Card card =
        repository.findById(cardId).orElseThrow(() -> new RuntimeException("Card not found."));
    card.setIsLocked(isLocked);
    return mapToResponse(repository.save(card));
  }

  private Card getCardAndVerifyOwnership(UUID cardId, User user) {
    Card card =
        repository.findById(cardId).orElseThrow(() -> new RuntimeException("Card not found."));

    boolean isOwner = card.getAccount().getUser().getId().equals(user.getId());
    boolean isAdmin = user.getRole() == User.Role.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new RuntimeException("Access denied.");
    }
    return card;
  }

  private CardResponse mapToResponse(Card card) {
    return CardResponse.builder()
        .id(card.getId())
        .accountId(card.getAccount().getId())
        .cardNumber(card.getCardNumber())
        .expirationDate(card.getExpirationDate())
        .cvv(card.getCvv())
        .isLocked(card.getIsLocked())
        .cardType(card.getCardType())
        .createdAt(card.getCreatedAt())
        .updatedAt(card.getUpdatedAt())
        .build();
  }
}
