package dev.kabastack.netbank.account;

import java.util.UUID;
import lombok.Data;

@Data
public class AccountRequest {
  private UUID userId;
  private Account.Currency currency;
}
