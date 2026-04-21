package dev.kabastack.netbank.account;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AccountResponse {
  private UUID id;
  private UUID userId;
  private String accountNumber;
  private BigDecimal balance;
  private String currency;
  private String status;
}
