package dev.kabastack.netbank.card;

import dev.kabastack.netbank.user.User;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CardRepository extends JpaRepository<Card, UUID> {
  List<Card> findAllByAccount_User(User user);
}
