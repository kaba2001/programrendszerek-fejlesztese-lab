package dev.kabastack.netbank.transactions;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/transactions")
public class AdminTransactionsController {

  private final TransactionsService service;

  public AdminTransactionsController(TransactionsService service) {
    this.service = service;
  }

  @GetMapping
  public ResponseEntity<List<TransactionResponse>> getAllTransactions() {
    return ResponseEntity.ok(service.getAllTransactions());
  }
}
