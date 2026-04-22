package dev.kabastack.netbank.transactions;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.Data;

@Data
public class SendMoneyRequest {
  private UUID fromAccountId;
  private String toAccountNumber;
  private BigDecimal amount;
  private String description;
}
