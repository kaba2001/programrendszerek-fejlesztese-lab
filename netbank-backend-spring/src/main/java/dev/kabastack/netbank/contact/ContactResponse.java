package dev.kabastack.netbank.contact;

import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ContactResponse {
  private UUID id;
  private String partnerName;
  private String partnerAccountNumber;
}
