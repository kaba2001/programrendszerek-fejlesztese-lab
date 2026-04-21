package dev.kabastack.netbank.card;

import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/cards")
public class AdminCardController {

  private final CardService service;

  public AdminCardController(CardService service) {
    this.service = service;
  }

  @GetMapping
  public ResponseEntity<List<CardResponse>> getAllCards() {
    return ResponseEntity.ok(service.getAllCards());
  }

  @PostMapping
  public ResponseEntity<CardResponse> createCard(@RequestBody CardRequest request) {
    return ResponseEntity.ok(service.createCard(request));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteCard(@PathVariable UUID id) {
    service.deleteCard(id);
    return ResponseEntity.noContent().build();
  }

  @PatchMapping("/{id}/status")
  public ResponseEntity<CardResponse> updateCardStatus(
      @PathVariable UUID id, @RequestBody CardStatusRequest request) {
    return ResponseEntity.ok(service.adminUpdateCardLockStatus(id, request.getIsLocked()));
  }
}
