package dev.kabastack.netbank.card;

import lombok.Data;

@Data
public class CardStatusRequest {
  private Boolean isLocked;
}
