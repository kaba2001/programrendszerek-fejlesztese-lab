package dev.kabastack.netbank.card;

import java.time.Instant;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CardResponse {
  private UUID id;
  private UUID accountId;
  private String cardNumber;
  private String expirationDate;
  private String cvv;
  private Boolean isLocked;
  private Card.CardTypeEnum cardType;
  private Instant createdAt;
  private Instant updatedAt;
}
