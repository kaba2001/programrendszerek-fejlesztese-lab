package dev.kabastack.netbank.transactions;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TransactionResponse {
  private UUID id;
  private UUID accountId;
  private BigDecimal amount;
  private String transactionType;
  private String status;
  private String partnerAccountNumber;
  private String description;
  private Instant createdAt;
}
