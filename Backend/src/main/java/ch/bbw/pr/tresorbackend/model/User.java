package ch.bbw.pr.tresorbackend.model;

import jakarta.persistence.*;
import lombok.*;

import java.sql.ConnectionBuilder;

/**
 * User
 * @author Peter Rutschmann
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity()
@Builder(toBuilder = true)
@Table(name = "user")
public class User {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @Column(nullable = false, name="first_name")
   private String firstName;

   @Column(nullable = false, name="last_name")
   private String lastName;

   @Column(nullable = false, unique = true)
   private String email;

   @Column(nullable = false)
   private String password;

   @Column(name = "salt")
   private String salt;

   @Column(name = "role")
    private String role;

   public User(Long id, String firstName, String lastName, String email, String password) {
      this.id = id;
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
      this.password = password;
   }
}