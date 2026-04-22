package dev.kabastack.netbank.transactions;

import dev.kabastack.netbank.user.User;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
public class TransactionsController {

  private final TransactionsService service;

  public TransactionsController(TransactionsService service) {
    this.service = service;
  }

  @GetMapping
  public ResponseEntity<List<TransactionResponse>> getTransactions(
      @RequestParam UUID accountId, @AuthenticationPrincipal User user) {
    return ResponseEntity.ok(service.getTransactionsForAccount(accountId, user));
  }

  @PostMapping("/send")
  public ResponseEntity<TransactionResponse> sendMoney(
      @RequestBody SendMoneyRequest request, @AuthenticationPrincipal User user) {
    return ResponseEntity.ok(service.sendMoney(request, user));
  }
}
