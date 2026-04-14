package dev.kabastack.netbank.card;

import java.util.UUID;
import lombok.Data;

@Data
public class CardRequest {
  private UUID accountId;
  private Card.CardTypeEnum cardType;
}
