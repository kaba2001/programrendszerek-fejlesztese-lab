package dev.kabastack.netbank.card;

import dev.kabastack.netbank.user.User;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cards")
public class CardController {

  private final CardService service;

  public CardController(CardService service) {
    this.service = service;
  }

  @GetMapping
  public ResponseEntity<List<CardResponse>> getMyCards(@AuthenticationPrincipal User user) {
    return ResponseEntity.ok(service.getCardsByUser(user));
  }

  @GetMapping("/{id}")
  public ResponseEntity<CardResponse> getCard(
      @PathVariable UUID id, @AuthenticationPrincipal User user) {
    return ResponseEntity.ok(service.getCardByIdForUser(id, user));
  }

  @PostMapping
  public ResponseEntity<CardResponse> createCard(
      @RequestBody CardRequest request, @AuthenticationPrincipal User user) {
    return ResponseEntity.ok(service.createCard(request, user));
  }

  @PatchMapping("/{id}/status")
  public ResponseEntity<CardResponse> updateCardStatus(
      @PathVariable UUID id,
      @RequestBody CardStatusRequest request,
      @AuthenticationPrincipal User user) {
    return ResponseEntity.ok(service.updateCardLockStatus(id, request.getIsLocked(), user));
  }
}
