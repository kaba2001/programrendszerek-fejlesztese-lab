package dev.kabastack.netbank.contact;

import lombok.Data;

@Data
public class ContactRequest {
  private String partnerName;
  private String partnerAccountNumber;
}
