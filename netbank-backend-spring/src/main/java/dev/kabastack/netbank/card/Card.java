package dev.kabastack.netbank.card;

import dev.kabastack.netbank.account.Account;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

@Data
@Entity
@Table(name = "cards")
public class Card {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "account_id", nullable = false)
  private Account account;

  @Column(name = "card_number", nullable = false, unique = true, updatable = false)
  private String cardNumber;

  @Column(name = "expiration_date", nullable = false, updatable = false)
  private String expirationDate;

  @Column(nullable = false, updatable = false)
  private String cvv;

  @Column(name = "is_locked", nullable = false)
  private Boolean isLocked;

  @Enumerated(EnumType.STRING)
  @JdbcTypeCode(SqlTypes.NAMED_ENUM)
  @Column(name = "card_type", nullable = false)
  private CardTypeEnum cardType;

  @CreationTimestamp
  @Column(name = "created_at", updatable = false)
  private Instant createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at")
  private Instant updatedAt;

  public enum CardTypeEnum {
    PHYSICAL,
    VIRTUAL
  }
}
